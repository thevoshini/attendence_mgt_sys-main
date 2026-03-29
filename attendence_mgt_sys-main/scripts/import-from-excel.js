import { createClerkClient } from "@clerk/clerk-sdk-node";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ================= ESM FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

/* ================= CONFIG ================= */
// Edit these to match your classes
const DEFAULT_DEPARTMENT_ID = "d1";   // CSE
const DEFAULT_CLASS_ID = "c1";        // CSE 2nd Year A  (change if needed)
const DEFAULT_YEAR = 2;
const DEFAULT_IS_DAYSCHOLAR = false;
const DEFAULT_PASSWORD_PREFIX = "Student@"; // password = Student@<regno>

/* ================= ENV CHECK ================= */
if (!process.env.CLERK_SECRET_KEY) {
  console.error("❌  Missing CLERK_SECRET_KEY in environment");
  console.error("    Run:  CLERK_SECRET_KEY=sk_test_xxx node scripts/import-from-excel.js");
  process.exit(1);
}

/* ================= XLSX ================= */
const XLSX = require("xlsx");

/* ================= CLERK CLIENT ================= */
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/* ================= HELPERS ================= */

/**
 * Convert Excel serial date number → "YYYY-MM-DD"
 */
function excelDateToISO(serial) {
  if (!serial || typeof serial !== "number") return "2000-01-01";
  // Excel epoch is Jan 0, 1900; JS epoch is Jan 1, 1970
  const utcMs = (serial - 25569) * 86400 * 1000;
  const d = new Date(utcMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Normalise a phone number to "+91XXXXXXXXXX" format.
 * Accepts strings or numbers.
 */
function normalisePhone(raw) {
  if (!raw) return "+910000000000";
  const s = String(raw).replace(/\D/g, ""); // digits only
  if (s.length === 10) return `+91${s}`;
  if (s.length === 12 && s.startsWith("91")) return `+${s}`;
  if (s.length === 11 && s.startsWith("0")) return `+91${s.slice(1)}`;
  return `+91${s.slice(-10)}`;
}

/* ================= DEDUP BY EMAIL ================= */
function deduplicateByEmail(rows) {
  const seen = new Set();
  const unique = [];
  for (const r of rows) {
    const key = (r["Email Address"] || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
  }
  return unique;
}

/* ================= READ EXCEL ================= */
function readStudentsFromExcel() {
  const filePath = path.join(__dirname, "PERSONAL DETAILS (Responses).xlsx");
  if (!fs.existsSync(filePath)) {
    console.error("❌  File not found:", filePath);
    process.exit(1);
  }

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`📋  Total rows read from Excel: ${rows.length}`);

  const unique = deduplicateByEmail(rows);
  console.log(`📋  Unique students (by email): ${unique.length}`);

  return unique.map((r, idx) => {
    const regno = String(r["ROLL NUMBER"] || "").trim();
    const email = (r["Email Address"] || "").trim().toLowerCase();
    const name  = (r["NAME"] || "").trim();
    const dob   = excelDateToISO(r["DATE OF BIRTH"]);
    const blood = (r["BLOOD GROUP"] || "O+").trim();
    const addr  = (r["ADDRESS"] || "").replace(/'/g, "''").trim(); // escape SQL quotes
    const phone = normalisePhone(r["STUDENT PHONE NUMBER"]);
    const pPhone = normalisePhone(r["PARENT PHONE NUMBER"]);

    return {
      idx: idx + 1,
      regno,
      email,
      name,
      dob,
      blood,
      addr,
      phone,
      pPhone,
    };
  });
}

/* ================= CLERK: CREATE ONE USER ================= */
async function createClerkUser(student) {
  const payload = {
    emailAddress: [student.email],
    password: `${DEFAULT_PASSWORD_PREFIX}${student.regno}`,
    firstName: student.name.split(" ")[0],
    lastName: student.name.split(" ").slice(1).join(" ") || student.name,
    skipPasswordChecks: true,
  };

  try {
    const user = await clerk.users.createUser(payload);
    console.log(`  ✅  [${student.idx}] ${student.name} (${student.email}) → ${user.id}`);
    return user.id;
  } catch (err) {
    const msg = err?.errors?.[0]?.message || err.message;

    // If user already exists, try to fetch their ID
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist")) {
      console.warn(`  ⚠️   [${student.idx}] ${student.email} already exists, fetching ID…`);
      try {
        const list = await clerk.users.getUserList({ emailAddress: [student.email] });
        if (list?.data?.length > 0) {
          const existingId = list.data[0].id;
          console.log(`       → Found existing user: ${existingId}`);
          return existingId;
        }
      } catch (fetchErr) {
        console.error(`       → Could not fetch existing user: ${fetchErr.message}`);
      }
    }

    console.error(`  ❌  [${student.idx}] ${student.email} → ${msg}`);
    return null;
  }
}

/* ================= SQL GENERATION ================= */
function generateSQL(results) {
  const lines = ["-- AUTO-GENERATED SUPABASE INSERTS (from PERSONAL DETAILS Excel)"];
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push(`-- Total students: ${results.length}\n`);

  lines.push("INSERT INTO students");
  lines.push("  (id, clerk_user_id, regno, name, email, dob, blood_group, address, phone_no, parent_phone_no, year, department_id, class_id, is_dayscholar)");
  lines.push("VALUES");

  results.forEach((r, i) => {
    const isLast = i === results.length - 1;
    const clerkId = r.clerkId || "CLERK_ID_MISSING";
    lines.push(
      `  ('s${r.idx}', '${clerkId}', '${r.regno}', '${r.name.replace(/'/g, "''")}', '${r.email}',` +
      ` '${r.dob}', '${r.blood}', '${r.addr}', '${r.phone}', '${r.pPhone}',` +
      ` ${DEFAULT_YEAR}, '${DEFAULT_DEPARTMENT_ID}', '${DEFAULT_CLASS_ID}', ${DEFAULT_IS_DAYSCHOLAR})${isLast ? ";" : ","}`
    );
  });

  lines.push("\n-- ON CONFLICT version (safe to re-run):");
  lines.push("-- Add   ON CONFLICT (id) DO NOTHING;   at the end if you run this multiple times.\n");

  return lines.join("\n");
}

/* ================= MAIN ================= */
async function main() {
  console.log("\n🚀  Starting import from PERSONAL DETAILS Excel\n");

  const students = readStudentsFromExcel();
  const results = [];

  for (const student of students) {
    const clerkId = await createClerkUser(student);
    results.push({ ...student, clerkId });

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  const succeeded = results.filter((r) => r.clerkId).length;
  const failed    = results.filter((r) => !r.clerkId).length;

  console.log(`\n📊  Summary`);
  console.log(`   ✅  Created/found: ${succeeded}`);
  console.log(`   ❌  Failed:        ${failed}`);

  const sql = generateSQL(results);
  const outPath = path.join(__dirname, "../generated_supabase_inserts.sql");
  fs.writeFileSync(outPath, sql, "utf8");

  console.log(`\n📝  SQL saved → ${outPath}`);
  console.log(`\n⚡  Next step: Open Supabase SQL Editor and run generated_supabase_inserts.sql\n`);

  // Also print any failed entries so user can handle them manually
  if (failed > 0) {
    console.log("⚠️   Failed entries (handle manually):");
    results.filter((r) => !r.clerkId).forEach((r) => {
      console.log(`   - ${r.name} | ${r.email} | ${r.regno}`);
    });
  }
}

main().catch(console.error);
