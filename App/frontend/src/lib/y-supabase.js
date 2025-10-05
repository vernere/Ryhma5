import debug from 'debug';
import { EventEmitter } from 'events';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { REALTIME_LISTEN_TYPES } from '@supabase/realtime-js/src/RealtimeChannel';

class SupabaseProvider extends EventEmitter {
  constructor(doc, supabase, config) {
    super();

    this.doc = doc;
    this.supabase = supabase;
    this.config = config || {};

    this.awareness = this.config.awareness || new awarenessProtocol.Awareness(doc);
    this.connected = false;
    this.channel = null;
    this._synced = false;
    this.resyncInterval = undefined;
    this.id = doc.clientID;
    this.version = 0;

    this.logger = debug('y-' + doc.clientID);
    this.logger.enabled = true;

    this.on('connect', this.onConnect);
    this.on('disconnect', this.onDisconnect);

    this.logger('constructor initializing');
    this.logger('connecting to Supabase Realtime', doc.guid);

    if (this.config.resyncInterval || typeof this.config.resyncInterval === 'undefined') {
      if (this.config.resyncInterval && this.config.resyncInterval < 3000) {
        throw new Error('resync interval of less than 3 seconds');
      }
      this.logger(`setting resync interval to every ${(this.config.resyncInterval || 5000) / 1000} seconds`);
      this.resyncInterval = setInterval(() => {
        this.logger('resyncing (resync interval elapsed)');
        this.emit('message', Y.encodeStateAsUpdate(this.doc));
        if (this.channel) {
          this.channel.send({
            type: 'broadcast',
            event: 'message',
            payload: Array.from(Y.encodeStateAsUpdate(this.doc)),
          });
        }
      }, this.config.resyncInterval || 5000);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.removeSelfFromAwarenessOnUnload.bind(this));
    } else if (typeof process !== 'undefined') {
      process.on('exit', () => this.removeSelfFromAwarenessOnUnload());
    }

    this.on('awareness', (update) => {
      if (this.channel) {
        this.channel.send({
          type: 'broadcast',
          event: 'awareness',
          payload: Array.from(update),
        });
      }
    });

    this.on('message', (update) => {
      if (this.channel) {
        this.channel.send({
          type: 'broadcast',
          event: 'message',
          payload: Array.from(update),
        });
      }
    });

    this.connect();
    this.doc.on('update', this.onDocumentUpdate.bind(this));
    this.awareness.on('update', this.onAwarenessUpdate.bind(this));
  }

  isOnline(online) {
    if (online === undefined) return this.connected;
    this.connected = online;
    return this.connected;
  }

  onDocumentUpdate(update, origin) {
    if (origin !== this) {
      this.logger('document updated locally, broadcasting update to peers', this.isOnline());
      this.emit('message', update);
      this.save();
    }
  }

  onAwarenessUpdate({ added, updated, removed }, origin) {
    const changedClients = added.concat(updated).concat(removed);
    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
    this.emit('awareness', awarenessUpdate);
  }

  removeSelfFromAwarenessOnUnload() {
    awarenessProtocol.removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload');
  }

  async save() {
    const content = Array.from(Y.encodeStateAsUpdate(this.doc));

    const { error } = await this.supabase
      .from(this.config.tableName)
      .update({ [this.config.columnName]: content })
      .eq(this.config.idName || 'id', this.config.id);

    if (error) {
      throw error;
    }

    this.emit('save', this.version);
  }

  async onConnect() {
    this.logger('connected');

    const { data, error, status } = await this.supabase
      .from(this.config.tableName)
      .select(`${this.config.columnName}`)
      .eq(this.config.idName || 'id', this.config.id)
      .single();

    this.logger('retrieved data from supabase', status);

    if (data && data[this.config.columnName]) {
      this.logger('applying update to yjs');
      try {
        this.applyUpdate(Uint8Array.from(data[this.config.columnName]));
      } catch (error) {
        this.logger(error);
      }
    }

    this.logger('setting connected flag to true');
    this.isOnline(true);

    this.emit('status', [{ status: 'connected' }]);

    if (this.awareness.getLocalState() !== null) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
      this.emit('awareness', awarenessUpdate);
    }
  }

  applyUpdate(update, origin) {
    this.version++;
    Y.applyUpdate(this.doc, update, origin);
  }

  disconnect() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  connect() {
    this.channel = this.supabase.channel(this.config.channel);
    if (this.channel) {
      this.channel
        .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'message' }, ({ payload }) => {
          this.onMessage(Uint8Array.from(payload), this);
        })
        .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'awareness' }, ({ payload }) => {
          this.onAwareness(Uint8Array.from(payload));
        })
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            this.emit('connect', this);
          }

          if (status === 'CHANNEL_ERROR') {
            this.logger('CHANNEL_ERROR', err);
            this.emit('error', this);
          }

          if (status === 'TIMED_OUT') {
            this.emit('disconnect', this);
          }

          if (status === 'CLOSED') {
            this.emit('disconnect', this);
          }
        });
    }
  }

  get synced() {
    return this._synced;
  }

  set synced(state) {
    if (this._synced !== state) {
      this.logger('setting sync state to ' + state);
      this._synced = state;
      this.emit('synced', [state]);
      this.emit('sync', [state]);
    }
  }

  onConnecting() {
    if (!this.isOnline()) {
      this.logger('connecting');
      this.emit('status', [{ status: 'connecting' }]);
    }
  }

  onDisconnect() {
    this.logger('disconnected');

    this.synced = false;
    this.isOnline(false);
    this.logger('set connected flag to false');
    if (this.isOnline()) {
      this.emit('status', [{ status: 'disconnected' }]);
    }

    const states = Array.from(this.awareness.getStates().keys()).filter(
      (client) => client !== this.doc.clientID
    );
    awarenessProtocol.removeAwarenessStates(this.awareness, states, this);
  }

  onMessage(message, origin) {
    if (!this.isOnline()) return;
    try {
      this.applyUpdate(message, this);
    } catch (err) {
      this.logger(err);
    }
  }

  onAwareness(message) {
    awarenessProtocol.applyAwarenessUpdate(this.awareness, message, this);
  }

  onAuth(message) {
    this.logger(`received ${message.byteLength} bytes from peer: ${message}`);

    if (!message) {
      this.logger(`Permission denied to channel`);
    }
    this.logger('processed message (type = MessageAuth)');
  }

  destroy() {
    this.logger('destroying');

    if (this.resyncInterval) {
      clearInterval(this.resyncInterval);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.removeSelfFromAwarenessOnUnload);
    } else if (typeof process !== 'undefined') {
      process.off('exit', () => this.removeSelfFromAwarenessOnUnload);
    }

    this.awareness.off('update', this.onAwarenessUpdate);
    this.doc.off('update', this.onDocumentUpdate);

    if (this.channel) this.disconnect();
  }
}

export { SupabaseProvider };