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

/* ================= CONSTANTS ================= */
const DEPARTMENT_ID = "92d2164b-6c99-4001-a3db-6f2fc45d6dbf"; // CSE — common for all

const CLASS_ID = {
  1: "eb9c650a-2529-430d-a8ea-1ce313caea40", // I Year
  2: "8ebafe5d-b312-4b10-93c1-0f0d3a17f524", // II Year
  3: "b59ab3ce-7b3f-487f-9323-486dc9dd6f9b", // III Year
};

/* ===============================================================
   STUDENT DATA
   Sources:
     - newcse2.xlsx         → 31 students (II Year)
     - Contact_Information  → 112 students (I Year + III Year)
   =============================================================== */

// ── newcse2.xlsx ── II Year ──────────────────────────────────────
const newcse2Students = [
  { email: "n.s.keerthika27nov@gmail.com", name: "Keerthika S", regno: "421124109023", dob: "2006-11-27", blood_group: "B+", address: "3,kamarajar street, Vettavalam-606754, Tiruvannamali.", phone: "7603829001", parent_phone: "9486065603", year: 2, is_dayscholar: true },
  { email: "2006kishoreantony@gmail.com", name: "R.Kishore Antony", regno: "421124109025", dob: "2006-10-12", blood_group: "AB+", address: "12/B,PENSHANAR LINE, WELLINGTON STREET, CUDDALORE -O.T", phone: "8668187495", parent_phone: "6383241667", year: 2, is_dayscholar: true },
  { email: "tamilpritha12345@gmail.com", name: "Tamizh Selvan A", regno: "421124109045", dob: "2007-03-02", blood_group: "B+", address: "Main Road Parikkal, Ulundurpet Taluk, Kallakurichi Dist.", phone: "9952268561", parent_phone: "9677399761", year: 2, is_dayscholar: true },
  { email: "buvaneshwari1706@gmail.com", name: "Buvaneshwari K", regno: "421124109008", dob: "2006-11-17", blood_group: "AB+", address: "685 D, Sri Thirumal Nagar, L.N.Puram, Panruti.", phone: "6385759366", parent_phone: "8015927944", year: 2, is_dayscholar: true },
  { email: "amirthavarshinijune30@gmail.com", name: "Amirthavarshini R", regno: "421124109004", dob: "2006-06-30", blood_group: "O+", address: "No.149, Sathya Sai Nagar, 3rd cross street, K.N. pettai, Thiruvanthipuram, Cuddalore -607401", phone: "9363730428", parent_phone: "8667217087", year: 2, is_dayscholar: true },
  { email: "merlinarthi12@gmail.com", name: "Merlin Arthi J", regno: "421124109029", dob: "2007-05-12", blood_group: "B+", address: "14,savarinayagan pettai,kalpet,siruvakur,villupuram", phone: "6380003791", parent_phone: "9842472149", year: 2, is_dayscholar: true },
  { email: "advika22062006@gmail.com", name: "Advika S", regno: "421124109001", dob: "2006-06-22", blood_group: "A+", address: "Vasantharayan palayam Vinayagar Kovil street Cuddalore ot 607003", phone: "9486504839", parent_phone: "9600950992", year: 2, is_dayscholar: true },
  { email: "durgashree1606@gmail.com", name: "Durga Shree S", regno: "421124109012", dob: "2007-06-16", blood_group: "O+", address: "No 34, 2nd cross street saraswati nagar thirupapuliyur Cuddalore", phone: "9344202343", parent_phone: "9600530449", year: 2, is_dayscholar: true },
  { email: "thamizharasikumaravel@gmail.com", name: "Thamizharasi K", regno: "421124109046", dob: "2006-12-07", blood_group: "AB+", address: "804,mettu street, pallithennal, Villupuram.", phone: "6383687711", parent_phone: "9384287729", year: 2, is_dayscholar: true },
  { email: "srimahavishnu796@gmail.com", name: "Srimahavishnu B", regno: "421124109041", dob: "2006-12-18", blood_group: "B+", address: "5,MATHA KOVIL STREET MARAKKANAM", phone: "8248848635", parent_phone: "8344422448", year: 2, is_dayscholar: true },
  { email: "patchaiperumal2006@gmail.com", name: "H.Patchai Perumal", regno: "421124109034", dob: "2006-05-03", blood_group: "O+", address: "7/34, Ganapathy Samuthiram, Eral, Thoothukudi", phone: "7305237497", parent_phone: "8903718284", year: 2, is_dayscholar: true },
  { email: "skchandru2006@gmail.com", name: "Chandru SK", regno: "421124109009", dob: "2006-09-09", blood_group: "O+", address: "NO 54,NATHAMUNI NAGAR, KOOTHAPAKKAM, CUDDALORE -2", phone: "8825715487", parent_phone: "9750144807", year: 2, is_dayscholar: true },
  { email: "subashsk.men29@gmail.com", name: "Subash S", regno: "421124109042", dob: "2006-12-29", blood_group: "AB+", address: "3/234,MARIYAMMAN KOVIL STREET KILLIYANUR,ANNA NAGAR,VANUR", phone: "9363638039", parent_phone: "8248848635", year: 2, is_dayscholar: true },
  { email: "gowrivijaya2304@gmail.com", name: "V. Gowri", regno: "421124109016", dob: "2007-04-23", blood_group: "B+", address: "No 24 east St vazhisothanai palayam cuddaore ot", phone: "9361530969", parent_phone: "9344862087", year: 2, is_dayscholar: true },
  { email: "mmanavalan108@gmail.com", name: "Piruthivraj", regno: "421124109035", dob: "2007-01-18", blood_group: "O+", address: "1/56 Mariyamman koil Street sadaiyandikuppam palli thennal post, Villupuram", phone: "9785196226", parent_phone: "9787291334", year: 2, is_dayscholar: true },
  { email: "uk588002@gmail.com", name: "Mohamed Umarkhan M", regno: "421124109030", dob: "2006-09-11", blood_group: "A+", address: "No. 7,Melapalayam, Iluppathoppu, Panruti, Cuddalore", phone: "9943386500", parent_phone: "9943386500", year: 2, is_dayscholar: true },
  { email: "ravikrishnan0703@gmail.com", name: "Ravikrishnan K", regno: "421124109037", dob: "2007-03-07", blood_group: "O+", address: "No:4 Mariamman Kovil Street, sadaiyandikuppam, Thennal post, Villupuram", phone: "7397510841", parent_phone: "8072730226", year: 2, is_dayscholar: true },
  { email: "thirumaranse0505@gmail.com", name: "Thirumaran", regno: "421124109048", dob: "2007-05-05", blood_group: "A+", address: "3/159 quarters street Motchakulam colony, Motchakulam villupuram", phone: "9943754088", parent_phone: "8870095756", year: 2, is_dayscholar: true },
  { email: "vasanthpanduragan2007@gmail.com", name: "Vasanth P", regno: "421124109049", dob: "2007-01-28", blood_group: "A+", address: "No:59 mariyamman Kovil Street,pudukupam, Cuddalore", phone: "7418149313", parent_phone: "9943606236", year: 2, is_dayscholar: true },
  { email: "pragadeshvaran2007@gmail.com", name: "Prakadeshvaran K", regno: "421124109036", dob: "2007-03-05", blood_group: "O+", address: "No:1bharathiyar street, Nellikuppan, Cuddalore", phone: "7010592846", parent_phone: "9042223126", year: 2, is_dayscholar: true },
  { email: "vinnarasu1409@gmail.com", name: "Vinnarasu K", regno: "421124109050", dob: "2006-09-14", blood_group: "A+", address: "No 17 MARIAMMAN KOVIL STREET S.ERIPALAYAM panruti 607106", phone: "6385946738", parent_phone: "6385946738", year: 2, is_dayscholar: true },
  { email: "deepangnanavel007@gmail.com", name: "Deepan G", regno: "421124109010", dob: "2006-08-03", blood_group: "B+", address: "197 Mariamman Kovil Street periya narimedu panruti", phone: "7339348789", parent_phone: "7339348789", year: 2, is_dayscholar: true },
  { email: "jayashakthijayabal@gmail.com", name: "Jaya Shakthi J", regno: "421124109020", dob: "2007-07-29", blood_group: "B+", address: "277-D ,type1 qtrs ,block 29 ,neyveli", phone: "9361350518", parent_phone: "8668124220", year: 2, is_dayscholar: true },
  { email: "jeevaprasadml@gmail.com", name: "Jeeva Prasad M", regno: "421124109021", dob: "2006-12-23", blood_group: "B+", address: "21, ka pattarai street, valavanur post, Villupuram -605108", phone: "7598613579", parent_phone: "9629886679", year: 2, is_dayscholar: true },
  { email: "nareshjothinathan608@gmail.com", name: "Naresh J", regno: "421124109031", dob: "2006-09-19", blood_group: "B+", address: "No.14, sunnambukara street Thiruvathigai panruti", phone: "9629880802", parent_phone: "9361223016", year: 2, is_dayscholar: true },
  { email: "anbarasis089@gmail.com", name: "Anbarasi S", regno: "421124109006", dob: "2006-10-30", blood_group: "AB+", address: "665, vellam pillaiyar kovil street, kurinjipadi, cuddalore- 607302", phone: "7708310469", parent_phone: "8807286876", year: 2, is_dayscholar: true },
  { email: "gurupriya1028@gmail.com", name: "K Gurupriya", regno: "421124109017", dob: "2007-07-30", blood_group: "B+", address: "New Cuddalore main road,s.k.v nagar ,thiruvathigai,panruti.", phone: "9677728761", parent_phone: "9944917772", year: 2, is_dayscholar: true },
  { email: "anand.a312006@gmail.com", name: "Anand A", regno: "421124109005", dob: "2006-07-31", blood_group: "O+", address: "Senthil Nagar, Sitherikarai, Villupuram", phone: "9342188526", parent_phone: "8098116601", year: 2, is_dayscholar: true },
  { email: "jackpotkeerthi@gmail.com", name: "Keerthivasan K", regno: "421124109024", dob: "2005-04-15", blood_group: "B+", address: "Mariyamman Kovil Street, ayyur agaram", phone: "7845062825", parent_phone: "9790411458", year: 2, is_dayscholar: true },
  { email: "madhupalani1012@gmail.com", name: "Madhumitha P", regno: "421124109028", dob: "2006-12-10", blood_group: "O+", address: "1/82 Kulathu street arcot & post kandachipuram (tk) Villupuram district", phone: "9566950311", parent_phone: "9943780557", year: 2, is_dayscholar: true },
  { email: "manjudinesh231@gmail.com", name: "D.Hemalatha", regno: "421124109019", dob: "2007-07-16", blood_group: "A+", address: "Subramaniya Nagar, V.Thotti, Valavanur, Villupuram 605 108", phone: "9500563100", parent_phone: "9500563100", year: 2, is_dayscholar: true },
];

