import * as Y from "yjs";

const MESSAGE_UPDATE = "update";

export const setupSupabaseProvider = (doc, channel) => {
    const providerOrigin = {};
    let isSubscribed = false;
    let pendingUpdates = [];

    const updateHandler = (update, origin) => {
        console.log("Yjs document updated, origin:", origin);
        
        if (origin === providerOrigin) {
            console.log("Skipping broadcast - update came from network");
            return;
        }

        const payload = { data: Array.from(update) };
        
        if (!isSubscribed) {
            console.log("Channel not yet subscribed, queuing update");
            pendingUpdates.push(payload);
            return;
        }

        console.log("Broadcasting Yjs update to Supabase channel");
        channel.send({
            type: "broadcast",
            event: MESSAGE_UPDATE,
            payload,
        });
    };

    doc.on("update", updateHandler);

    channel
        .on("broadcast", { event: MESSAGE_UPDATE }, ({ payload }) => {
            if (!payload?.data || payload.data.length === 0) {
                console.log("Received empty broadcast payload");
                return;
            }
            try {
                console.log("📥 Applying Yjs update from Supabase channel, bytes:", payload.data.length);
                Y.applyUpdate(doc, new Uint8Array(payload.data), providerOrigin);
            } catch (err) {
                console.error("Error applying Yjs update:", err);
            }
        })
        .on('system', {}, payload => {
            console.log("Supabase realtime system payload:", payload);
        })
        .subscribe((status) => {
            console.log("📡 Supabase channel status:", status);
            
            if (status === "SUBSCRIBED") {
                isSubscribed = true;
                console.log("✅ Subscribed to Supabase channel for Yjs updates");
                
                const fullState = Y.encodeStateAsUpdate(doc);
                console.log("📤 Sending full document state, bytes:", fullState.length);
                channel.send({
                    type: "broadcast",
                    event: MESSAGE_UPDATE,
                    payload: { data: Array.from(fullState) },
                });

                if (pendingUpdates.length > 0) {
                    console.log(`📤 Sending ${pendingUpdates.length} queued updates`);
                    pendingUpdates.forEach(payload => {
                        channel.send({
                            type: "broadcast",
                            event: MESSAGE_UPDATE,
                            payload,
                        });
                    });
                    pendingUpdates = [];
                }
            } else if (status === "CHANNEL_ERROR") {
                console.error("❌ Channel error occurred");
                isSubscribed = false;
            } else if (status === "TIMED_OUT") {
                console.error("❌ Channel subscription timed out");
                isSubscribed = false;
            } else if (status === "CLOSED") {
                console.log("🔴 Channel closed");
                isSubscribed = false;
            }
        });

    const destroy = () => {
        console.log("🗑️ Destroying Supabase provider");
        isSubscribed = false;
        pendingUpdates = [];
        doc.off("update", updateHandler);
        channel.unsubscribe();
    };

    return { doc, destroy, origin: providerOrigin };
};