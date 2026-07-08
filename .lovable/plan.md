
## الفكرة
موقع Portfolio عربي/إنجليزي يجمع أفضل ما في المواقع العالمية (أناقة Apple، ديناميكية Linear، تدرجات Stripe، شبكة Vercel) لعرض **149 موقعاً** من مشاريعك تحت مظلة HN Group.

## الهوية البصرية
- **الأسلوب**: داكن سينمائي + لمسات ذهبية/نيون
- **الألوان**: خلفية `#0A0A0F`، سطوح `#12121A`، ذهبي `#D4AF37`، بنفسجي كهربائي `#7C3AED`، أبيض دافئ
- **الخطوط**: عناوين `Space Grotesk` + عربي `Cairo/Tajawal`، جسم `Inter`
- **الحركة**: Framer Motion — hero بحروف تُبنى، بطاقات ترتفع عند hover مع توهج، عدّاد أرقام، parallax خفيف
- **RTL** كامل مع تبديل لغة

## الصفحات (TanStack Routes)
```
/                → Landing (Hero + إحصائيات + عيّنة مختارة + CTA)
/projects        → معرض 149 موقعاً كامل + بحث + فلاتر
/projects/$slug  → صفحة موقع مفرد (لقطة، وصف، رابط زيارة)
/about           → عن HN Group ورحلة البناء
/contact         → تواصل
```

## الأقسام في Landing
1. **Hero**: "149 موقعاً. رؤية واحدة." — اسم HN بحروف كبيرة متحركة + زر "اكتشف المعرض"
2. **Stats Bar**: 149 موقع · 12 نطاق · 8 صناعات (عدّاد متحرك)
3. **Featured Grid** (bento): 6 مواقع مميزة مع لقطات
4. **Categories**: AI · Transport (Driver) · Database · Chat · E-commerce · Media/Video · Real Estate · Finance
5. **Timeline**: رحلة البناء
6. **Footer** أنيق

## معرض المشاريع
- تصنيف ذكي تلقائي حسب النطاق الفرعي/الكلمات المفتاحية:
  - **AI** (hn-ai, hnclinik-ai, ai.*, buildcv-ai)
  - **Transport** (hn-driver, hndriver, ride, delivery, call)
  - **Database & Infra** (hn-db, api, auth, files, ws, status)
  - **Chat & Comms** (hn-chat, slavacall, hnchat)
  - **Media** (video, film, cinema, studio)
  - **E-commerce** (store, hnapps, tanjaprint, carwash, lavagenizar)
  - **Real Estate** (hn-immo, imm)
  - **Finance** (hn-finance, facturation, tender, rfp)
  - **Content/Life** (adkhar, blog, cv, learn, nawat)
  - **Corporate** (hn-groupe, groupe-hn, goupe-hn)
- بحث فوري + فلترة بالفئة + عرض شبكي/قائمة
- كل بطاقة: أيقونة الفئة + النطاق + وصف مختصر + شارة "زيارة" مع أيقونة سهم

## التفاصيل التقنية
- **Stack**: TanStack Start موجود، Tailwind v4، shadcn، Framer Motion
- **البيانات**: `src/data/projects.ts` — مصفوفة 149 مشروعاً `{url, domain, category, title, description}` مُولّدة من قائمتك
- **مكوّنات**: `Hero`, `StatsCounter`, `CategoryPill`, `ProjectCard`, `ProjectGrid`, `SearchBar`, `LanguageToggle`, `Navbar`, `Footer`
- **لقطات**: نستعمل خدمة screenshot عامة (thum.io) لتوليد معاينة تلقائية لكل موقع بدون رفع صور
- **SEO**: head() لكل صفحة، og:image لصفحة Landing (نولّد hero image)، JSON-LD Organization
- **الأداء**: lazy load للبطاقات، بحث client-side (149 عنصر خفيف)
- **RTL**: `dir="rtl"` ديناميكي + `lang` switch

## خطة التنفيذ (تلقائي بدون توقف)
1. تثبيت framer-motion + fontsource للخطوط
2. تحديث `src/styles.css` بنظام الألوان الجديد + tokens
3. إنشاء `src/data/projects.ts` بكل الـ149 موقعاً مصنفة
4. بناء المكوّنات المشتركة (Navbar/Footer/Cards)
5. بناء 5 صفحات routes مع head metadata
6. توليد og:image فاخر
7. تحقق بصري عبر Playwright + لقطات

**النتيجة**: موقع بمستوى Awwwards يعرض كل إنجازاتك في مكان واحد.
