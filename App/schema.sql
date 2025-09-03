-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.note_collaborators (
  note_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role USER-DEFINED DEFAULT 'viewer'::collaborator_role_enum,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT note_collaborators_pkey PRIMARY KEY (note_id, user_id),
  CONSTRAINT note_collaborators_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(note_id),
  CONSTRAINT note_collaborators_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.note_presence (
  presence_id uuid NOT NULL DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL,
  user_id uuid NOT NULL,
  cursor_position jsonb,
  last_active timestamp without time zone,
  CONSTRAINT note_presence_pkey PRIMARY KEY (presence_id),
  CONSTRAINT note_presence_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT note_presence_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(note_id)
);
CREATE TABLE public.note_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tag_id uuid,
  note_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT note_tags_pkey PRIMARY KEY (id),
  CONSTRAINT note_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id),
  CONSTRAINT note_tags_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(note_id)
);
CREATE TABLE public.notes (
  note_id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text DEFAULT 'New note'::text,
  content text,
  creator_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notes_pkey PRIMARY KEY (note_id),
  CONSTRAINT notes_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id)
);
CREATE TABLE public.tags (
  tag_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (tag_id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text DEFAULT 'New user'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);