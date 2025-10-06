CREATE OR REPLACE FUNCTION handle_invitation_acceptance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status IS DISTINCT FROM 'accepted' THEN
    INSERT INTO public.note_collaborators (note_id, user_id, role, joined_at)
    VALUES (NEW.note_id, NEW.recipient_id, NEW.role, now())
    ON CONFLICT (note_id, user_id) DO NOTHING;

    DELETE FROM public.collaboration_invites
    WHERE invitation_id = NEW.invitation_id;

    RETURN NULL;
  ELSIF NEW.status = 'declined' AND OLD.status IS DISTINCT FROM 'declined' THEN
    DELETE FROM public.collaboration_invites
    WHERE invitation_id = NEW.invitation_id;

    RETURN NULL;
  END IF;

  RETURN NEW;
END;
$$;