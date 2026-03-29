-- =============================================================================
-- SEED DATA: Base Flows, Variants, and Steps
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- BASE FLOWS
-- =============================================================================

INSERT INTO base_flows (id, slug, title, description, icon, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'visa-application', 'Visa Application Process', 'Complete guide to applying for or renewing your visa at the Ausländerbehörde.', '🛂', 1),
  ('10000000-0000-0000-0000-000000000002', 'city-registration', 'City Registration (Anmeldung)', 'Register your address at the Bürgeramt — required within 14 days of moving.', '🏠', 2),
  ('10000000-0000-0000-0000-000000000003', 'health-insurance', 'Health Insurance Setup', 'Set up mandatory health insurance coverage in Germany.', '🏥', 3),
  ('10000000-0000-0000-0000-000000000004', 'bank-account', 'Bank Account Opening', 'Open a German bank account (Girokonto) — needed for rent, salary, insurance.', '🏦', 4),
  ('10000000-0000-0000-0000-000000000005', 'university-enrollment', 'University Enrollment', 'Complete your enrollment (Immatrikulation) at a German university.', '🎓', 5);

-- =============================================================================
-- FLOW VARIANTS
-- =============================================================================

-- ---- VISA APPLICATION variants ----

-- Student Visa - First Application
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'student_visa', 'first',
   'Student Visa — First Application',
   'Steps for obtaining your initial German student visa (§16b AufenthG).');

-- Student Visa - Renewal
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'student_visa', 'renewal',
   'Student Visa — Renewal',
   'Steps for renewing your student residence permit before it expires.');

-- Blue Card - First Application
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'blue_card', 'first',
   'EU Blue Card — First Application',
   'Steps for obtaining your EU Blue Card (§18g AufenthG).');

-- Blue Card - Renewal
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'blue_card', 'renewal',
   'EU Blue Card — Renewal',
   'Steps for renewing your EU Blue Card.');

-- Job Seeker Visa - First
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'job_seeker_visa', 'first',
   'Job Seeker Visa — First Application',
   'Steps for obtaining a Job Seeker Visa (§20 AufenthG).');

-- Freelance Visa - First
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'freelance_visa', 'first',
   'Freelance Visa — First Application',
   'Steps for obtaining a Freelancer/Self-employment Visa (§21 AufenthG).');

-- Freelance Visa - Renewal
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'freelance_visa', 'renewal',
   'Freelance Visa — Renewal',
   'Steps for renewing your Freelancer residence permit.');

-- Work Permit - First
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'work_permit', 'first',
   'Work Permit — First Application',
   'Steps for obtaining a general Work Permit (§18a/b AufenthG).');

-- Family Reunion - First
INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', 'family_reunion', 'first',
   'Family Reunion Visa — First Application',
   'Steps for family reunification (§27-36 AufenthG).');

-- ---- CITY REGISTRATION variants (same for most visa types, but we create a few) ----

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', 'student_visa', 'first',
   'City Registration — Students',
   'Anmeldung process for new students arriving in Germany.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'blue_card', 'first',
   'City Registration — Workers',
   'Anmeldung process for workers arriving in Germany.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'student_visa', 'renewal',
   'City Registration — Address Change',
   'Umzug / address change registration process.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', 'blue_card', 'renewal',
   'City Registration — Address Change (Workers)',
   'Address change registration for Blue Card holders.');

-- ---- HEALTH INSURANCE variants ----

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000003', 'student_visa', 'first',
   'Health Insurance — Student',
   'Setting up public or private health insurance as a student.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000003', 'blue_card', 'first',
   'Health Insurance — Employee',
   'Setting up health insurance as an employed worker.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000003', 'freelance_visa', 'first',
   'Health Insurance — Freelancer',
   'Setting up health insurance as a self-employed person.');

-- ---- BANK ACCOUNT variants ----

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000004', 'student_visa', 'first',
   'Bank Account — Student',
   'Opening a student bank account in Germany.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000004', 'blue_card', 'first',
   'Bank Account — Employee',
   'Opening a bank account as an employee in Germany.');

-- ---- UNIVERSITY ENROLLMENT variants ----

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000005', 'student_visa', 'first',
   'University Enrollment — First Semester',
   'Initial Immatrikulation at your German university.');

INSERT INTO flow_variants (id, base_flow_id, visa_type, application_type, title, description) VALUES
  ('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000005', 'student_visa', 'renewal',
   'University Re-enrollment',
   'Rückmeldung process for continuing semesters.');

-- =============================================================================
-- FLOW STEPS
-- =============================================================================

