-- ============================================================
-- FIX: Update students with correct Clerk IDs (UPSERT)
-- ============================================================
-- Run this in Supabase SQL Editor → Run
-- This safely inserts all 28 real students and updates any
-- existing rows (s1-s10) to have the correct clerk_user_id.
-- ============================================================

-- Step 1: Delete old placeholder students (safe - no real leave forms for them)
DELETE FROM leave_forms WHERE student_id IN ('s1','s2','s3','s4','s5','s6','s7','s8','s9','s10');
DELETE FROM students    WHERE id          IN ('s1','s2','s3','s4','s5','s6','s7','s8','s9','s10');

-- Step 2: Insert all 28 real students (with ON CONFLICT safety)
INSERT INTO students
  (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar, is_active)
VALUES
  ('s1',  'user_3Az4phap0G8qKwCQ6Nahxvcw3bx', '421124109014', 'GOPALA DESIKAN D',        'gopaladesikand@gmail.com',            '2005-12-19', 'B+', '153, perumal koil st , akkadavalli panruti, Cuddalore 607 205',             '+917010649839', '+919843752726', 2, 'd1', 'c1', false, true),
  ('s2',  'user_3Az4pnyGUVcsb2j16NZgL3psYTx', '421124109051', 'VISHNUPRIYA J',           'jvpriya6@gmail.com',                  '2005-02-16', 'B+', 'Pillayar kovil street thiruvamoor panruti',                                  '+918248364992', '+919790414019', 2, 'd1', 'c1', false, true),
  ('s3',  'user_3Az4q05Gg3VqEhiT7m0N2DogCSc', '421124109039', 'Sharanya R',              'sharanya.rajasekar07@gmail.com',       '2006-10-07', 'A+', '110/1, 2 nd cross street, murugesa nagar, Pathirikuppam, Cuddalore 607401', '+919489188626', '+919942150271', 2, 'd1', 'c1', false, true),
  ('s4',  'user_3Az4q5vdOl3dSVp1xkOxdeObhGB', '421124109038', 'A.J SHAJIDHA BEGAM',      'shajidhabegam8@gmail.com',             '2007-03-17', 'O+', 'Nanjalingampettai periyakuppam post Cuddalore',                              '+918428627152', '+918344471085', 2, 'd1', 'c1', false, true),
  ('s5',  'user_3Az4qDPGWuWyKDSl4JcFF0cXBgw', '421124109002', 'Akshaya S',               'akshayasenthil0703x@gmail.com',        '2005-06-26', 'O+', 'No 55 rani and Rani road neyveli',                                          '+918072814236', '+919994059411', 2, 'd1', 'c1', false, true),
  ('s6',  'user_3Az4qIknQsDmHCVkz5J45oPA2Bl', '421124109013', 'GAYATHIRI K',             'gayathirik2602@gmail.com',             '2007-02-26', 'A+', '244/2 Muthayal nagar kk road Villupuram',                                   '+918148864374', '+917339430216', 2, 'd1', 'c1', false, true),
  ('s7',  'user_3Az4qKOLXN66pvbJ23fhAyKw2PQ', '421124109003', 'Allen Christopher Raj D', 'allenchristopherraj20@gmail.com',      '2006-12-20', 'A+', 'D-43, Sreenivasa Towers, Oulgaret, Puducherry-605010',                       '+919363550952', '+919600879660', 2, 'd1', 'c1', false, true),
  ('s8',  'user_3Az4qXN8UBymjbWJ9Woq0y5OPg0', '421124109044', 'Swetha K',                'swethakumar0137@gmail.com',            '2007-03-01', 'O+', '16 padmavathi Nagar L.N puram panruti 607106',                              '+919566357585', '+918838155436', 2, 'd1', 'c1', false, true),
  ('s9',  'user_3Az4qcwf8i6Ryads9kHcHUqUon3', '421124109022', 'KALAIMANI E',             'kalaimani934559@gmail.com',            '2006-12-07', 'O+', 'No. 408 vengadapetti street, Nallathur, Cuddalore',                         '+919345591418', '+919345591418', 2, 'd1', 'c1', false, true),
  ('s10', 'user_3Az4qguTRsHfWAEGP14zz9QPWUQ', '421124109043', 'SUHAINA NISHA M',         'suhainamshafi@gmail.com',              '2007-05-21', 'O+', '49, Balaji Nagar, Melpattampakkam, Panruti tk, Cuddalore dt.',               '+918072382527', '+919751608655', 2, 'd1', 'c1', false, true),
  ('s11', 'user_3Az4qs2lgRUZlfAJ5I9zSTFh3fg', '421124109011', 'DEEPIKA P',               'deepikaparani2007@gmail.com',          '2007-07-16', 'O+', 'NO.18 VASATHARAYAN PALAYAM R.K NAGAR CUDDALORE OT',                         '+918148176347', '+919944424175', 2, 'd1', 'c1', false, true),
  ('s12', 'user_3Az4r0lszT4YoEs0R01axOdjNIR', '421124109023', 'Keerthika S',             'n.s.keerthika27nov@gmail.com',         '2006-11-27', 'B+', '3, kamarajar street, Vettavalam-606754, Tiruvannamali.',                     '+917603829001', '+919486065603', 2, 'd1', 'c1', false, true),
  ('s13', 'user_3Az4r9LoEoQwpx6XL35otbZMcY5', '421124109027', 'Kuppu R',                 'kuppu9083@gmail.com',                  '2007-02-16', 'A-', 'No. 6 Krishna nagar, Bharathiyar st, vazhudhareddy, villupuram',             '+916383605991', '+918438226407', 2, 'd1', 'c1', false, true),
  ('s14', 'user_3Az4rCQj21gIeQNjn8MRWokYHYk', '421124109047', 'S.THAMIZHKUMARAN',        'thamizhkumaran549@gmail.com',          '2006-05-12', 'A+', '1/65 Mariyamman Kovil Street, Kottiyampoondi, Villupuram 605203',            '+918754968477', '+919443725713', 2, 'd1', 'c1', false, true),
  ('s15', 'user_3Az4rPBd73X2bxo66F34zF26eE2', '421124109014', 'Gnanesh M',               'gnxnesh@gmail.com',                    '2006-10-29', 'AB-','33 mgr nagar arakandanallur thirukovilur',                                  '+918489954522', '+917502333407', 2, 'd1', 'c1', false, true),
  ('s16', 'user_3Az4rWH8seCEVSu2BEyod10oUCA', '421124109032', 'NAVEENA R',               'naveenaramachandran29@gmail.com',      '2006-09-29', 'A+', 'No.66 Thiruvallur street, Roja Nagar, Neyveli-607801',                       '+919488494767', '+918903606107', 2, 'd1', 'c1', false, true),
  ('s17', 'user_3Az4rdraZyCpziX6JiiogXxONkx', '421124109026', 'KRISHNA KUMAR A',         'krishnakumar23122006@gmail.com',       '2006-12-23', 'B+', 'No.16, naraiyur road kumarakupam valavanur',                                 '+919342532990', '+919943378245', 2, 'd1', 'c1', false, true),
  ('s18', 'user_3Az4rm8YXMD9XwwSZD7ngkDlRIm', '421124109025', 'R.KISHORE ANTONY',        '2006kishoreantony@gmail.com',          '2006-10-12', 'AB+','12/B, WELLINGTON STREET, CUDDALORE O.T',                                    '+918668187495', '+916383241667', 2, 'd1', 'c1', false, true),
  ('s19', 'user_3Az4rscEDTt1zrDyITyu5b3kcbM', '421124109045', 'TAMIZH SELVAN A',         'tamilpritha12345@gmail.com',           '2007-03-02', 'B+', 'Main Road Parikkal, Ulundurpet Taluk, Kallakurichi Dist.',                   '+919952268561', '+919677399761', 2, 'd1', 'c1', false, true),
  ('s20', 'user_3Az4sAGtaQQ2ancz4cFLwzxujKc', '421124109052', 'Voshini',                 'hemalatha.sivakumar13@gmail.com',      '2006-07-22', 'B+', '1/61 main road, Veerasolappuram, Villupuram dist, 605755',                   '+919344332147', '+919976950821', 2, 'd1', 'c1', false, true),
  ('s21', 'user_3Az4sIHvFhF6YxHKP4nd4inboEl', '421124109008', 'BUVANESHWARI K',          'buvaneshwari1706@gmail.com',           '2006-11-17', 'AB+','685 D, Sri Thirumal Nagar, L.N.Puram, Panruti.',                            '+916385759366', '+918015927944', 2, 'd1', 'c1', false, true),
  ('s22', 'user_3Az4sKI1cmxeN0NO3udinVnmpRU', '421124109004', 'Amirthavarshini R',       'amirthavarshinijune30@gmail.com',      '2006-06-30', 'O+', 'No.149, Sathya Sai Nagar, 3rd cross, Cuddalore-607401',                      '+919363730428', '+918667217087', 2, 'd1', 'c1', false, true),
  ('s23', 'user_3Az4saCMTvjeSNCMlGXs6nxrG7N', '421124109029', 'Merlin Arthi J',          'merlinarthi12@gmail.com',              '2007-05-12', 'B+', '14, savarinayagan pettai, kalpet, siruvakur, villupuram',                    '+916380003791', '+919842472149', 2, 'd1', 'c1', false, true),
  ('s24', 'user_3Az4stp4cSCTNKpbirVznOnAub8', '421124109001', 'Advika S',                'advika22062006@gmail.com',             '2006-06-22', 'A+', 'Vasantharayan palayam Vinayagar Kovil street Cuddalore ot 607003',           '+919486504839', '+919600950992', 2, 'd1', 'c1', false, true),
  ('s25', 'user_3Az4szKB3gyTvhvvIST5ffoszut', '421124109012', 'Durga Shree S',           'durgashree1606@gmail.com',             '2007-06-16', 'O+', 'No 34, 2nd cross street saraswati nagar thirupapuliyur Cuddalore',           '+919344202343', '+919600530449', 2, 'd1', 'c1', false, true),
  ('s26', 'user_3Az4t98XWKCMR4OMgJ6HN8ZdcG3', '421124109046', 'THAMIZHARASI K',          'thamizharasikumaravel@gmail.com',      '2006-12-07', 'AB+','804, mettu street, pallithennal, Villupuram.',                              '+916383687711', '+919384287729', 2, 'd1', 'c1', false, true),
  ('s27', 'user_3Az4tIPF0rZ01fqAkqXtZbEWsKw', '421124109041', 'SRIMAHAVISHNU B',         'srimahavishnu796@gmail.com',           '2006-12-18', 'B+', '5, MATHA KOVIL STREET, MARAKKANAM',                                         '+918248848635', '+918344422448', 2, 'd1', 'c1', false, true),
  ('s28', 'user_3Az4tEshNfr2Jin7BNt8tdQ4Dhu', '421124109034', 'H.Patchai Perumal',       'patchaiperumal2006@gmail.com',         '2006-05-03', 'O+', '7/34, Ganapathy Samuthiram, Eral, Thoothukudi',                             '+917305237497', '+918903718284', 2, 'd1', 'c1', false, true)
ON CONFLICT (id) DO UPDATE SET
  clerk_user_id = EXCLUDED.clerk_user_id,
  regno         = EXCLUDED.regno,
  name          = EXCLUDED.name,
  email         = EXCLUDED.email,
  is_active     = true;

-- ============================================================
-- VERIFY: This must return 28 rows with matching clerk_user_ids
-- ============================================================
SELECT id, name, regno, clerk_user_id, is_active
FROM students
ORDER BY id;
