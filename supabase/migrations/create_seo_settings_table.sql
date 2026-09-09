-- SEO sozlamalari jadvali: sayt bo'yicha va har bir sahifa uchun meta ma'lumotlarni
-- admin panel orqali tahrirlash imkonini beradi (Google va boshqa qidiruv tizimlarida
-- ko'rinishni yaxshilash uchun).
CREATE TABLE IF NOT EXISTS portfolio_seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  title text,
  description text,
  keywords text,
  og_image text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE portfolio_seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO settings are publicly readable"
  ON portfolio_seo_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert SEO settings"
  ON portfolio_seo_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update SEO settings"
  ON portfolio_seo_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete SEO settings"
  ON portfolio_seo_settings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

INSERT INTO portfolio_seo_settings (page_key, title, description, keywords)
VALUES
  ('global', 'Avrangzeb Abdujalilov | Software Engineer & AI/Backend Developer',
   'Abdujalilov Avrangzeb - Software Engineer specializing in AI, backend development, network security, and cybersecurity. Based in Jeonju, South Korea. Portfolio, projects, and contact.',
   'Avrangzeb Abdujalilov, Abdujalilov Avrangzeb, Software Engineer, AI Engineer, Backend Developer, Network Administrator, Cybersecurity, CCNA, Woosuk University'),
  ('notes', 'Yozuvlar | Avrangzeb Abdujalilov', 'Avrangzeb Abdujalilov texnik yozuvlari, o''rganish jarayoni va shaxsiy fikrlari.', 'yozuvlar, notes, blog, Avrangzeb Abdujalilov'),
  ('gallery', 'Galereya | Avrangzeb Abdujalilov', 'Avrangzeb Abdujalilov surat va sertifikatlar galereyasi.', 'galereya, sertifikatlar, rasmlar'),
  ('news', 'IT Yangiliklar | Avrangzeb Abdujalilov', 'IT sohasidagi so''nggi yangiliklar va tahlillar.', 'IT yangiliklar, texnologiya yangiliklari'),
  ('knowledge-hub', 'Bilimlar Markazi | Avrangzeb Abdujalilov', 'Tarmoq va axborot xavfsizligi bo''yicha bilimlar markazi.', 'tarmoq, axborot xavfsizligi, bilimlar markazi'),
  ('books', 'Kitoblar | Avrangzeb Abdujalilov', 'Avrangzeb Abdujalilov o''qigan kitoblar va sevimli iqtiboslar.', 'kitoblar, iqtiboslar, book quotes')
ON CONFLICT (page_key) DO NOTHING;
