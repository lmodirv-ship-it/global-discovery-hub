
-- SERVERS
CREATE TABLE public.servers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'eu-west',
  cpu_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  ram_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  disk_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.servers TO anon, authenticated;
GRANT ALL ON public.servers TO service_role;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read servers" ON public.servers FOR SELECT USING (true);

-- SITES
CREATE TABLE public.sites (
  id BIGSERIAL PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  title TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'online',
  users_count INT NOT NULL DEFAULT 0,
  database_size_mb INT NOT NULL DEFAULT 0,
  storage_size_mb INT NOT NULL DEFAULT 0,
  server_id BIGINT REFERENCES public.servers(id) ON DELETE SET NULL,
  ssl_expires_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sites TO anon, authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read sites" ON public.sites FOR SELECT USING (true);

-- DATABASES
CREATE TABLE public.databases (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  engine TEXT NOT NULL DEFAULT 'postgres',
  size_mb INT NOT NULL DEFAULT 0,
  connections INT NOT NULL DEFAULT 0,
  site_id BIGINT REFERENCES public.sites(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'healthy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.databases TO anon, authenticated;
GRANT ALL ON public.databases TO service_role;
ALTER TABLE public.databases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read databases" ON public.databases FOR SELECT USING (true);

-- BACKUPS
CREATE TABLE public.backups (
  id BIGSERIAL PRIMARY KEY,
  site_id BIGINT REFERENCES public.sites(id) ON DELETE CASCADE,
  size_mb INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success',
  kind TEXT NOT NULL DEFAULT 'full',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.backups TO anon, authenticated;
GRANT ALL ON public.backups TO service_role;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read backups" ON public.backups FOR SELECT USING (true);

-- SECURITY LOGS
CREATE TABLE public.security_logs (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  ip TEXT,
  site_id BIGINT REFERENCES public.sites(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.security_logs TO anon, authenticated;
GRANT ALL ON public.security_logs TO service_role;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read security_logs" ON public.security_logs FOR SELECT USING (true);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  level TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read notifications" ON public.notifications FOR SELECT USING (true);

-- ACTIVITY LOGS
CREATE TABLE public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL DEFAULT 'system',
  action TEXT NOT NULL,
  target TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_logs TO anon, authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read activity_logs" ON public.activity_logs FOR SELECT USING (true);

-- AI COMMANDS
CREATE TABLE public.ai_commands (
  id BIGSERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  response TEXT,
  status TEXT NOT NULL DEFAULT 'done',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_commands TO anon, authenticated;
GRANT ALL ON public.ai_commands TO service_role;
ALTER TABLE public.ai_commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read ai_commands" ON public.ai_commands FOR SELECT USING (true);

-- SYSTEM METRICS (time series)
CREATE TABLE public.system_metrics (
  id BIGSERIAL PRIMARY KEY,
  server_id BIGINT REFERENCES public.servers(id) ON DELETE CASCADE,
  cpu NUMERIC(5,2) NOT NULL,
  ram NUMERIC(5,2) NOT NULL,
  disk NUMERIC(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.system_metrics TO anon, authenticated;
GRANT ALL ON public.system_metrics TO service_role;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read system_metrics" ON public.system_metrics FOR SELECT USING (true);

-- SEED SERVERS
INSERT INTO public.servers (name, region, cpu_pct, ram_pct, disk_pct, status) VALUES
  ('core-eu-1', 'eu-west', 42.5, 61.2, 58.0, 'online'),
  ('core-eu-2', 'eu-west', 71.0, 74.8, 63.4, 'warning'),
  ('core-us-1', 'us-east', 28.1, 44.3, 39.7, 'online'),
  ('edge-ma-1', 'af-north', 55.6, 52.9, 47.2, 'online');

-- SEED SITES (sample from HN Group portfolio)
INSERT INTO public.sites (domain, title, category, status, users_count, database_size_mb, storage_size_mb, server_id, ssl_expires_at) VALUES
  ('hn-ai.com', 'HN AI', 'ai', 'online', 12480, 4200, 18400, 1, '2026-11-14'),
  ('hn-driver.com', 'HN Driver', 'transport', 'online', 8210, 3100, 12200, 1, '2026-10-02'),
  ('hn-db.com', 'HN Database', 'database', 'warning', 4550, 8800, 24500, 2, '2026-09-19'),
  ('hn-chat.com', 'HN Chat', 'chat', 'online', 15600, 5400, 21000, 3, '2026-12-01'),
  ('hn-immo.com', 'HN Immo', 'real-estate', 'online', 3120, 2100, 9800, 1, '2027-01-11'),
  ('hn-finance.com', 'HN Finance', 'finance', 'online', 6780, 4700, 11200, 3, '2026-12-20'),
  ('hnclinik-ai.com', 'HN Clinik AI', 'ai', 'online', 2140, 1900, 7300, 1, '2026-10-30'),
  ('souk-hn.com', 'Souk HN', 'ecommerce', 'warning', 9430, 6200, 33400, 2, '2026-08-05'),
  ('tanjaprint.com', 'Tanja Print', 'ecommerce', 'online', 1820, 1300, 6900, 4, '2026-11-22'),
  ('hn-groupe.com', 'HN Groupe', 'corporate', 'online', 540, 900, 4100, 4, '2027-02-10'),
  ('adkhar.app', 'Adkhar', 'content', 'online', 22800, 700, 3200, 3, '2026-12-05'),
  ('carwash-hn.com', 'CarWash HN', 'ecommerce', 'online', 970, 800, 3100, 4, '2026-11-01'),
  ('slavacall.com', 'SlavaCall', 'chat', 'danger', 430, 500, 2100, 2, '2026-07-30'),
  ('buildcv-ai.com', 'BuildCV AI', 'ai', 'online', 5410, 1800, 6600, 3, '2026-12-15'),
  ('hn-video.com', 'HN Video', 'media', 'online', 3220, 2600, 48200, 1, '2026-11-08');

-- SEED DATABASES
INSERT INTO public.databases (name, engine, size_mb, connections, site_id, status)
SELECT domain || '_db', 'postgres', database_size_mb, floor(random()*80+10)::int, id, status FROM public.sites;

-- SEED BACKUPS (2 per site)
INSERT INTO public.backups (site_id, size_mb, status, kind, created_at)
SELECT id, database_size_mb + storage_size_mb, 'success', 'full', now() - (interval '1 day' * g)
FROM public.sites, generate_series(1,2) g;

-- SEED SECURITY LOGS
INSERT INTO public.security_logs (event, severity, ip) VALUES
  ('Failed login attempt', 'warning', '185.220.101.42'),
  ('SSL renewed', 'info', NULL),
  ('Brute-force blocked', 'critical', '45.155.204.10'),
  ('New API key issued', 'info', NULL),
  ('Suspicious traffic spike', 'warning', '103.21.244.0');

-- SEED NOTIFICATIONS
INSERT INTO public.notifications (title, body, level) VALUES
  ('التخزين تجاوز 80%', 'الخادم core-eu-2 يقترب من الحد الأقصى', 'warning'),
  ('CPU مرتفع', 'core-eu-2 عند 71%', 'warning'),
  ('شهادة SSL', 'slavacall.com تنتهي خلال 22 يوماً', 'critical'),
  ('نسخ احتياطي مكتمل', 'تم نسخ 15 موقعاً بنجاح', 'info');

-- SEED ACTIVITY LOGS
INSERT INTO public.activity_logs (actor, action, target) VALUES
  ('admin', 'نشر نسخة جديدة', 'hn-ai.com'),
  ('system', 'نسخ احتياطي تلقائي', 'hn-chat.com'),
  ('admin', 'أنشأ قاعدة بيانات', 'souk-hn.com'),
  ('ai-agent', 'نظّف الملفات المؤقتة', 'hn-db.com'),
  ('admin', 'أعاد تشغيل الخادم', 'core-eu-2');

-- SEED AI COMMANDS
INSERT INTO public.ai_commands (prompt, response, status) VALUES
  ('حلل الأداء لكل المواقع', 'المتوسط 62ms، أعلى استجابة hn-db.com', 'done'),
  ('نظّف ملفات temp', 'تم حذف 1.2GB من 8 مواقع', 'done'),
  ('اقترح تحسينات SEO', 'تم توليد 24 توصية', 'done');

-- SEED METRICS (last 12 points per server)
INSERT INTO public.system_metrics (server_id, cpu, ram, disk, recorded_at)
SELECT s.id,
       40 + random()*40,
       50 + random()*30,
       40 + random()*30,
       now() - (interval '1 hour' * g)
FROM public.servers s, generate_series(0,11) g;