// ── Contact_Information.xlsx ── I Year + III Year ────────────────
const contactStudents = [
  { email: "subashs56370@gmail.com", name: "Subash S", regno: "421125109051", dob: "2008-06-27", blood_group: "O+", address: "44, roshanai pattai, tindivanam", phone: "7845898116", parent_phone: "9791853316", year: 1, is_dayscholar: true },
  { email: "ragulsaravanan218@gmail.com", name: "Ragul S", regno: "421125109042", dob: "2008-01-02", blood_group: "B+", address: "19/5 PALLA STREET VETTAVALAM, THIRUVANNAMALAI DISTRICT.", phone: "8667844680", parent_phone: "9994786458", year: 1, is_dayscholar: true },
  { email: "dr.jayasurya1611@gmail.com", name: "Jayasurya K", regno: "421125109019", dob: "2007-11-16", blood_group: "O-", address: "1/113 mettu street valudhavaur, Villupuram", phone: "9952583204", parent_phone: "9787844866", year: 1, is_dayscholar: true },
  { email: "danushk3105@gmail.com", name: "Danush Kumar", regno: "421125109009", dob: "2007-05-31", blood_group: "B+", address: "8, jayalakshmi nagar,mambalapattu road, ES school opposite, vandimedu", phone: "8939191088", parent_phone: "9361647808", year: 1, is_dayscholar: true },
  { email: "skcnsk2016@gmail.com", name: "Sarudharsana C", regno: "421123109046", dob: "2006-05-21", blood_group: "B+", address: "No.6 , 2nd cross, Thirukameswarar Nagar, Villianur, Puducherry", phone: "7812850526", parent_phone: "9751109181", year: 3, is_dayscholar: true },
  { email: "karthikeyanu33@gmail.com", name: "U Hemadharshini", regno: "421123109015", dob: "2006-09-18", blood_group: "B+", address: "1144/9 kovil street, pudhukuppam, cuddalore", phone: "9150892668", parent_phone: "9994692668", year: 3, is_dayscholar: true },
  { email: "vishnupriyagunasekaran90@gmail.com", name: "Vishnu Priya G", regno: "421125109058", dob: "2007-11-13", blood_group: "B+", address: "73/A, Panchayat Board street, Valavanur, Villupuram 605 108", phone: "9994990052", parent_phone: "9791312230", year: 1, is_dayscholar: true },
  { email: "dhanush021120@gmail.com", name: "Dhanushwaran D", regno: "421125109010", dob: "2007-11-02", blood_group: "B+", address: "3/83, Middle Street, T. Mudiyanur, thirukkovilur, kallakurichi district,605766", phone: "8778859618", parent_phone: "9025958472", year: 1, is_dayscholar: false },
  { email: "mlathika10122007@gmail.com", name: "M.Lathika", regno: "421125109031", dob: "2007-10-12", blood_group: "A+", address: "4/13D rajam pettai west street Tindivanam Viluppuram district", phone: "9363648234", parent_phone: "9585244828", year: 1, is_dayscholar: true },
  { email: "kavithr357@gmail.com", name: "Kavitha R", regno: "421125109026", dob: "2007-10-30", blood_group: "O+", address: "No 1,Mariyamman koil street, Kammiyam pettai, Cuddalore.", phone: "6382853335", parent_phone: "7708917473", year: 1, is_dayscholar: true },
  { email: "renurajendran77@gmail.com", name: "Renuga Devi R", regno: "421125109045", dob: "2007-12-06", blood_group: "A+", address: "577, kurinji nagar,L.N.puram,panruti.", phone: "8610830199", parent_phone: "8056465867", year: 1, is_dayscholar: true },
  { email: "logesh1608.official@gmail.com", name: "Logesh V", regno: "421125109032", dob: "2008-06-01", blood_group: "O+", address: "No:11,kattukollai,seyankuppam,anumandhai,marakanam, villupuram -604303", phone: "7845871608", parent_phone: "9360623424", year: 1, is_dayscholar: true },
  { email: "mohamedshajeeds@gmail.com", name: "Mohamed Shajeed I", regno: "421125109033", dob: "2008-02-29", blood_group: "A+", address: "33/19 MUSLIM STREET melpattampakkam", phone: "8940762725", parent_phone: "8940543693", year: 1, is_dayscholar: true },
  { email: "karthikeyan200706@gmail.com", name: "Karthikeyan S", regno: "421125109023", dob: "2007-08-06", blood_group: "O+", address: "3/778,EAST PONDY MAIN ROAD,KANDAMANGALAM, VILLUPURAM -605102", phone: "8778239906", parent_phone: "7395887474", year: 1, is_dayscholar: true },
  { email: "sujeesh.bjms@gmail.com", name: "Sujeesh B", regno: "421125109053", dob: "2008-01-16", blood_group: "A1+", address: "7/303-1 pudhunagar,Emaneshwaran(pos),paramakudi,Ramanathapuram(dis)", phone: "9025911619", parent_phone: "9786162465", year: 1, is_dayscholar: false },
  { email: "kavinayav1307@gmail.com", name: "Kavinaya", regno: "421125109025", dob: "2007-07-13", blood_group: "O+", address: "49,Anna nagar,kurinjipadi, Cuddalore", phone: "8610103325", parent_phone: "9360172097", year: 1, is_dayscholar: false },
  { email: "selvamsuriya808@gmail.com", name: "Soorya", regno: "421125109050", dob: "2007-10-06", blood_group: "A1+", address: "1/152 theradi street,periya babu samuthiram", phone: "9363136281", parent_phone: "9363136281", year: 1, is_dayscholar: true },
  { email: "akshupranesh@gmail.com", name: "Akshaya S", regno: "421123109005", dob: "2005-10-19", blood_group: "B+", address: "23/3, vaikunda vasagar street, Villupuram", phone: "6379395318", parent_phone: "9790282002", year: 3, is_dayscholar: true },
  { email: "kathisyed2008@gmail.com", name: "Kathija M", regno: "421125109024", dob: "2008-03-24", blood_group: "A+", address: "37/11 Moulana abdul kareem street,Nellikuppam.", phone: "9042938756", parent_phone: "9500405596", year: 1, is_dayscholar: true },
  { email: "rigar920@gmail.com", name: "Rigashini S", regno: "421125109046", dob: "2008-07-09", blood_group: "B+", address: "33/A gokula street, thiruvathigai, panruti.", phone: "9952339657", parent_phone: "9952339657", year: 1, is_dayscholar: true },
  { email: "b.saranya242008@gmail.com", name: "B.Saranya", regno: "421125109047", dob: "2008-07-24", blood_group: "O-", address: "No:1/65, Throwpathi Amman Kovil Street, uppuvelur", phone: "9790944284", parent_phone: "7358192536", year: 1, is_dayscholar: true },
  { email: "keerthi20808@gmail.com", name: "Keerthika J", regno: "421125109027", dob: "2008-03-31", blood_group: "B+", address: "119, MARIYAMMAN KOVIL ST, KEEZHAVARAPET, PANRUTI, CUDDALORE.", phone: "6369364639", parent_phone: "8072115607", year: 1, is_dayscholar: true },
  { email: "pavi65077@gmail.com", name: "Pavithra G", regno: "421125109038", dob: "2007-11-14", blood_group: "O+", address: "No.23, Ranga nathan nagar ,koothapakam Cuddalore", phone: "9092324803", parent_phone: "9150603514", year: 1, is_dayscholar: true },
  { email: "rajangovinda036@gmail.com", name: "Govindarajan", regno: "421125109014", dob: "2008-05-06", blood_group: "A+", address: "SOUTH STREET, PULIYURKATTUSAGAI, Puliyur (West), PO: Puliyur, DIST:Cuddalore, Tamil Nadu - 607301", phone: "6381549046", parent_phone: "9790402346", year: 1, is_dayscholar: true },
  { email: "kiruthigakiruthigaramu@gmail.com", name: "R.Kiruthiga", regno: "421125109029", dob: "2008-05-26", blood_group: "B+", address: "No:53 East street, Nallathur, Tamilnadu", phone: "7305764538", parent_phone: "9443659825", year: 1, is_dayscholar: true },
  { email: "thenmozhiovi19@gmail.com", name: "Thenmozhi S", regno: "421125109055", dob: "2007-12-19", blood_group: "A+", address: "No,76 MARIYAMMAN KOVIL STREET, AMMANAKUPPAM, KOODAPAKKAM POST, VILLUPURAM 605502", phone: "9363023811", parent_phone: "9786534873", year: 1, is_dayscholar: true },
  { email: "sofiyamani08@gmail.com", name: "Sofiya", regno: "421125109049", dob: "2008-05-01", blood_group: "O-", address: "No:4/524 Gengaiyamman kovil st, Parasureddipalayam, Villupuram", phone: "8940238198", parent_phone: "9789694680", year: 1, is_dayscholar: true },
  { email: "ragul.rsivanandham@gmail.com", name: "Ragul S", regno: "421123109034", dob: "2005-12-01", blood_group: "O+", address: "Pillayar Kovil Street Jankipuram, kandamanadi(post), Villupuram.", phone: "8015406533", parent_phone: "9790412467", year: 3, is_dayscholar: true },
  { email: "srajashreegowri@gmail.com", name: "Rajashree S", regno: "421125109044", dob: "2008-04-30", blood_group: "O+", address: "Perumal Kovil Street, V.Sathanur, Villupuram district-605 652", phone: "9789559330", parent_phone: "9600546828", year: 1, is_dayscholar: true },
  { email: "yogapriya3339@gmail.com", name: "L Yoga Priya", regno: "421125109030", dob: "2008-07-15", blood_group: "A-", address: "No.79/5,1st cross street,Pondy Road,Marakkanam", phone: "9344084962", parent_phone: "7010920850", year: 1, is_dayscholar: true },
  { email: "charumathimathi07@gmail.com", name: "Charumathi E", regno: "421123109007", dob: "2006-08-01", blood_group: "O+", address: "3/123 Murugan kovil st,samipettai,anangoor,villupuram", phone: "6374198790", parent_phone: "9789262475", year: 3, is_dayscholar: true },
  { email: "muralisudharsan67@gmail.com", name: "M.Sudharsan", regno: "421125109052", dob: "2008-03-11", blood_group: "AB+", address: "No .132, Cuddalore Main road, Villupuram,kondur-601 105", phone: "8825470793", parent_phone: "9786526277", year: 1, is_dayscholar: true },
  { email: "bala995202@gmail.com", name: "Balamurugan", regno: "421125109006", dob: "2008-07-17", blood_group: "O+", address: "66, jaganathan nagar, Panampattu, Villupuram", phone: "8056512935", parent_phone: "8098816829", year: 1, is_dayscholar: true },
  { email: "ishwariya500@gmail.com", name: "S. Ishwariya", regno: "421123109016", dob: "2006-04-12", blood_group: "A+", address: "No:32/E Dhanalakshmi garden, Villupuram", phone: "9123520412", parent_phone: "8754910385", year: 3, is_dayscholar: true },
  { email: "sandhiyasekar965@gmail.com", name: "Sandhiya S", regno: "421123109042", dob: "2006-01-04", blood_group: "B+", address: "No.431,Mettu street ,T.pudhukuppam, Thirumangalam road, Villupuram district.", phone: "7845343835", parent_phone: "9791469815", year: 3, is_dayscholar: true },
  { email: "hemavarshinimanikandan4@gmail.com", name: "M.Hemavarshini", regno: "421125109016", dob: "2007-09-08", blood_group: "O+", address: "1/D,diversion road, Panruti", phone: "8122870750", parent_phone: "9047410750", year: 1, is_dayscholar: true },
  { email: "nivethasankaran07@gmail.com", name: "Nivetha S", regno: "421125109037", dob: "2007-11-11", blood_group: "A1B-", address: "25/4,maruthi Nagar kottakkari vadalur -607303", phone: "7502729355", parent_phone: "8778270800", year: 1, is_dayscholar: true },
  { email: "sanjaidass7@gmail.com", name: "N.Sanjai", regno: "421123109043", dob: "2005-11-12", blood_group: "A+", address: "11/104 bharathiyar street v.marudhur villupuram", phone: "9361690730", parent_phone: "9361690730", year: 3, is_dayscholar: true },
  { email: "ganeshangharipriya@gmail.com", name: "G.Haripriya", regno: "421125109015", dob: "2007-07-15", blood_group: "O+", address: "4/379, kottaiputhur, naduvaneri, Vembadithalam, salem district", phone: "8754489807", parent_phone: "9042883230", year: 1, is_dayscholar: false },
  { email: "kanishkaajayalalitha@gmail.com", name: "J.Kanishkaa", regno: "421125109020", dob: "2008-06-24", blood_group: "B+", address: "No:2,Nathan Nayagi Nagar,Koothapakkam,Cuddalore -2", phone: "7092802321", parent_phone: "9585432321", year: 1, is_dayscholar: true },
  { email: "gopzsajan2007@gmail.com", name: "Gopika S", regno: "421125109013", dob: "2007-11-28", blood_group: "A+", address: "No:8/8 kailasanathar street, muthoopu, Villupuram", phone: "8610081947", parent_phone: "7092665455", year: 1, is_dayscholar: true },
  { email: "prasannablesse2001@gmail.com", name: "Prasanna D", regno: "421123109030", dob: "2006-01-20", blood_group: "B+", address: "3/116 new colony, Radhapuram (post), vikkiravandi (T), Villupuram (D), Pincode: 605501", phone: "9043050541", parent_phone: "9786244457", year: 3, is_dayscholar: true },
  { email: "dhineshkumar.sofficial@gmail.com", name: "Dhinesh Kumar S", regno: "421125109011", dob: "2008-03-26", blood_group: ".", address: "135,marriamman koil Street panampattu, viluppuram. 605103", phone: "7708131062", parent_phone: "9003375669", year: 1, is_dayscholar: true },
  { email: "mugeshv16408@gmail.com", name: "Mugesh V", regno: "421125109035", dob: "2008-04-16", blood_group: "B+", address: "No 36, 2nd cross street,chandhramouliswarar nagar, thiruvakkarai, vanur tk, Villupuram -604304", phone: "8189848041", parent_phone: "9159348361", year: 1, is_dayscholar: true },
  { email: "naveenmknmurugan@gmail.com", name: "Naveen", regno: "421123109301", dob: "2002-10-10", blood_group: "O+", address: "1/3 7 cross kk nager", phone: "9360423961", parent_phone: "9360423961", year: 3, is_dayscholar: true },
  { email: "prithivirajan1207@gmail.com", name: "Prithivirajan V", regno: "421123109032", dob: "2006-07-12", blood_group: "AB-", address: "No1,kundalakesi street, dhakshanamoorthy nagar, manjakuppam,Cuddalore", phone: "7904265063", parent_phone: "8220090384", year: 3, is_dayscholar: true },
  { email: "priyadharshini11032006@gmail.com", name: "Priyadharshini V", regno: "421123109033", dob: "2006-03-11", blood_group: "B+", address: "Sivagangai", phone: "9361534627", parent_phone: "7639990657", year: 3, is_dayscholar: false },
  { email: "vasanthramesh54233@gmail.com", name: "Vasanth R", regno: "421123109053", dob: "2006-02-08", blood_group: "AB+", address: "no 24-A pondy main road, manjakuppam, cuddalore", phone: "8056899337", parent_phone: "8870499337", year: 3, is_dayscholar: true },
  { email: "pradheeshamurugan@gmail.com", name: "Pradheesha M", regno: "421123109029", dob: "2006-07-09", blood_group: "A+", address: "Panruti", phone: "9943926613", parent_phone: "8870759364", year: 3, is_dayscholar: false },
  { email: "smnadeem2327@gmail.com", name: "Mohamed Nadeem S", regno: "421123109022", dob: "2005-09-23", blood_group: "O+", address: "No.1/154,Iyyer Street, Koonimedu, Villupuram", phone: "8015404316", parent_phone: "8667463821", year: 3, is_dayscholar: true },
  { email: "shubhashreesuba@gmail.com", name: "Shubhashree M", regno: "421123109048", dob: "2005-12-22", blood_group: "O+", address: "130,thangam nagar, panayapuram, villupuram, tamilnadu, 605601", phone: "9600590660", parent_phone: "9994842885", year: 3, is_dayscholar: true },
  { email: "peran1805@gmail.com", name: "Peranandhan M", regno: "421123109028", dob: "2006-05-18", blood_group: "B+", address: "Pondicherry", phone: "9787828604", parent_phone: "9787464242", year: 3, is_dayscholar: true },
  { email: "balabalajothi197@gmail.com", name: "Balajothi S", regno: "421125109005", dob: "2006-11-24", blood_group: "A+", address: "247 river street,kattamuthupalayam,panruti-607205", phone: "9363137764", parent_phone: "9442382417", year: 1, is_dayscholar: true },
  { email: "srigopika.srik411@gmail.com", name: "Sri Gopika K", regno: "421123109050", dob: "2006-04-24", blood_group: "A1+", address: "Nanamedu main road, Nanamedu post, Cuddalore", phone: "9629268240", parent_phone: "9600469924", year: 3, is_dayscholar: true },
  { email: "narayananjanani638@gmail.com", name: "Janani N", regno: "421125109018", dob: "2007-08-26", blood_group: "O+", address: "Main road, thattampalayam. Panruti (tk), cuddalore (dist)", phone: "7010549037", parent_phone: "9345485461", year: 1, is_dayscholar: true },
  { email: "paliniyerramsetti@gmail.com", name: "Yerramsetti Palini Sumukhi", regno: "421123109054", dob: "2006-07-26", blood_group: "O+", address: "14-40-1/A Yerramsetti Vaari Veedhi, Tadepalligudem, West Godavari Andhra Pradesh - 534101", phone: "7842541187", parent_phone: "9866292647", year: 3, is_dayscholar: false },
  { email: "brahannayagi007@gmail.com", name: "Brahan Nayagi R", regno: "421125109007", dob: "2008-05-01", blood_group: "O+", address: "No:10,Reddy Chatiram Street ,Thirupapuliyur, Cuddalore", phone: "7397134469", parent_phone: "6369582025", year: 1, is_dayscholar: true },
  { email: "mohanakandan110705@gmail.com", name: "Mohana Kandan G", regno: "421123109023", dob: "2005-07-11", blood_group: "O+", address: "4/5,A P, Sivaraman nagar,panruti", phone: "9578137710", parent_phone: "9944485024", year: 3, is_dayscholar: true },
  { email: "divakars232008@gmail.com", name: "Divakar S", regno: "421125109012", dob: "2008-07-23", blood_group: "B+", address: "9/16,Meenakshi Amman Pettai Street, Panruti-607 106", phone: "9363218281", parent_phone: "9842034029", year: 1, is_dayscholar: true },
  { email: "muthubalaji2308@gmail.com", name: "Balaji V", regno: "421125109004", dob: "2007-08-23", blood_group: "B+", address: "Dhanapal street 7c/2,panruti", phone: "8072069227", parent_phone: "9976994689", year: 1, is_dayscholar: true },
  { email: "vigneshkrishna2803@gmail.com", name: "K.Vignesh", regno: "421125109057", dob: "2008-03-28", blood_group: "B+", address: "No:21 East Street K.R palayam", phone: "8838550227", parent_phone: "9944402742", year: 1, is_dayscholar: true },
  { email: "praveenarul2007@gmail.com", name: "Praveen A", regno: "421125109040", dob: "2007-11-06", blood_group: "A+", address: "Mariyamman Kovil Street, Thiruvakkarai", phone: "9787432128", parent_phone: "9787432150", year: 1, is_dayscholar: true },
  { email: "pchethna@gmail.com", name: "Chethna P", regno: "421125109008", dob: "2008-01-16", blood_group: "B+", address: "223,Sri Sakthi nagar ext, Gandhi nagar post,Vadakuththu, 607308", phone: "8015159168", parent_phone: "9894184574", year: 1, is_dayscholar: true },
  { email: "kabilanrollno21@gmail.com", name: "Kapilan B", regno: "421125109021", dob: "2007-12-24", blood_group: "O+", address: "No 4 thirumalai nagar manjakuppam Cuddalore", phone: "9698523978", parent_phone: "9698523978", year: 1, is_dayscholar: true },
  { email: "mdsuzil1212@gmail.com", name: "A K Mohamed Suzil", regno: "421125109034", dob: "2007-09-16", blood_group: "B+", address: "2/39 thanthai periyar street nellikuppam Cuddalore", phone: "7639575603", parent_phone: "9943247560", year: 1, is_dayscholar: true },
  { email: "poonkuzhali2325@gmail.com", name: "Poonkuzhali K", regno: "421125109039", dob: "2008-06-25", blood_group: "A1-", address: "2/43 yadhavar street C.N.palayam", phone: "8925225226", parent_phone: "8925225226", year: 1, is_dayscholar: true },
  { email: "nithyajairajram@gmail.com", name: "R.Nithya", regno: "421125109036", dob: "2007-12-09", blood_group: "B+", address: "27/19 ranganathan road villupuram", phone: "8870152899", parent_phone: "7558191606", year: 1, is_dayscholar: true },
  { email: "kirthigakirubanithi@gmail.com", name: "Kirthiga K", regno: "421125109028", dob: "2008-02-07", blood_group: "B+", address: "No.9/811,malrajankuppam, Villupuram", phone: "8870806524", parent_phone: "9894997687", year: 1, is_dayscholar: true },
  { email: "jaiakash2552008@gmail.com", name: "B. Jai Akash", regno: "421125109017", dob: "2008-05-25", blood_group: "O+", address: "No.2 Iyyanar Kovil Street panruti", phone: "6369239112", parent_phone: "6381770079", year: 1, is_dayscholar: true },
  { email: "uthrauthra78@gmail.com", name: "Uthirapathi G", regno: "421123109051", dob: "2006-07-30", blood_group: "B+", address: "No.313 ambethkar nagar, pathirakottai, Cuddalore", phone: "8925227297", parent_phone: "6385332379", year: 3, is_dayscholar: true },
  { email: "santhoshjemini27@gmail.com", name: "Santhosh Jemini J", regno: "421123109045", dob: "2005-06-27", blood_group: "O+", address: "2/196, indira nagar, pallineliyanur, Villupuram", phone: "8608233174", parent_phone: "9994233174", year: 3, is_dayscholar: true },
  { email: "jagansham78@gmail.com", name: "Sham J", regno: "421123109047", dob: "2004-12-18", blood_group: "B+", address: "No 15 sam ponniya nagar tindivanam 604001", phone: "8838476178", parent_phone: "7339629804", year: 3, is_dayscholar: true },
  { email: "monicarajamohan@gmail.com", name: "Monica R", regno: "421123109025", dob: "2005-11-12", blood_group: "O+", address: "207, 6th main Street, b1 block, Maatrikudi Iruppu, Indra Nagar, Neyveli.", phone: "8610020582", parent_phone: "9443414044", year: 3, is_dayscholar: true },
  { email: "senthilnehru961@gmail.com", name: "Vaishnavi N", regno: "421123109052", dob: "2005-08-26", blood_group: "O+", address: "No.4 Raja Annamalai Nagar, Gorimedu, Puducherry", phone: "8122854079", parent_phone: "9894677135", year: 3, is_dayscholar: true },
  { email: "ramachandransuresh1902@gmail.com", name: "Ramachandran S", regno: "421123109038", dob: "2006-02-19", blood_group: "O+", address: "4/5 4th Agraharam Street Agraharam Kk Nagar Kurinjipadi, Cuddalore District", phone: "8838986926", parent_phone: "9344649799", year: 3, is_dayscholar: true },
  { email: "munespandi1819@gmail.com", name: "Munes Pandi C", regno: "421123109026", dob: "2005-12-19", blood_group: "B+", address: "Palayapattu st, Ulundurpet, kallakurichi dt", phone: "9943783545", parent_phone: "9976858600", year: 3, is_dayscholar: true },
  { email: "reshmasankar182006@gmail.com", name: "S Reshma", regno: "421123109039", dob: "2006-03-18", blood_group: "O+", address: "No 43, Perumal Kovil Street, Vengadathiri Agaram, Villupuram.", phone: "7604849606", parent_phone: "9445977356", year: 3, is_dayscholar: true },
  { email: "rampavithra072@gmail.com", name: "Pavithra R", regno: "421123109027", dob: "2006-03-22", blood_group: "AB+", address: "21B, Vandimedu, Villupuram", phone: "8667389144", parent_phone: "9043669164", year: 3, is_dayscholar: true },
  { email: "rkr91005@gmail.com", name: "Rajakumar S", regno: "421123109036", dob: "2006-04-11", blood_group: "A+", address: "Mailam road north street kayathur", phone: "7603868836", parent_phone: "7358708836", year: 3, is_dayscholar: true },
  { email: "prathapkurinjipadi@gmail.com", name: "Prathap P", regno: "421123109031", dob: "2006-01-21", blood_group: "O+", address: "No:779,nadesan nagar,Virupatchi,velavinayagar kuppam,kurinjipadi,Cuddalore district", phone: "8610492423", parent_phone: "8610492423", year: 3, is_dayscholar: true },
  { email: "shivananth2006@gmail.com", name: "Sivananthakrishnan R", regno: "421123109049", dob: "2006-06-20", blood_group: "O+", address: "212/3 mariyamman Kovil st ,tharkas, pazhayar post, srikali tk, Mayiladuthurai dt ,609101", phone: "6382058127", parent_phone: "9787173845", year: 3, is_dayscholar: false },
  { email: "elumalaidivakar8@gmail.com", name: "Divakar EU", regno: "421123109010", dob: "2005-10-15", blood_group: "AB+", address: "273, Om Shakthi nagar, panampattu Villupuram", phone: "9894418072", parent_phone: "9944584049", year: 3, is_dayscholar: true },
  { email: "praguram05@gmail.com", name: "Raguram P", regno: "421123109035", dob: "2006-05-11", blood_group: "B+", address: "169/15 8b govindhamal nagar pathirikuppam Cuddalore 607 002", phone: "6379646180", parent_phone: "9487333805", year: 3, is_dayscholar: true },
  { email: "rajapriyaraji26@gmail.com", name: "Rajapriya R", regno: "421123109037", dob: "2006-06-26", blood_group: "B+", address: "Vsp Nagar john dewey school backside panruti", phone: "8925781645", parent_phone: "9566417245", year: 3, is_dayscholar: true },
  { email: "yogiyogi.20052005@gmail.com", name: "Yogeshwaran S", regno: "421123109055", dob: "2005-12-12", blood_group: "O+", address: "AKA nagar near municipal office - kurinjipadi", phone: "6383158153", parent_phone: "9342004625", year: 3, is_dayscholar: true },
  { email: "janarthanamgokul123@gmail.com", name: "Gokul J", regno: "421123109011", dob: "2006-04-06", blood_group: "O+", address: "1/14, east street, udaiyanatham", phone: "9543658306", parent_phone: "9543790712", year: 3, is_dayscholar: true },
  { email: "jayasuriya1042006@gmail.com", name: "Jayasuriya J", regno: "421123109017", dob: "2006-04-10", blood_group: "O+", address: "Mariamman Kovil street,ganapathipet, Villupuram", phone: "7603862750", parent_phone: "9489378851", year: 3, is_dayscholar: true },
  { email: "kamalpavanesh@gmail.com", name: "Kamalesh S", regno: "421123109021", dob: "2006-02-27", blood_group: "B+", address: "17/7 bharathamathah street panruti", phone: "6383947599", parent_phone: "8870606480", year: 3, is_dayscholar: true },
  { email: "ashmithalaila@gmail.com", name: "Juhi Ashmitha R", regno: "421123109019", dob: "2005-10-11", blood_group: "A+", address: "14, vallalar street, Varadarajan nagar, semmandalam, Cuddalore", phone: "9842097654", parent_phone: "7845065645", year: 3, is_dayscholar: true },
  { email: "rrodeonight@gmail.com", name: "G. Harish Ragav", regno: "421123109014", dob: "2006-05-03", blood_group: "O+", address: "krishna illam lalpuram dhamaodharan nagar-112A, chidambaram, cuddalore", phone: "9790198333", parent_phone: "9787388941", year: 3, is_dayscholar: true },
  { email: "h30556032@gmail.com", name: "Harini K", regno: "421123109013", dob: "2006-06-28", blood_group: "A+", address: "Valavanur", phone: "7639221613", parent_phone: "7639221613", year: 3, is_dayscholar: true },
  { email: "akshayal2006@gmail.com", name: "Akshaya L", regno: "421123109004", dob: "2006-01-09", blood_group: "O+", address: "Dood No 134, Arpisampalayam, kathirvel nagar, villupuram 605108", phone: "9345536307", parent_phone: "8667654270", year: 3, is_dayscholar: false },
  { email: "mohanapriyavelmurugan2006@gmail.com", name: "Mohanapriya V", regno: "421123109024", dob: "2006-08-06", blood_group: "A-", address: "Durai nagar near register office, vadalur", phone: "7603852860", parent_phone: "9942049782", year: 3, is_dayscholar: true },
  { email: "dhiviya136@gmail.com", name: "Dhivyabharathi B", regno: "421123109009", dob: "2006-02-01", blood_group: "B+", address: "892/A South Street L.N Puram, Panruti", phone: "9344787583", parent_phone: "7397735131", year: 3, is_dayscholar: true },
  { email: "pperiyasamy950@gmail.com", name: "Balaji P", regno: "421125109003", dob: "2008-05-30", blood_group: "B+", address: "Mathi nagar, thirubuvanai palayam, puducherry", phone: "6374153049", parent_phone: "9361687274", year: 1, is_dayscholar: true },
  { email: "vasanthvasanth44318@gmail.com", name: "Jeeva S", regno: "421123109018", dob: "2005-11-27", blood_group: "B+", address: "Marriyamman Kovil Street Ponnankuppam, vikravandi", phone: "6369197226", parent_phone: "7639926917", year: 3, is_dayscholar: true },
  { email: "abinayasubrayalu07@gmail.com", name: "S.Abinaya", regno: "421123109002", dob: "2006-05-01", blood_group: "B+", address: "Mazhuventhi Amman Kovil street, Rampakkam", phone: "9025338061", parent_phone: "9944553201", year: 3, is_dayscholar: true },
  { email: "anitha19sachi@gmail.com", name: "S.Anitha", regno: "421125109002", dob: "2008-05-19", blood_group: "O+", address: "No:19, Police station street,Reddichavaddi,Kilzhazhichapattu, Cuddalore - 607402", phone: "6374775917", parent_phone: "9047699177", year: 1, is_dayscholar: true },
  { email: "pdharsan228@gmail.com", name: "Priyadarshan S", regno: "421125109041", dob: "2007-10-29", blood_group: "O+", address: "2/457 Mariyamman Kovil Street bommyarpalayam", phone: "8148560373", parent_phone: "8148560373", year: 1, is_dayscholar: true },
  { email: "yuvasri260120@gmail.com", name: "Yuvasri M", regno: "431123109056", dob: "2006-01-26", blood_group: "O+", address: "3/89,Perumal kovil street, Malarajankuppam, Villupuram.", phone: "9751700742", parent_phone: "7845292811", year: 3, is_dayscholar: true },
  { email: "sjoysanjay3@gmail.com", name: "S.Sanjay", regno: "421123109044", dob: "2006-02-28", blood_group: "O+", address: "389,7th main street,b2 block,indra nagar ,neyveli", phone: "7603882595", parent_phone: "9444283136", year: 3, is_dayscholar: true },
  { email: "ssairam0144@gmail.com", name: "S.Sai Ram", regno: "421123109040", dob: "2005-03-14", blood_group: "B+", address: "No.6A,Santhana bajanai Kovil Street Villupuram", phone: "9361648868", parent_phone: "9361648868", year: 3, is_dayscholar: true },
  { email: "adhichalvan@gmail.com", name: "Aathiselvan", regno: "421123109001", dob: "2006-04-05", blood_group: "O+", address: "A. Melmampattu east street panruti", phone: "8610165357", parent_phone: "9688404039", year: 3, is_dayscholar: true },
  { email: "kalaiyarasukalaiyarasu612@gmail.com", name: "Kalaiyarasu M", regno: "421123109020", dob: "2006-01-27", blood_group: "A+", address: "202,Middle Street, tenkuthu, Cuddalore", phone: "9952603233", parent_phone: "6374793895", year: 3, is_dayscholar: true },
  { email: "arunkumarak5550@gmail.com", name: "Arun Kumar G", regno: "421123109006", dob: "2006-05-05", blood_group: "AB-", address: "349/104 ELLAIYAMMAN KOIL STREET ,KALINJIKUPPAM, VILLUPURAM", phone: "7010815798", parent_phone: "9486593771", year: 3, is_dayscholar: true },
  { email: "balajibalamurugan05@gmail.com", name: "B.Selvarasu", regno: "421125109048", dob: "2008-01-31", blood_group: "B+", address: "No:8 V.O.C nagar, ALC church opposite, abatharanapuram, vadalur-607303", phone: "8015326010", parent_phone: "9842015343", year: 1, is_dayscholar: true },
  { email: "tamiltamil94932@gamil.com", name: "S. Thamizharasan", regno: "421125109054", dob: "2007-07-31", blood_group: "O+", address: "Natesan nagar, Kandamangalam", phone: "8925080692", parent_phone: "8925080692", year: 1, is_dayscholar: true },
  { email: "ajeethkumarajeethkumar817@gmail.com", name: "Ajeethkumar B", regno: "421123109003", dob: "2006-03-29", blood_group: "A+", address: "South Street,Melkattupalayam,kelirupu post, Panruti TK, Cuddalore Dist, Tamil Nadu", phone: "8946029448", parent_phone: "7094667587", year: 3, is_dayscholar: true },
  { email: "karthikskarthiks05929@gmail.com", name: "Karthik Raj S", regno: "421125109022", dob: "2008-06-07", blood_group: "O+", address: "40/30,raman street, panruti", phone: "7806974201", parent_phone: "8015104834", year: 1, is_dayscholar: true },
  { email: "hariharanjana608@gmail.com", name: "Hariharan T", regno: "421123109012", dob: "2006-06-28", blood_group: "AB+", address: "197, kurunji nagar, Semmandalam, Cuddalore", phone: "8344471606", parent_phone: "9688346866", year: 3, is_dayscholar: true },
  { email: "sampraveenmusic@gmail.com", name: "Sam Praveen G", regno: "421123109041", dob: "2005-12-03", blood_group: "A+", address: "428-B, Type-1 Qtrs, Block-29, Neyveli, 607807", phone: "9566669388", parent_phone: "9751426885", year: 3, is_dayscholar: true },
  { email: "varunkumar27vk@gmail.com", name: "Varun Kumar", regno: "421125109056", dob: "2008-08-27", blood_group: "O+", address: "East Coast Rd, opposite to Ocean Spray Hotel, Manjakuppam, Tamil Nadu 605014", phone: "8668102610", parent_phone: "9786804275", year: 1, is_dayscholar: true },
];

