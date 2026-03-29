import { createClerkClient } from "@clerk/clerk-sdk-node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ================= ENV CHECK ================= */
if (!process.env.CLERK_SECRET_KEY) {
  console.error("❌ Missing CLERK_SECRET_KEY in environment");
  process.exit(1);
}

/* ================= ESM FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CLERK CLIENT ================= */
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/* ================= USER DATA ================= */

// Teachers
const teachers = [
  { emailAddress: ["teacher1@mailinator.com"], password: "teacher1@mailinator.com", username: "teacher1" },
  { emailAddress: ["teacher2@mailinator.com"], password: "teacher2@mailinator.com", username: "teacher2" },
  { emailAddress: ["teacher3@mailinator.com"], password: "teacher3@mailinator.com", username: "teacher3" },
];

// Students
const students = Array.from({ length: 10 }, (_, i) => {
  const email = `student${i + 1}@mailinator.com`;
  return {
    emailAddress: [email],
    password: email,
    username: `student${i + 1}`,
  };
});

// Admin
const admins = [
  { emailAddress: ["admin@mailinator.com"], password: "admin@mailinator.com", username: "admin1" },
];

/* ================= CREATE USERS ================= */

async function createBatch(users, role, store) {
  for (let i = 0; i < users.length; i++) {
    try {
      const newUser = await clerk.users.createUser(users[i]);

      store.push({
        id: newUser.id,
        email: users[i].emailAddress[0],
        username: users[i].username,
        number: i + 1,
      });

      console.log(`✅ ${role} ${i + 1} created → ${newUser.id}`);
    } catch (err) {
      console.error(`❌ ${users[i].emailAddress[0]} →`, err.errors?.[0]?.message || err.message);
    }
  }
}

async function createUsers() {
  console.log("\n🚀 Starting Clerk User Creation\n");

  const createdUsers = { teachers: [], students: [], admins: [] };

  await createBatch(teachers, "Teacher", createdUsers.teachers);
  await createBatch(students, "Student", createdUsers.students);
  await createBatch(admins, "Admin", createdUsers.admins);

  console.log("\n📊 SUMMARY");
  console.log(`Teachers: ${createdUsers.teachers.length}`);
  console.log(`Students: ${createdUsers.students.length}`);
  console.log(`Admins: ${createdUsers.admins.length}`);

  generateSQL(createdUsers);
}

/* ================= SQL GENERATION ================= */

function generateSQL(users) {
  const sql = [];

  sql.push("-- AUTO-GENERATED SUPABASE INSERTS\n");

  if (users.teachers.length) {
    sql.push("INSERT INTO teachers (id, clerk_user_id, name, email, dob, phone_no, department_id, is_coordinator, is_active) VALUES");
    users.teachers.forEach((t, i) => {
      const comma = i === users.teachers.length - 1 ? ";" : ",";
      sql.push(`('t${t.number}', '${t.id}', 'Teacher ${t.number}', '${t.email}', '1985-01-15', '+9191234567${10 + t.number}', 'd1', ${t.number <= 2}, true)${comma}`);
    });
  }

  if (users.students.length) {
    sql.push("\nINSERT INTO students (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar, is_active) VALUES");
    users.students.forEach((s, i) => {
      const comma = i === users.students.length - 1 ? ";" : ",";
      const year = s.number <= 5 ? 2 : 3;
      const classId = s.number <= 5 ? "c1" : "c3";
      const isDayScholar = s.number % 2 === 0;
      sql.push(`('s${s.number}', '${s.id}', 'CS202400${s.number}', 'Student ${s.number}', '${s.email}', '2005-01-${10 + s.number}', 'O+', '${s.number} College Road, Bangalore', '+9191234568${10 + s.number}', '+9198765432${10 + s.number}', ${year}, 'd1', '${classId}', ${isDayScholar}, true)${comma}`);
    });
  }

  if (users.admins.length) {
    sql.push("\nINSERT INTO admin_users (id, clerk_user_id, email, name, department_id, is_active) VALUES");
    users.admins.forEach((a, i) => {
      const comma = i === users.admins.length - 1 ? ";" : ",";
      sql.push(`('a${i + 1}', '${a.id}', '${a.email}', 'System Administrator', 'd1', true)${comma}`);
    });
  }

  const filePath = path.join(__dirname, "../generated_supabase_inserts.sql");
  fs.writeFileSync(filePath, sql.join("\n"));
  console.log("\n📝 SQL file saved →", filePath);
}

/* ================= RUN ================= */
createUsers().catch(console.error);
