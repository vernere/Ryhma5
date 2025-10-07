alter table public.notes enable row level security;
alter table public.note_collaborators enable row level security;
alter table public.users enable row level security;
alter table public.note_tags enable row level security;

-- NOTES

drop policy if exists "Users can view notes they own or collaborate on" on public.notes;
create policy "Users can view notes they own or collaborate on"
on public.notes
for select
using (
  creator_id = auth.uid()
  or exists (
    select 1
    from public.note_collaborators nc
    where nc.note_id = notes.note_id
      and nc.user_id = auth.uid()
  )
);

drop policy if exists "Owners and editors can update notes" on public.notes;
create policy "Owners and editors can update notes"
on public.notes
for update
using (
  creator_id = auth.uid()
  or exists (
    select 1
    from public.note_collaborators nc
    where nc.note_id = notes.note_id
      and nc.user_id = auth.uid()
      and nc.role = 'editor'
  )
);

drop policy if exists "Only owners can delete notes" on public.notes;
create policy "Only owners can delete notes"
on public.notes
for delete
using (creator_id = auth.uid());

drop policy if exists "Users can create their own notes" on public.notes;
create policy "Users can create their own notes"
on public.notes
for insert
with check (creator_id = auth.uid());

-- NOTE_COLLABORATORS

drop policy if exists "Users can view their own collaborations" on public.note_collaborators;
create policy "Users can view their own collaborations"
on public.note_collaborators
for select
using (user_id = auth.uid());

drop policy "Owners can add collaborators and users can accept invitations" ON note_collaborators;
create policy "Owners can add collaborators and users can accept invitations" 
ON note_collaborators 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM notes n 
    WHERE n.note_id = note_collaborators.note_id 
    AND n.creator_id = auth.uid()
  )
  OR
  (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM collaboration_invites ci 
      WHERE ci.note_id = note_collaborators.note_id 
      AND ci.recipient_id = auth.uid() 
      AND ci.status = 'accepted'
    )
  )
);

drop policy if exists "Only owners can update collaborator roles" on public.note_collaborators;
create policy "Only owners can update collaborator roles"
on public.note_collaborators
for update
using (
  exists (
    select 1
    from public.notes n
    where n.note_id = note_collaborators.note_id
      and n.creator_id = auth.uid()
  )
);

drop policy if exists "Only owners can remove collaborators" on public.note_collaborators;
create policy "Only owners can remove collaborators"
on public.note_collaborators
for delete
using (
  exists (
    select 1
    from public.notes n
    where n.note_id = note_collaborators.note_id
      and n.creator_id = auth.uid()
  )
);

-- NOTE_TAGS

create policy "Collaborators can view note tags"
on public.note_tags
for select
using (
  exists (
    select 1
    from public.note_collaborators nc
    where nc.note_id = note_tags.note_id
      and nc.user_id = auth.uid()
  )
);

create policy "Collaborators can insert note tags"
on public.note_tags
for insert
with check (
  exists (
    select 1
    from public.note_collaborators nc
    where nc.note_id = note_tags.note_id
      and nc.user_id = auth.uid()
  )
);

create policy "Collaborators can delete note tags"
on public.note_tags
for delete
using (
  exists (
    select 1
    from public.note_collaborators nc
    where nc.note_id = note_tags.note_id
      and nc.user_id = auth.uid()
  )
);

-- USERS

create policy "Public rows are viewable by everyone." on users to authenticated
  for select using (true);
  
create policy "Users can insert their own row." on users to authenticated
  for insert with check ((select auth.uid()) = id);
  
create policy "Users can update own row." on users to authenticated
  for update using ((select auth.uid()) = id);

-- FAVOURITES

create policy fav_select_own on public.favorites
  for select using (auth.uid() = user_id);

create policy fav_insert_own on public.favorites
  for insert with check (auth.uid() = user_id);

create policy fav_delete_own on public.favorites
  for delete using (auth.uid() = user_id);

-- TAGS

create policy "Anyone can view tags" on public.tags to authenticated
  for select using (true);

