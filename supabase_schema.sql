-- 1. Create Profiles Table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum', 'Ketua Divisi', 'Wakil Ketua Divisi', 'Member')),
  division TEXT, -- 'LTEC' for top-level, or specific like 'Phoenix', 'SysAdmin'
  phone_number TEXT
);

-- 2. Create System Settings Table (Recruitment Toggles)
CREATE TABLE system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  recruitment_open BOOLEAN DEFAULT false,
  wa_api_key TEXT,
  wa_api_url TEXT
);

-- Initialize settings with 1 row
INSERT INTO system_settings (id, recruitment_open) VALUES (1, false) ON CONFLICT DO NOTHING;

-- 3. Create Registrations Table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  division_choice TEXT NOT NULL,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 5. Define Basic Policies (Adjust as needed for strictness)
-- Anyone can read settings
CREATE POLICY "Public read access to settings" ON system_settings FOR SELECT USING (true);

-- Only Ketua Umum & Waketum can edit settings
CREATE POLICY "Ketua/Wakil Umum manage settings" ON system_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Ketua Umum', 'Wakil Ketua Umum'))
);

-- Anyone can submit a registration
CREATE POLICY "Public insert registrations" ON registrations FOR INSERT WITH CHECK (true);

-- Admins & Core Board can read all registrations
CREATE POLICY "Board readable registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum'))
);

-- Division heads can read registrations for their specific division
CREATE POLICY "Divisions readable specific registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Ketua Divisi', 'Wakil Ketua Divisi') AND division = registrations.division_choice)
);

-- Update permissions: Ketum/Waketum can update any registration status, Division heads can update their own
CREATE POLICY "Status Update Registrations" ON registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (
    role IN ('Ketua Umum', 'Wakil Ketua Umum') 
    OR 
    (role IN ('Ketua Divisi', 'Wakil Ketua Divisi') AND division = registrations.division_choice)
  ))
);