-- ============================================
-- STUDENT VISA - FIRST APPLICATION (20000000-...-001)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1,
   'Gather Required Documents',
   'Collect all documents needed for your student visa application.',
   E'You will need the following documents:\n\n1. **Valid passport** (must be valid for at least 6 months beyond your stay)\n2. **Biometric passport photos** (2x, 35x45mm, recent)\n3. **University admission letter** (Zulassungsbescheid)\n4. **Proof of financial resources** (blocked account with ~11,208€/year, scholarship letter, or parental declaration)\n5. **Health insurance certificate** (must cover from day 1)\n6. **Proof of accommodation** (rental contract or Wohnungsgeberbestätigung)\n7. **Previous academic certificates** (translated and apostilled)\n8. **Completed visa application form**\n\nAll documents should be originals + 1 copy. Non-German/English documents need certified translation.',
   '3-7 days',
   ARRAY['passport', 'biometric_photos', 'university_admission', 'blocked_account', 'health_insurance', 'rental_contract'],
   '[{"url": "https://www.auswaertiges-amt.de/en/visa-service/national-visa", "label": "German Embassy - National Visa Info"}]'::JSONB,
   'Start gathering documents as soon as you receive your admission letter. The blocked account (Sperrkonto) takes 1-2 weeks to set up.',
   TRUE),

  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 2,
   'Open a Blocked Account (Sperrkonto)',
   'Set up your blocked account as proof of financial means.',
   E'A blocked account (Sperrkonto) is mandatory for most student visa applications.\n\n**Steps:**\n1. Choose a provider: Expatrio, Fintiba, or Deutsche Bank\n2. Register online and verify your identity\n3. Transfer the required amount (~11,208€ for 12 months as of 2024)\n4. Receive your blocking confirmation (Sperrbescheinigung)\n\n**Note:** You can withdraw ~934€/month once in Germany.',
   '1-2 weeks',
   ARRAY['blocked_account'],
   '[{"url": "https://www.expatrio.com", "label": "Expatrio"}, {"url": "https://www.fintiba.com", "label": "Fintiba"}]'::JSONB,
   'Expatrio and Fintiba are generally faster than Deutsche Bank. Start this process early!',
   TRUE),

  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 3,
   'Get Health Insurance',
   'Obtain mandatory health insurance coverage.',
   E'Germany requires health insurance before you can enroll or get a visa.\n\n**Public Insurance (recommended for students under 30):**\n- TK (Techniker Krankenkasse)\n- AOK\n- Barmer\n- DAK\n\nCost: ~110€/month for students\n\n**Steps:**\n1. Apply online with your chosen provider\n2. Submit your admission letter and passport\n3. Receive your insurance certificate\n4. If you have travel insurance, you may need an exemption letter from a public insurer first.',
   '3-5 days',
   ARRAY['health_insurance'],
   '[{"url": "https://www.tk.de/en", "label": "TK English"}, {"url": "https://www.aok.de/pk/", "label": "AOK"}]'::JSONB,
   'Apply for public insurance BEFORE arriving if possible. TK has a good English-language process.',
   TRUE),

  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 4,
   'Book Appointment at Ausländerbehörde',
   'Schedule your visa appointment at the foreigners authority.',
   E'**How to book:**\n1. Visit your city''s Ausländerbehörde website\n2. Look for online appointment booking (Terminvereinbarung)\n3. Select "Erstantrag Aufenthaltserlaubnis" (First application)\n4. Choose the earliest available date\n\n**Major cities:**\n- Berlin: berlin.de/einwanderung\n- Munich: muenchen.de/auslaenderbehoerde\n- Frankfurt: frankfurt.de/auslaenderbehoerde\n\n**If no appointments available:**\n- Check early morning (new slots often released at 8:00)\n- Try calling the office\n- Some cities accept walk-ins for students',
   '1-30 days (appointment wait)',
   ARRAY[]::text[],
   '[{"url": "https://service.berlin.de/dienstleistung/305244/en/", "label": "Berlin ABH Appointment"}]'::JSONB,
   'Appointments can be scarce in large cities. Book as soon as possible — even before all documents are ready. In Berlin, check at exactly 8:00 AM for new slots.',
   TRUE),

  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 5,
   'Complete City Registration (Anmeldung)',
   'Register your German address at the Bürgeramt.',
   E'You MUST register within 14 days of moving into your apartment.\n\n**What to bring:**\n1. Passport\n2. Rental contract\n3. Wohnungsgeberbestätigung (landlord confirmation form)\n4. Anmeldung form (Anmeldeformular)\n\n**Process:**\n1. Book appointment at your local Bürgeramt\n2. Go to the appointment with all documents\n3. Receive your Meldebescheinigung (registration certificate)\n\nThis certificate is needed for your visa appointment, bank account, and more.',
   '1-3 hours (appointment)',
   ARRAY['rental_contract', 'wohnungsgeberbestaetigung', 'passport'],
   '[]'::JSONB,
   'The Anmeldung is one of the FIRST things you should do after arriving. Many other processes depend on it.',
   TRUE),

  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', 6,
   'Attend Visa Appointment',
   'Visit the Ausländerbehörde with all your documents.',
   E'**On the day of your appointment:**\n\n1. Arrive 15 minutes early\n2. Bring ALL documents (originals + copies)\n3. Bring cash for the fee (~100€, some offices accept card)\n4. Be prepared to wait\n\n**What happens:**\n- Your documents will be reviewed\n- They may ask questions about your study plans\n- Biometric data (fingerprints, photo) will be taken\n- You''ll receive either:\n  - A Fiktionsbescheinigung (temporary permission) while they process\n  - Or the visa sticker directly (rare)\n\n**After the appointment:**\n- Processing takes 2-8 weeks\n- You''ll receive a letter to pick up your eAT (electronic residence permit card)',
   '2-4 hours',
   ARRAY['passport', 'biometric_photos', 'university_admission', 'blocked_account', 'health_insurance', 'rental_contract', 'anmeldung_certificate'],
   '[]'::JSONB,
   'Bring a book or phone charger — waiting times can be very long. Stay calm and polite even if the process feels bureaucratic.',
   TRUE),

  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', 7,
   'Pick Up Residence Permit (eAT)',
   'Collect your electronic residence permit card.',
   E'After your application is approved:\n\n1. You''ll receive a letter (Abholbrief) by post\n2. It tells you when and where to pick up your eAT card\n3. Bring your passport and the letter\n4. The eAT is a credit-card-sized ID with your photo and chip\n\n**Important:** Your eAT has a PIN — memorize it. You''ll need it for certain online government services.\n\nSet a calendar reminder for 3 months before your permit expires to start the renewal process.',
   '30 minutes',
   ARRAY['passport'],
   '[]'::JSONB,
   'Note your visa expiry date immediately and set a reminder to start renewal 3-4 months before it expires.',
   TRUE);

