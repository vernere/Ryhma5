alter table public.notes enable row level security;
alter table public.note_collaborators enable row level security;
alter table public.users enable row level security;

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

create policy "Users can view their own collaborations"
on public.note_collaborators
for select
using (user_id = auth.uid());

drop policy if exists "Only owners can add collaborators" on public.note_collaborators;
create policy "Only owners can add collaborators"
on public.note_collaborators
for insert
with check (
  exists (
    select 1
    from public.notes n
    where n.note_id = note_collaborators.note_id
      and n.creator_id = auth.uid()
  )
);

drop policy if exists "Only owners can add collaborators" on public.note_collaborators;
create policy "Only owners can add collaborators"
on public.note_collaborators
for insert
with check (
  exists (
    select 1
    from public.notes n
    where n.note_id = note_collaborators.note_id
      and n.creator_id = auth.uid()
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
