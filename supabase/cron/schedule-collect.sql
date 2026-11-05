-- Starts the collection every 15 minutes. Run it once in the Supabase SQL
-- Editor, after the migration 20261106090000_collection.sql and after the
-- site is deployed with CRON_SECRET. See README, "Insamlingen".
--
-- Before running this file:
-- 1. Turn on the extensions pg_cron and pg_net under Database > Extensions.
-- 2. Store the secret and the address in Vault (never in git). The secret is
--    the same value as CRON_SECRET in Vercel:
--      select vault.create_secret('<samma värde som CRON_SECRET>', 'cron_secret');
--      select vault.create_secret('https://<domänen>/api/jobs/collect', 'collect_url');
--
-- Running the file again replaces the schedule. To stop the collection:
--   select cron.unschedule('collect');

select cron.unschedule('collect') where exists (select 1 from cron.job where jobname = 'collect');

select cron.schedule(
  'collect',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'collect_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);