-- ============================================
-- STUDENT VISA - RENEWAL (20000000-...-002)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000002', 1,
   'Check Renewal Eligibility',
   'Verify you meet the conditions for visa renewal.',
   E'Before applying for renewal, confirm:\n\n1. **You are still enrolled** at a recognized university\n2. **You have sufficient funds** for the next period\n3. **Your health insurance** is still active\n4. **You haven''t exceeded** the maximum study duration (usually 10 years)\n5. **You can show academic progress** (transcript with passed courses)\n\n**Important:** Start this process 3-4 months before your current visa expires!',
   '1 day',
   ARRAY['enrollment_certificate', 'transcript'],
   '[]'::JSONB,
   'If you''ve changed your study program, prepare a letter explaining why.',
   TRUE),

  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000002', 2,
   'Gather Renewal Documents',
   'Collect updated documents for the renewal application.',
   E'**Documents needed for renewal:**\n\n1. Current passport (valid for at least the requested duration)\n2. Current residence permit (eAT card)\n3. Biometric photos (2x, recent)\n4. Updated enrollment certificate (current semester)\n5. Transcript / proof of academic progress\n6. Updated financial proof (new blocked account balance, scholarship renewal, etc.)\n7. Health insurance confirmation (current)\n8. Rental contract (current)\n9. Updated Meldebescheinigung (if address changed)\n10. Completed application form for extension\n\n**Fee:** ~93-96€ for extension',
   '3-5 days',
   ARRAY['passport', 'biometric_photos', 'enrollment_certificate', 'transcript', 'blocked_account', 'health_insurance', 'rental_contract'],
   '[]'::JSONB,
   'Your transcript is KEY for renewal. The Ausländerbehörde wants to see you''re making reasonable progress.',
   TRUE),

  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 3,
   'Book Renewal Appointment',
   'Schedule your appointment at the Ausländerbehörde.',
   E'For renewals, look for "Verlängerung der Aufenthaltserlaubnis" when booking.\n\nSome cities allow you to submit renewal applications by mail or through an online portal.\n\n**Important:** Apply BEFORE your current visa expires. Even if your appointment is after the expiry date, having applied on time means you have a "Fiktionswirkung" — your old permit remains valid until a decision is made.',
   '1-30 days',
   ARRAY[]::text[],
   '[]'::JSONB,
   'If you can''t get a timely appointment, send your application by registered mail (Einschreiben) before your visa expires to establish Fiktionswirkung.',
   TRUE),

  ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', 4,
   'Attend Renewal Appointment',
   'Visit the Ausländerbehörde with your documents.',
   E'Similar to the first application, but they will also review:\n- Your academic progress\n- Whether you''re within the expected study timeframe\n- Updated financial situation\n\nBring all originals + copies. The fee is ~93-96€.',
   '2-4 hours',
   ARRAY['passport', 'biometric_photos', 'enrollment_certificate', 'transcript', 'blocked_account', 'health_insurance', 'rental_contract'],
   '[]'::JSONB,
   'If asked about slow progress, have a clear explanation ready (illness, language courses, personal challenges).',
   TRUE),

  ('30000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000002', 5,
   'Collect New Residence Permit',
   'Pick up your renewed eAT card.',
   E'Same process as before — you''ll receive a pickup letter.\n\nAgain, note the new expiry date and set reminders!',
   '30 minutes',
   ARRAY['passport'],
   '[]'::JSONB,
   'Immediately update your visa expiry date in this app after receiving your new permit.',
   TRUE);

