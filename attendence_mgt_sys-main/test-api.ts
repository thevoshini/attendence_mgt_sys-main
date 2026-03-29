import { createClient } from '@supabase/supabase-js';

// Will fetch the actual supabase URL and ANON KEY from the .env file
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing getStudentAcademicInfo query...");
  const { data, error } = await supabase
        .from('students')
        .select(`
            *,
            department:departments(id, name, code, hod_email),
            class:classes(
                id,
                name,
                year,
                section,
                coordinator:teachers(id, name, email, phone_no)
            )
        `)
        .limit(1);

  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("SUCCESS:", JSON.stringify(data?.[0], null, 2));
  }
}

test();
