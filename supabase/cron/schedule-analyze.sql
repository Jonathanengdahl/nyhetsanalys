-- Starts the analysis job twice an hour. Each run writes at most one draft,
-- for the approved topic that has waited longest. Run it once in the
-- Supabase SQL Editor, after the migration 20261124120000_topic_pages.sql.
-- The job does nothing until ANALYSIS_ENABLED is "true" in Vercel.
-- It uses the same secret as the other jobs (cron_secret in Vault).
-- See README, "Analysen".
--
-- Running the file again replaces the schedule. To stop the analysis:
--   select cron.unschedule('analyze');

select vault.create_secret('https://nyhetsanalys.vercel.app/api/jobs/analyze', 'analyze_url')
where not exists (select 1 from vault.secrets where name = 'analyze_url');

select cron.unschedule('analyze') where exists (select 1 from cron.job where jobname = 'analyze');

select cron.schedule(
  'analyze',
  '10,40 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'analyze_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 300000
  ) as request_id;
  $$
);

select jobname, schedule, active from cron.job order by jobname;