-- ============================================
-- BLUE CARD - FIRST APPLICATION (20000000-...-003)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000003', 1,
   'Verify Blue Card Eligibility',
   'Confirm you meet the EU Blue Card requirements.',
   E'**EU Blue Card Requirements (2024):**\n\n1. **University degree**: Recognized in Germany (check anabin database)\n2. **Job offer or contract**: From a German employer\n3. **Minimum salary**: \n   - Standard: €45,300/year (2024)\n   - Shortage occupations (IT, engineering, medicine): €41,042/year\n4. **The job must match your qualifications**\n\nCheck your degree recognition at anabin.kmk.org',
   '1-2 days',
   ARRAY['degree_certificate', 'employment_contract'],
   '[{"url": "https://anabin.kmk.org/anabin.html", "label": "Anabin - Degree Recognition Database"}, {"url": "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card", "label": "Make it in Germany - Blue Card"}]'::JSONB,
   'If your degree isn''t in anabin, you may need to apply for recognition through KMK (can take weeks).',
   TRUE),

  ('30000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000003', 2,
   'Gather Required Documents',
   'Collect all documents for your Blue Card application.',
   E'**Required documents:**\n\n1. Valid passport\n2. Biometric photos (2x)\n3. University degree (original + certified translation if not in German/English)\n4. Degree recognition (if needed — ZAB statement)\n5. Employment contract or binding job offer\n6. CV / Lebenslauf\n7. Health insurance proof\n8. Rental contract + Anmeldung\n9. Completed application form\n\n**Fee:** ~100€',
   '3-7 days',
   ARRAY['passport', 'biometric_photos', 'degree_certificate', 'employment_contract', 'health_insurance', 'rental_contract', 'anmeldung_certificate', 'cv'],
   '[]'::JSONB,
   'Have your employer provide a letter confirming your role, salary, and start date on company letterhead.',
   TRUE),

  ('30000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000003', 3,
   'Complete City Registration (Anmeldung)',
   'Register your address at the Bürgeramt within 14 days.',
   E'Same process as for any newcomer — see the City Registration flow for details.\n\nBring: passport, rental contract, Wohnungsgeberbestätigung, Anmeldeformular.',
   '1-3 hours',
   ARRAY['passport', 'rental_contract', 'wohnungsgeberbestaetigung'],
   '[]'::JSONB,
   'Do this as soon as you have your apartment. Many other steps depend on having the Meldebescheinigung.',
   TRUE),

  ('30000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000003', 4,
   'Book Appointment at Ausländerbehörde',
   'Schedule your Blue Card appointment.',
   E'Look for "EU Blue Card" or "Blaue Karte EU" when booking your appointment.\n\nSome larger cities have dedicated Blue Card processing lanes with shorter wait times.',
   '1-14 days',
   ARRAY[]::text[],
   '[]'::JSONB,
   'Your employer''s HR department may be able to help expedite the appointment.',
   TRUE),

  ('30000000-0000-0000-0000-000000000024', '20000000-0000-0000-0000-000000000003', 5,
   'Attend Visa Appointment',
   'Visit the Ausländerbehörde with all documents.',
   E'The process is similar to other visa types. They will verify your employment contract and salary meet the threshold.\n\nBlue Cards are typically issued for the duration of the employment contract, up to 4 years.',
   '2-4 hours',
   ARRAY['passport', 'biometric_photos', 'degree_certificate', 'employment_contract', 'health_insurance', 'rental_contract', 'anmeldung_certificate'],
   '[]'::JSONB,
   'Blue Card holders can apply for permanent residence after 27 months (or 21 months with B1 German).',
   TRUE),

  ('30000000-0000-0000-0000-000000000025', '20000000-0000-0000-0000-000000000003', 6,
   'Pick Up Blue Card (eAT)',
   'Collect your electronic residence permit.',
   E'Same process — wait for the pickup letter and bring your passport.',
   '30 minutes',
   ARRAY['passport'],
   '[]'::JSONB,
   'With a Blue Card, your spouse can join you and work without restrictions!',
   TRUE);

-- ============================================
-- CITY REGISTRATION - STUDENTS (20000000-...-010)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000030', '20000000-0000-0000-0000-000000000010', 1,
   'Find an Apartment or Temporary Housing',
   'Secure accommodation with a valid address.',
   E'You need a fixed address to register. Options:\n\n1. **Student dorm** (Studentenwohnheim) — easiest, landlord provides Wohnungsgeberbestätigung\n2. **WG (shared flat)** — main tenant needs to provide the form\n3. **Temporary housing** — some allow Anmeldung, confirm first!\n\n**Important:** You CANNOT register at a hotel or Airbnb in most cities.',
   '1-30 days',
   ARRAY['rental_contract'],
   '[{"url": "https://www.studierendenwerk.de", "label": "Student Housing Services"}]'::JSONB,
   'If you''re in a dorm, ask the Studentenwerk office for your Wohnungsgeberbestätigung immediately.',
   TRUE),

  ('30000000-0000-0000-0000-000000000031', '20000000-0000-0000-0000-000000000010', 2,
   'Get Wohnungsgeberbestätigung from Landlord',
   'Request the landlord confirmation form.',
   E'Your landlord MUST give you this form. It''s a legal requirement.\n\nThe form confirms:\n- Your name\n- Move-in date\n- Address\n- Landlord''s signature\n\nDownload the official form from your city''s website if your landlord doesn''t have one.',
   '1-3 days',
   ARRAY['wohnungsgeberbestaetigung'],
   '[]'::JSONB,
   'Landlords are legally required to provide this within 2 weeks of your move-in. Don''t be shy about asking!',
   TRUE),

  ('30000000-0000-0000-0000-000000000032', '20000000-0000-0000-0000-000000000010', 3,
   'Book Bürgeramt Appointment',
   'Schedule your registration appointment.',
   E'**How to book:**\n1. Go to your city''s Bürgeramt website\n2. Look for "Anmeldung einer Wohnung"\n3. Select the earliest available date\n\nIn Berlin, appointments can be scarce. Check at 8:00 AM for new slots.',
   '1-14 days',
   ARRAY[]::text[],
   '[{"url": "https://service.berlin.de/dienstleistung/120686/", "label": "Berlin Anmeldung Appointment"}]'::JSONB,
   'Some cities offer walk-in hours. Call to ask if no online appointments are available.',
   TRUE),

  ('30000000-0000-0000-0000-000000000033', '20000000-0000-0000-0000-000000000010', 4,
   'Attend Bürgeramt Appointment',
   'Go to the Bürgeramt with all documents.',
   E'**Bring:**\n1. Passport / ID\n2. Rental contract\n3. Wohnungsgeberbestätigung (signed by landlord)\n4. Completed Anmeldeformular\n\n**What happens:**\n- The clerk processes your registration\n- You receive your Meldebescheinigung (registration certificate)\n- They''ll ask about your religion (affects church tax — say "none" if not applicable)\n- They''ll ask about your previous address\n\nThe whole process takes 10-15 minutes once you''re called.',
   '1-2 hours (including wait)',
   ARRAY['passport', 'rental_contract', 'wohnungsgeberbestaetigung'],
   '[]'::JSONB,
   'The religion question: If you say Catholic/Protestant, you''ll be charged church tax (~8-9% of income tax). You can say "none" or your actual non-German religion.',
   TRUE),

  ('30000000-0000-0000-0000-000000000034', '20000000-0000-0000-0000-000000000010', 5,
   'Store Your Meldebescheinigung Safely',
   'Keep your registration certificate — you''ll need it everywhere.',
   E'Your Meldebescheinigung is needed for:\n- Visa/residence permit application\n- Bank account opening\n- University enrollment\n- Health insurance\n- Employment\n\nMake digital copies and store them securely. You can upload it to the Documents section of this app.',
   '10 minutes',
   ARRAY['anmeldung_certificate'],
   '[]'::JSONB,
   'Upload a scan to this app''s document vault right away!',
   FALSE);