// Merge both arrays
const allStudents = [...newcse2Students, ...contactStudents];

/* ================= CREATE USERS IN CLERK ================= */

async function createBatch(students, store) {
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const nameParts = s.name.trim().split(" ");
    try {
      const newUser = await clerk.users.createUser({
        emailAddress: [s.email],
        password: s.email, // default password = email
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
      });
      store.push({ ...s, clerkId: newUser.id });
      console.log(`✅ [Year ${s.year}] ${s.regno} | ${s.name} → ${newUser.id}`);
    } catch (err) {
      const msg = err.errors?.[0]?.message || err.message;
      console.error(`❌ ${s.email} → ${msg}`);
      store.push({ ...s, clerkId: null });
    }
  }
}

async function createUsers() {
  console.log(`\n🚀 Starting Clerk User Creation — Total: ${allStudents.length} students\n`);
  console.log(`   II Year : ${newcse2Students.length} (newcse2.xlsx)`);
  console.log(`   I + III Year : ${contactStudents.length} (Contact_Information.xlsx)\n`);

  const created = [];
  await createBatch(allStudents, created);

  const success = created.filter(s => s.clerkId).length;
  const failed = created.filter(s => !s.clerkId).length;
  console.log(`\n📊 SUMMARY — Total: ${created.length} | ✅ Success: ${success} | ❌ Failed: ${failed}`);

  generateSQL(created);
}

