-- Starts the sorting every 15 minutes, a few minutes after each collection.
-- Run it once in the Supabase SQL Editor, after the migration
-- 20261112120000_sorting.sql. It uses the same secret as the collection
-- (cron_secret in Vault) and stores its own address. See README, "Sorteringen".
--
-- Running the file again replaces the schedule. To stop the sorting:
--   select cron.unschedule('sort');

select vault.create_secret('https://nyhetsanalys.vercel.app/api/jobs/sort', 'sort_url')
where not exists (select 1 from vault.secrets where name = 'sort_url');

select cron.unschedule('sort') where exists (select 1 from cron.job where jobname = 'sort');

select cron.schedule(
  'sort',
  '5,20,35,50 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'sort_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);

select jobname, schedule, active from cron.job order by jobname;