-- ============================================
-- HEALTH INSURANCE - STUDENT (20000000-...-014)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000040', '20000000-0000-0000-0000-000000000014', 1,
   'Understand Your Insurance Options',
   'Learn about public vs. private health insurance for students.',
   E'**Public Health Insurance (GKV):**\n- Mandatory for students under 30 (or 14th semester)\n- Cost: ~110€/month\n- Providers: TK, AOK, Barmer, DAK, etc.\n- Covers almost everything\n\n**Private Health Insurance (PKV):**\n- Option for students over 30, or by choice\n- Usually more expensive\n- May not be accepted for visa renewal\n\n**Recommendation:** Choose public insurance unless you have a specific reason not to.',
   '30 minutes',
   ARRAY[]::text[],
   '[{"url": "https://www.krankenkassen.de/gesetzliche-krankenkassen/", "label": "Compare Public Insurance"}]'::JSONB,
   'TK (Techniker Krankenkasse) is the most popular choice among international students due to good English support.',
   TRUE),

  ('30000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000014', 2,
   'Apply for Health Insurance',
   'Submit your application to your chosen insurance provider.',
   E'**For TK (example):**\n1. Go to tk.de/en\n2. Click "Become a member"\n3. Fill in the online application\n4. Upload: passport, admission letter, enrollment certificate\n5. You''ll receive confirmation within a few days\n\nSimilar process for other public insurers.',
   '1-3 days',
   ARRAY['passport', 'university_admission'],
   '[{"url": "https://www.tk.de/en/membership/become-a-member-2107824", "label": "TK Membership Application"}]'::JSONB,
   'Apply as soon as you have your university admission letter. You need insurance BEFORE enrollment.',
   TRUE),

  ('30000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000014', 3,
   'Receive Insurance Certificate',
   'Get your Versicherungsbescheinigung for university and visa.',
   E'After approval, your insurer will provide:\n1. **Membership confirmation letter**\n2. **Insurance certificate for the university** (Versicherungsbescheinigung) — sent electronically to your uni\n3. **Your insurance card** (Gesundheitskarte) — arrives by mail in 1-2 weeks\n\nYou need the certificate for both university enrollment and your visa application.',
   '3-7 days',
   ARRAY['health_insurance'],
   '[]'::JSONB,
   'You can usually get a temporary certificate (PDF) immediately while waiting for the physical card.',
   TRUE);

-- ============================================
-- BANK ACCOUNT - STUDENT (20000000-...-017)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000050', '20000000-0000-0000-0000-000000000017', 1,
   'Choose a Bank',
   'Compare German bank options for students.',
   E'**Traditional Banks:**\n- Deutsche Bank — free student account\n- Sparkasse — local, widespread ATMs\n- Commerzbank — free account possible\n\n**Online/Neo Banks:**\n- N26 — fully online, quick setup\n- DKB — popular free account\n- Tomorrow — sustainable banking\n\n**Considerations:**\n- Traditional banks: easier for bureaucratic processes, cash deposits\n- Online banks: faster to open, often before Anmeldung\n- N26 can be opened before arriving in Germany!',
   '1 hour',
   ARRAY[]::text[],
   '[{"url": "https://n26.com", "label": "N26"}, {"url": "https://www.dkb.de", "label": "DKB"}]'::JSONB,
   'If you need a bank account urgently (e.g., for blocked account), N26 can be opened in minutes with just your passport.',
   TRUE),

  ('30000000-0000-0000-0000-000000000051', '20000000-0000-0000-0000-000000000017', 2,
   'Gather Documents for Bank Account',
   'Prepare what you need to open an account.',
   E'**Typically required:**\n1. Valid passport\n2. Meldebescheinigung (for traditional banks)\n3. Student enrollment certificate (for student accounts)\n4. Visa / residence permit\n\n**For online banks (N26, etc.):**\n- Just passport + smartphone\n- Video identification process\n- No Anmeldung needed!',
   '30 minutes',
   ARRAY['passport', 'anmeldung_certificate'],
   '[]'::JSONB,
   'Traditional banks require Anmeldung. If you need a bank account before registering, use an online bank first.',
   TRUE),

  ('30000000-0000-0000-0000-000000000052', '20000000-0000-0000-0000-000000000017', 3,
   'Open the Account',
   'Complete the account opening process.',
   E'**Traditional bank:**\n1. Book appointment at a branch\n2. Bring all documents\n3. Sign the contract\n4. Receive your IBAN immediately\n5. Debit card arrives by mail in 5-7 days\n\n**Online bank:**\n1. Download the app\n2. Complete registration\n3. Verify identity via video call\n4. Account ready in minutes to hours\n5. Virtual card available immediately',
   '1-7 days',
   ARRAY['passport', 'anmeldung_certificate'],
   '[]'::JSONB,
   'Write down your IBAN immediately — you''ll need it for health insurance, salary, rent, and more.',
   TRUE);