/* ================= SQL GENERATION ================= */

function esc(str) {
  return String(str ?? "").replace(/'/g, "''");
}

function generateSQL(students) {
  const now = new Date().toISOString();
  const sql = [];

  sql.push("-- ============================================================");
  sql.push("-- AUTO-GENERATED SUPABASE INSERT — students table");
  sql.push(`-- Generated : ${now}`);
  sql.push(`-- Total     : ${students.length} students`);
  sql.push(`-- Sources   : newcse2.xlsx (II Year) + Contact_Information.xlsx (I & III Year)`);
  sql.push("-- Department: 92d2164b-6c99-4001-a3db-6f2fc45d6dbf (CSE)");
  sql.push("-- Class IDs : I  → eb9c650a-2529-430d-a8ea-1ce313caea40");
  sql.push("--             II → 8ebafe5d-b312-4b10-93c1-0f0d3a17f524");
  sql.push("--             III→ b59ab3ce-7b3f-487f-9323-486dc9dd6f9b");
  sql.push("-- ============================================================\n");

  sql.push("INSERT INTO students (");
  sql.push("  id,");
  sql.push("  clerk_user_id,");
  sql.push("  regno,");
  sql.push("  name,");
  sql.push("  dob,");
  sql.push("  blood_group,");
  sql.push("  address,");
  sql.push("  phone_no,");
  sql.push("  parent_phone_no,");
  sql.push("  email,");
  sql.push("  year,");
  sql.push("  depertment,");
  sql.push("  class_id,");
  sql.push("  is_dayscholar,");
  sql.push("  password_changed,");
  sql.push(`  created_at,`);
  sql.push(`  updated_at,`);
  sql.push("  is_active");
  sql.push(") VALUES");

  students.forEach((s, i) => {
    const isLast = i === students.length - 1;
    const clerkId = s.clerkId ? `'${s.clerkId}'` : "NULL";
    const classId = CLASS_ID[s.year];

    sql.push(
      `  ('${esc(s.regno)}', ${clerkId}, '${esc(s.regno)}', '${esc(s.name)}', ` +
      `'${esc(s.dob)}', '${esc(s.blood_group)}', '${esc(s.address)}', ` +
      `'${esc(s.phone)}', '${esc(s.parent_phone)}', '${esc(s.email)}', ` +
      `${s.year}, '${DEPARTMENT_ID}', '${classId}', ` +
      `${s.is_dayscholar}, false, '${now}', '${now}', true)${isLast ? ";" : ","}`
    );
  });

  const filePath = path.join(__dirname, "generated_supabase_inserts.sql");
  fs.writeFileSync(filePath, sql.join("\n"));
  console.log(`\n📝 SQL saved → ${filePath}`);
  console.log(`   II Year  (${students.filter(s => s.year === 2).length} rows) → class_id: 8ebafe5d-b312-4b10-93c1-0f0d3a17f524`);
  console.log(`   I Year   (${students.filter(s => s.year === 1).length} rows) → class_id: eb9c650a-2529-430d-a8ea-1ce313caea40`);
  console.log(`   III Year (${students.filter(s => s.year === 3).length} rows) → class_id: b59ab3ce-7b3f-487f-9323-486dc9dd6f9b`);
}

/* ================= RUN ================= */
createUsers().catch(console.error);
