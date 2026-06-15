-- Run this in your Supabase SQL Editor

-- Takes table
create table takes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  topic text not null,
  angle text not null,
  headline text not null,
  body text not null,
  upvotes integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table takes enable row level security;

-- Anyone can read takes
create policy "Takes are publicly readable"
  on takes for select
  using (true);

-- Logged in users can insert their own takes
create policy "Users can insert their own takes"
  on takes for insert
  with check (auth.uid() = user_id);

-- Users can update upvotes on any take
create policy "Anyone can upvote"
  on takes for update
  using (true)
  with check (true);

-- Users can delete their own takes
create policy "Users can delete their own takes"
  on takes for delete
  using (auth.uid() = user_id);