-- ============================================
-- UNIVERSITY ENROLLMENT - FIRST (20000000-...-019)
-- ============================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000060', '20000000-0000-0000-0000-000000000019', 1,
   'Accept Your Admission Offer',
   'Formally accept the university''s offer of admission.',
   E'**Steps:**\n1. Log into the university portal (or uni-assist)\n2. Accept the offer within the deadline\n3. You may need to upload documents or pay a deposit\n4. You''ll receive a conditional enrollment letter (Zulassungsbescheid)\n\nThis letter is needed for your visa application.',
   '1 day',
   ARRAY['university_admission'],
   '[]'::JSONB,
   'Don''t miss the acceptance deadline! Set a calendar reminder.',
   TRUE),

  ('30000000-0000-0000-0000-000000000061', '20000000-0000-0000-0000-000000000019', 2,
   'Pay the Semester Fee (Semesterbeitrag)',
   'Transfer the semester contribution to complete enrollment.',
   E'**What it covers:**\n- Student services (Studentenwerk)\n- Semester ticket (public transport)\n- Student union\n\n**Cost:** Typically 150-400€ depending on the city\n\n**How to pay:**\n1. Get the payment details from your enrollment letter or university portal\n2. Transfer from your German bank account (preferred) or international transfer\n3. Use the exact reference number provided\n4. Payment must arrive by the deadline',
   '1-3 days',
  ARRAY[]::text[],
   '[]'::JSONB,
   'Pay early! International transfers can take several days. Use your German bank account if possible.',
   TRUE),

  ('30000000-0000-0000-0000-000000000062', '20000000-0000-0000-0000-000000000019', 3,
   'Submit Health Insurance Certificate',
   'Provide proof of health insurance to the university.',
   E'The university requires a health insurance certificate before completing enrollment.\n\nIf you have public insurance: Your insurer sends it electronically (M10 form)\nIf you have private insurance: You need an exemption letter (Befreiungsbescheinigung) from a public insurer\n\nWithout this, your enrollment cannot be completed!',
   '1-5 days',
   ARRAY['health_insurance'],
   '[]'::JSONB,
   'If using private insurance, you MUST first go to a public insurer to get the exemption letter. This is often overlooked!',
   TRUE),

  ('30000000-0000-0000-0000-000000000063', '20000000-0000-0000-0000-000000000019', 4,
   'Complete Enrollment (Immatrikulation)',
   'Finalize your enrollment at the university.',
   E'**After payment and insurance:**\n\n1. Upload remaining documents to the portal:\n   - Passport copy\n   - High school certificate (with apostille/translation)\n   - University degree (if Master''s student)\n   - Passport photo\n2. Some universities require in-person enrollment\n3. You''ll receive:\n   - Student ID (Studierendenausweis)\n   - Enrollment certificate (Immatrikulationsbescheinigung)\n   - Semester ticket\n   - University login credentials',
   '1-3 days',
   ARRAY['passport', 'degree_certificate', 'biometric_photos'],
   '[]'::JSONB,
   'Download and save your enrollment certificate — you''ll need it for your visa, health insurance, and bank account.',
   TRUE),

  ('30000000-0000-0000-0000-000000000064', '20000000-0000-0000-0000-000000000019', 5,
   'Set Up University Email & Systems',
   'Activate your university accounts and email.',
   E'After enrollment:\n1. Activate your university email\n2. Set up VPN access for library resources\n3. Register for courses in the university system (e.g., TUMonline, HISinOne, BASIS)\n4. Join relevant mailing lists and student groups\n5. Download the university app if available',
   '1-2 hours',
   ARRAY[]::text[],
   '[]'::JSONB,
   'Use your university email for all official communications. Check it regularly!',
   FALSE);

