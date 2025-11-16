/*
  # Create portfolio items and resume content tables

  1. New Tables
    - `portfolio_items`
      - `id` (uuid, primary key)
      - `title` (text) - project title
      - `category` (text) - category like "Media", "Branding", etc
      - `year` (text) - year completed
      - `image` (text) - image filename
      - `order` (integer) - display order
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resume_content`
      - `id` (uuid, primary key)
      - `section` (text) - section name (summary, competencies, experience, skills, education)
      - `title` (text) - section title
      - `content` (text) - rich content/html
      - `order` (integer) - display order
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - All data is public (no auth required for viewing)
    - Only admin edge function can modify data

  3. Notes
    - Portfolio items and resume content can be managed via admin interface
    - Changes are immediately reflected on the public site
*/

CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  year text NOT NULL,
  image text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio items"
  ON portfolio_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read resume content"
  ON resume_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Disable all modifications"
  ON portfolio_items FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Disable all modifications on resume"
  ON resume_content FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

INSERT INTO portfolio_items (title, category, year, image, "order")
VALUES 
  ('Project Alpha', 'Media', '2024', 'unnamed.jpg', 1),
  ('Digital Campaign', 'Branding', '2024', 'unnamed2.jpg', 2),
  ('Visual Identity', 'Branding', '2023', NULL, 3),
  ('Product Launch', 'Live Events', '2023', NULL, 4),
  ('Brand Refresh', 'Print', '2023', NULL, 5),
  ('Web Experience', 'Media', '2024', NULL, 6),
  ('Conference Design', 'Live Events', '2024', NULL, 7),
  ('Magazine Layout', 'Print', '2023', NULL, 8),
  ('Documentary Film', 'Media', '2024', NULL, 9),
  ('Corporate Identity', 'Branding', '2023', NULL, 10);

INSERT INTO resume_content (section, title, content, "order")
VALUES 
  ('summary', 'EXECUTIVE SUMMARY | INNOVATION LEADER', 'Entrepreneurial leader leveraging over two decades of success in Brand Management, Business Development, and Media to pioneer the next generation of audience engagement through Augmented Reality (AR) SaaS and AI driven strategy. Proven expertise in developing and executing integrated brand strategies, fostering audience loyalty, and identifying new revenue opportunities to drive business growth. My experience is rooted in creating tangible, high impact moments, including directing all IP content and fan engagement at major live events, such as the X-Games, the US Open of Surf, and the launch of Cross Colours - Music Without Prejudice.', 1),
  ('competencies', 'CORE COMPETENCIES', 'AR/AI Product Development | Integrated Brand Strategy | Digital Paid Media (Google/Meta) | Cross-Functional Leadership | B2B Client Acquisition | Revenue Stream Identification | Creative Concept Direction | Agency & Vendor Coordination', 2),
  ('experience', 'PROFESSIONAL EXPERIENCE', '<h4>C Scott Consulting Group - Freelance Brand Strategist | Los Angeles, CA</h4><p>Jan 2010–Present</p><ul><li>Innovation & Product Development: Conceptualized, directed, and led a new venture to develop a novel Augmented Reality (AR) SaaS product by assembling a cross-industry team of experts in sports, media, and AI for a Q1 2026 launch.</li></ul>', 3),
  ('skills', 'TECHNICAL & PLATFORM SKILLS', 'Analytics & CRM: Mailchimp, KPI Analysis, Performance Metrics | Creative Suite: Adobe Creative Suite, Da Vinci Editing Suite | Productivity: Trello & Slack, Microsoft Office, Windows & Mac | Design/Other: AutoCAD, AR/AI Conceptualization Tools', 4),
  ('education', 'EDUCATION', 'Wilmington University | Sept. 1998–Dec 2002 | Bachelor of Science, Business Management', 5);