-- =============================================================================
-- Add a few more variant steps for Blue Card Renewal to show renewal differences
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000070', '20000000-0000-0000-0000-000000000004', 1,
   'Confirm Continued Employment',
   'Verify your employment still meets Blue Card requirements.',
   E'Before renewal, confirm:\n1. You''re still employed with the same employer (or have a new qualifying job)\n2. Your salary still meets the threshold\n3. If you changed jobs within the first 2 years, you needed approval — check this\n4. After 2 years, you can change jobs freely within Blue Card-qualifying positions',
   '1 day',
   ARRAY['employment_contract'],
   '[]'::JSONB,
   'If you changed employers, bring documentation of when you notified the Ausländerbehörde.',
   TRUE),

  ('30000000-0000-0000-0000-000000000071', '20000000-0000-0000-0000-000000000004', 2,
   'Gather Renewal Documents',
   'Collect updated documents for Blue Card renewal.',
   E'**Required for renewal:**\n1. Current passport\n2. Current Blue Card (eAT)\n3. Biometric photos (2x)\n4. Current employment contract or latest payslips (3 months)\n5. Health insurance confirmation\n6. Rental contract\n7. Tax documents may be requested\n\n**Fee:** ~93-96€',
   '3-5 days',
   ARRAY['passport', 'biometric_photos', 'employment_contract', 'health_insurance', 'rental_contract'],
   '[]'::JSONB,
   'Have your latest 3 payslips ready — they prove your salary still qualifies.',
   TRUE),

  ('30000000-0000-0000-0000-000000000072', '20000000-0000-0000-0000-000000000004', 3,
   'Book and Attend Renewal Appointment',
   'Schedule and attend your Blue Card renewal.',
   E'Look for "Verlängerung Blaue Karte EU" when booking.\n\nApply well before your current card expires.\n\n**Consider Permanent Residence:** After 27 months with a Blue Card (21 months with B1 German), you can apply for a settlement permit (Niederlassungserlaubnis) instead of renewal!',
   '1-30 days + 2-4 hours appointment',
   ARRAY['passport', 'biometric_photos', 'employment_contract', 'health_insurance', 'rental_contract'],
   '[{"url": "https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit", "label": "Settlement Permit Info"}]'::JSONB,
   'Ask about upgrading to a permanent settlement permit if you qualify!',
   TRUE),

  ('30000000-0000-0000-0000-000000000073', '20000000-0000-0000-0000-000000000004', 4,
   'Collect Renewed Blue Card',
   'Pick up your new eAT card.',
   E'Wait for pickup letter, bring passport. Set reminders for the next renewal or settlement permit eligibility.',
   '30 minutes',
   ARRAY['passport'],
   '[]'::JSONB,
   'Update your visa expiry date in this app immediately.',
   TRUE);

-- =============================================================================
-- Catch-all variants for visa types that share similar city registration steps
-- (Workers/Blue Card city registration reuses similar steps)
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000080', '20000000-0000-0000-0000-000000000011', 1,
   'Secure Your Apartment',
   'Find accommodation with a registerable address.',
   E'As a worker, you likely need:\n- A regular apartment or WG\n- Some employers help with initial housing\n- Temporary furnished apartments are available (e.g., wunderflats.com, housinganywhere.com)\n\nMake sure the landlord is willing to provide the Wohnungsgeberbestätigung.',
   '1-30 days',
   ARRAY['rental_contract'],
   '[{"url": "https://www.wunderflats.com", "label": "Wunderflats"}, {"url": "https://www.immobilienscout24.de", "label": "ImmobilienScout24"}]'::JSONB,
   'Ask your employer''s HR if they have relocation support or temporary housing arrangements.',
   TRUE),

  ('30000000-0000-0000-0000-000000000081', '20000000-0000-0000-0000-000000000011', 2,
   'Get Wohnungsgeberbestätigung',
   'Obtain the landlord confirmation form.',
   E'Same as for students — your landlord must provide this form within 2 weeks of your move-in.',
   '1-3 days',
   ARRAY['wohnungsgeberbestaetigung'],
   '[]'::JSONB,
   'Download the form from your city''s website if the landlord doesn''t have one ready.',
   TRUE),

  ('30000000-0000-0000-0000-000000000082', '20000000-0000-0000-0000-000000000011', 3,
   'Book and Attend Bürgeramt Appointment',
   'Register at the residents'' registration office.',
   E'Book for "Anmeldung einer Wohnung" at your local Bürgeramt.\n\nBring: passport, rental contract, Wohnungsgeberbestätigung.\n\nYou''ll receive your Meldebescheinigung on the spot.',
   '1-14 days + 1-2 hours',
   ARRAY['passport', 'rental_contract', 'wohnungsgeberbestaetigung'],
   '[]'::JSONB,
   'The Anmeldung must be done within 14 days of moving in. Penalties are rare but possible.',
   TRUE);

-- =============================================================================
-- Health Insurance - Employee (Blue Card) steps
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000090', '20000000-0000-0000-0000-000000000015', 1,
   'Understand Employee Health Insurance',
   'Learn how health insurance works for employees.',
   E'**As an employee in Germany:**\n\n- If your salary is below the threshold (~69,300€/year in 2024): PUBLIC insurance is mandatory\n- If above: You can choose public or private\n\n**Public insurance:**\n- ~14.6% of salary (half paid by employer)\n- Covers family members for free\n\n**Your employer will typically handle enrollment**, but you choose the provider.',
   '30 minutes',
   ARRAY[]::text[],
   '[]'::JSONB,
   'For Blue Card holders earning above the threshold, public insurance is often still recommended for its simplicity and family coverage.',
   TRUE),

  ('30000000-0000-0000-0000-000000000091', '20000000-0000-0000-0000-000000000015', 2,
   'Choose and Register with an Insurance Provider',
   'Select your public health insurance provider.',
   E'**Popular options:**\n- TK (Techniker Krankenkasse) — largest, good English service\n- Barmer\n- DAK\n- AOK (local)\n\n**Process:**\n1. Apply online or at a local office\n2. Inform your employer which provider you chose\n3. Your employer handles the registration and payments\n4. You receive your Gesundheitskarte (health card) by mail',
   '1-3 days',
   ARRAY['employment_contract', 'passport'],
   '[{"url": "https://www.tk.de/en", "label": "TK English"}]'::JSONB,
   'Tell your employer your chosen insurer BEFORE your start date so they can process it with your first payroll.',
   TRUE);

-- =============================================================================
-- Health Insurance - Freelancer steps
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000095', '20000000-0000-0000-0000-000000000016', 1,
   'Understand Freelancer Health Insurance',
   'Learn about health insurance options for self-employed people.',
   E'**As a freelancer, you MUST have health insurance, but you choose:**\n\n**Public (freiwillige Versicherung):**\n- Minimum ~200€/month, scales with income\n- Maximum ~950€/month\n- Good if you plan to hire employees or return to employment\n\n**Private:**\n- Based on age, health, coverage level\n- Can be cheaper when young and healthy\n- Gets more expensive with age\n- Harder to switch back to public later\n\n**For visa purposes:** Public insurance is generally safer.',
   '1 hour',
   ARRAY[]::text[],
   '[]'::JSONB,
   'The Ausländerbehörde strongly prefers public insurance for freelancers. Private insurance can cause complications at renewal.',
   TRUE),

  ('30000000-0000-0000-0000-000000000096', '20000000-0000-0000-0000-000000000016', 2,
   'Apply for Health Insurance',
   'Register with your chosen provider.',
   E'**For public insurance as a freelancer:**\n1. Contact TK, AOK, etc.\n2. Apply for "freiwillige Versicherung" (voluntary membership)\n3. Provide proof of self-employment (Gewerbeschein or Finanzamt registration)\n4. Declare your estimated income\n5. Monthly contributions are calculated based on income\n\nYou''ll receive confirmation for your visa application.',
   '3-7 days',
   ARRAY['passport', 'freelance_registration'],
   '[]'::JSONB,
   'Be honest about income estimates — they''ll be adjusted after your tax return anyway.',
   TRUE);

-- =============================================================================
-- Bank Account - Employee (Blue Card) steps
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000098', '20000000-0000-0000-0000-000000000018', 1,
   'Open a German Bank Account',
   'Set up your salary account.',
   E'As an employee, you need a German IBAN for salary payments.\n\n**Quick option:** N26 or DKB (can open before Anmeldung)\n**Traditional:** Deutsche Bank, Sparkasse, Commerzbank (need Anmeldung)\n\nYour employer needs your IBAN before your first payday.',
   '1-7 days',
   ARRAY['passport', 'anmeldung_certificate'],
   '[{"url": "https://n26.com", "label": "N26"}, {"url": "https://www.dkb.de", "label": "DKB"}]'::JSONB,
   'Open an N26 account on day 1 to have an IBAN immediately, then optionally switch to a traditional bank later.',
   TRUE);

-- =============================================================================
-- University Re-enrollment steps
-- =============================================================================

INSERT INTO flow_steps (id, flow_variant_id, step_number, title, description, detailed_instructions, estimated_duration, required_documents, external_links, tips, is_required) VALUES
  ('30000000-0000-0000-0000-000000000100', '20000000-0000-0000-0000-000000000020', 1,
   'Check Re-enrollment Deadline',
   'Find your university''s Rückmeldung deadline.',
   E'Each semester, you must re-enroll (Rückmeldung) by paying the semester fee before the deadline.\n\n**Deadlines vary by university but are typically:**\n- Winter semester: July-August\n- Summer semester: January-February\n\nCheck your university portal for exact dates.',
   '15 minutes',
  ARRAY[]::text[],
   '[]'::JSONB,
   'Missing the re-enrollment deadline can result in automatic exmatriculation (deregistration)!',
   TRUE),

  ('30000000-0000-0000-0000-000000000101', '20000000-0000-0000-0000-000000000020', 2,
   'Pay Semester Fee',
   'Transfer the Semesterbeitrag to re-enroll.',
   E'Pay the exact amount with the correct reference number.\n\nPayment details are in your university portal.\n\nAfter payment is confirmed, you''ll receive:\n- New enrollment certificate\n- Updated semester ticket\n- Can download new Studienbescheinigungen (enrollment certificates for insurance, visa, etc.)',
   '1-3 days',
  ARRAY[]::text[],
   '[]'::JSONB,
   'Set a recurring reminder for 2 weeks before the deadline each semester.',
   TRUE),

  ('30000000-0000-0000-0000-000000000102', '20000000-0000-0000-0000-000000000020', 3,
   'Download Updated Documents',
   'Get fresh enrollment certificates for the new semester.',
   E'After re-enrollment:\n1. Download new Immatrikulationsbescheinigung\n2. Update your health insurance if needed\n3. If your visa expires this semester, start the renewal process\n4. Update this app''s document vault with new certificates',
   '15 minutes',
   ARRAY['enrollment_certificate'],
   '[]'::JSONB,
   'Your health insurer needs the new enrollment certificate to maintain student rates.',
   FALSE);