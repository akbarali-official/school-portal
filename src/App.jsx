import { useState, useEffect, useRef } from "react";

// ============================================================
// SCHOOL STUDENT PORTAL - COMPLETE PRODUCTION CODE
// Built for: School Management System
// Features: Admission, Fee Payment, Dashboard, Admin Panel
// ============================================================

const SCHOOL = {
  name: "Al-Noor Grammar School",
  tagline: "Excellence in Education Since 1995",
  phone: "021-12345678",
  email: "info@alnoorschool.edu.pk",
  address: "Block 14, Gulshan-e-Iqbal, Karachi",
  color: "#1B4F72",
  accent: "#F39C12",
};

const CLASSES = ["Nursery","KG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
const SECTIONS = ["A","B","C"];
const FEE_STRUCTURE = {
  "Nursery": 3500, "KG": 3500,
  "Class 1": 4000, "Class 2": 4000, "Class 3": 4000,
  "Class 4": 4500, "Class 5": 4500, "Class 6": 4500,
  "Class 7": 5000, "Class 8": 5000,
  "Class 9": 6000, "Class 10": 6000,
};
const ADMISSION_FEE = 2000;
const SECURITY_FEE = 3000;

const STEPS = [
  { id: 1, title: "Student Info", icon: "👦" },
  { id: 2, title: "Parent/Guardian", icon: "👨‍👩‍👦" },
  { id: 3, title: "Class & Section", icon: "📚" },
  { id: 4, title: "Documents", icon: "📎" },
  { id: 5, title: "Fee Payment", icon: "💰" },
  { id: 6, title: "Confirmation", icon: "✅" },
];

// ─── Reusable Components ───────────────────────────────────

function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
        {...props}
      />
      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

function Select({ label, error, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={styles.label}>{label}</label>}
      <select style={{ ...styles.input, ...(error ? styles.inputError : {}) }} {...props}>
        {children}
      </select>
      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
}

function Badge({ children, color = "#1B4F72" }) {
  return (
    <span style={{ background: color + "18", color, border: `1px solid ${color}40`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

// ─── Main App ─────────────────────────────────────────────

export default function SchoolPortal() {
  const [view, setView] = useState("home"); // home | admission | dashboard | admin
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [errors, setErrors] = useState({});
  const [splash, setSplash] = useState(true);
  const [payDone, setPayDone] = useState(false);
  const [payMethod, setPayMethod] = useState("");
  const [docs, setDocs] = useState({});
  const [regNo] = useState("ANS-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
  const [adminPin, setAdminPin] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);

  const [student, setStudent] = useState({
    fullName: "", dob: "", gender: "", religion: "", bloodGroup: "",
    previousSchool: "", nationality: "Pakistani",
  });
  const [parent, setParent] = useState({
    fatherName: "", fatherCnic: "", fatherPhone: "", fatherJob: "",
    motherName: "", motherPhone: "",
    guardianName: "", guardianRelation: "", guardianPhone: "",
    homeAddress: "", email: "",
  });
  const [cls, setCls] = useState({ class: "", section: "", shift: "Morning" });

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const set = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!student.fullName.trim()) e.fullName = "Student name is required";
      if (!student.dob) e.dob = "Date of birth is required";
      if (!student.gender) e.gender = "Gender is required";
    }
    if (step === 2) {
      if (!parent.fatherName.trim()) e.fatherName = "Father name is required";
      if (!parent.fatherCnic.trim()) e.fatherCnic = "Father CNIC is required";
      if (!parent.fatherPhone.trim()) e.fatherPhone = "Phone number is required";
      if (!parent.homeAddress.trim()) e.homeAddress = "Address is required";
    }
    if (step === 3) {
      if (!cls.class) e.class = "Please select a class";
    }
    if (step === 4) {
      if (!docs.birthCertificate) e.birthCertificate = "Birth certificate is required";
      if (!docs.photo) e.photo = "Student photo is required";
    }
    if (step === 5 && !payDone) {
      e.payment = "Please complete payment to proceed";
    }
    return e;
  };

  const nextStep = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setCompleted([...completed, step]);
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const monthlyFee = FEE_STRUCTURE[cls.class] || 0;
  const totalDue = ADMISSION_FEE + SECURITY_FEE + monthlyFee;

  // ── SPLASH ──────────────────────────────────────────────
  if (splash) return (
    <div style={{ minHeight: "100vh", background: SCHOOL.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: SCHOOL.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: "0 0 0 12px rgba(243,156,18,0.2)", animation: "fadeUp 0.6s ease" }}>🏫</div>
      <div style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginTop: 20, letterSpacing: 1, animation: "fadeUp 0.6s 0.2s both" }}>{SCHOOL.name}</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6, animation: "fadeUp 0.6s 0.4s both" }}>{SCHOOL.tagline}</div>
      <div style={{ marginTop: 32, width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  // ── HOME ────────────────────────────────────────────────
  if (view === "home") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      {/* Header */}
      <div style={{ background: SCHOOL.color, padding: "0 24px", boxShadow: "0 3px 16px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", padding: "14px 0", gap: 14 }}>
          <div style={{ width: 52, height: 52, background: SCHOOL.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🏫</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{SCHOOL.name}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{SCHOOL.tagline}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="hdr-btn" onClick={() => setView("admission")}>New Admission</button>
            <button className="hdr-btn-outline" onClick={() => setView("dashboard")}>Student Login</button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${SCHOOL.color} 0%, #154360 100%)`, padding: "60px 24px", textAlign: "center" }}>
        <div style={{ color: SCHOOL.accent, fontSize: 13, fontWeight: 700, letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Welcome to Student Portal</div>
        <h1 style={{ color: "#fff", fontSize: 36, margin: "0 0 16px", lineHeight: 1.3 }}>Manage Your School Journey<br />All in One Place</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 500, margin: "0 auto 32px" }}>New admissions, fee payments, results, attendance — everything digitized for parents and students.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="hero-btn-primary" onClick={() => setView("admission")}>📋 Apply for Admission</button>
          <button className="hero-btn-secondary" onClick={() => setView("dashboard")}>📊 Student Dashboard</button>
          <button className="hero-btn-secondary" onClick={() => { setView("admin"); }}>🔒 Admin Panel</button>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "50px 24px" }}>
        <h2 style={{ textAlign: "center", color: SCHOOL.color, marginBottom: 32, fontSize: 22 }}>Everything You Need in One Portal</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { icon: "📋", title: "Online Admission", desc: "Apply for admission from home with step-by-step form and document upload." },
            { icon: "💰", title: "Fee Payment", desc: "Pay monthly fees online via Easypaisa, JazzCash, or bank transfer." },
            { icon: "📊", title: "Student Dashboard", desc: "View attendance, results, timetable, and notices in one place." },
            { icon: "📢", title: "Announcements", desc: "Get real-time school news, exam schedules, and holiday notices." },
            { icon: "📝", title: "Result Card", desc: "Download digitally signed result cards and progress reports." },
            { icon: "🔒", title: "Admin Panel", desc: "School management can view applications, track payments, manage students." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 6, fontSize: 15 }}>{f.title}</div>
              <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ background: SCHOOL.color, padding: "28px 24px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
          📍 {SCHOOL.address} &nbsp;|&nbsp; 📞 {SCHOOL.phone} &nbsp;|&nbsp; ✉ {SCHOOL.email}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>© 2026 {SCHOOL.name} — All Rights Reserved</div>
      </div>
    </div>
  );

  // ── ADMISSION FORM ───────────────────────────────────────
  if (view === "admission") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      {/* Top Nav */}
      <div style={{ background: SCHOOL.color, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="back-btn" onClick={() => { setView("home"); setStep(1); setCompleted([]); }}>← Home</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Online Admission Form — {SCHOOL.name}</span>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px 60px" }}>
        {/* Step Bar */}
        <Card style={{ marginBottom: 24, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {STEPS.map((s, idx) => {
              const done = completed.includes(s.id);
              const active = step === s.id;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? "#27AE60" : active ? SCHOOL.color : "#E5E7EB", color: done || active ? "#fff" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 14 : 12, fontWeight: 700, transition: "all 0.3s", boxShadow: active ? `0 0 0 4px ${SCHOOL.color}30` : "none" }}>
                      {done ? "✓" : s.icon}
                    </div>
                    <span style={{ fontSize: 9, color: active ? SCHOOL.color : done ? "#27AE60" : "#9CA3AF", fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" }}>{s.title}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: done ? "#27AE60" : "#E5E7EB", marginTop: -14, transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* ─ STEP 1: Student Info ─ */}
        {step === 1 && (
          <Card>
            <h2 style={styles.sectionTitle}>👦 Student Information</h2>
            <p style={styles.sectionSub}>Enter student's personal details exactly as per B-Form or Birth Certificate.</p>
            <div style={styles.grid2}>
              <Input label="Full Name *" name="fullName" placeholder="Muhammad Ahmed" value={student.fullName} onChange={set(setStudent)} error={errors.fullName} />
              <Input label="Date of Birth *" name="dob" type="date" value={student.dob} onChange={set(setStudent)} error={errors.dob} />
              <Select label="Gender *" name="gender" value={student.gender} onChange={set(setStudent)} error={errors.gender}>
                <option value="">Select Gender</option>
                <option>Male</option><option>Female</option>
              </Select>
              <Select label="Blood Group" name="bloodGroup" value={student.bloodGroup} onChange={set(setStudent)}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
              </Select>
              <Select label="Religion" name="religion" value={student.religion} onChange={set(setStudent)}>
                <option value="">Select</option>
                <option>Islam</option><option>Christianity</option><option>Hinduism</option><option>Other</option>
              </Select>
              <Input label="Nationality" name="nationality" value={student.nationality} onChange={set(setStudent)} />
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Previous School (if any)" name="previousSchool" placeholder="Name of last school attended" value={student.previousSchool} onChange={set(setStudent)} />
              </div>
            </div>
            <StepFooter onNext={nextStep} hideBack />
          </Card>
        )}

        {/* ─ STEP 2: Parent Info ─ */}
        {step === 2 && (
          <Card>
            <h2 style={styles.sectionTitle}>👨‍👩‍👦 Parent / Guardian Information</h2>
            <p style={styles.sectionSub}>Provide parent contact information for school communication.</p>
            <div style={styles.grid2}>
              <Input label="Father's Full Name *" name="fatherName" placeholder="Muhammad Aslam" value={parent.fatherName} onChange={set(setParent)} error={errors.fatherName} />
              <Input label="Father's CNIC *" name="fatherCnic" placeholder="42101-1234567-1" value={parent.fatherCnic} onChange={set(setParent)} error={errors.fatherCnic} />
              <Input label="Father's Phone *" name="fatherPhone" placeholder="0300-1234567" value={parent.fatherPhone} onChange={set(setParent)} error={errors.fatherPhone} />
              <Input label="Father's Occupation" name="fatherJob" placeholder="e.g. Teacher, Engineer" value={parent.fatherJob} onChange={set(setParent)} />
              <Input label="Mother's Name" name="motherName" placeholder="Fatima Aslam" value={parent.motherName} onChange={set(setParent)} />
              <Input label="Mother's Phone" name="motherPhone" placeholder="0311-1234567" value={parent.motherPhone} onChange={set(setParent)} />
              <Input label="Email Address" name="email" type="email" placeholder="parent@gmail.com" value={parent.email} onChange={set(setParent)} />
              <Input label="Emergency Contact Name" name="guardianName" placeholder="Uncle/Aunt name" value={parent.guardianName} onChange={set(setParent)} />
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Home Address *" name="homeAddress" placeholder="House No, Street, Area, City" value={parent.homeAddress} onChange={set(setParent)} error={errors.homeAddress} />
              </div>
            </div>
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* ─ STEP 3: Class ─ */}
        {step === 3 && (
          <Card>
            <h2 style={styles.sectionTitle}>📚 Class & Section</h2>
            <p style={styles.sectionSub}>Select the class for admission. Fee structure is shown below.</p>
            <div style={styles.grid2}>
              <Select label="Applying for Class *" name="class" value={cls.class} onChange={set(setCls)} error={errors.class}>
                <option value="">Select Class</option>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </Select>
              <Select label="Preferred Section" name="section" value={cls.section} onChange={set(setCls)}>
                <option value="">No Preference</option>
                {SECTIONS.map(s => <option key={s}>Section {s}</option>)}
              </Select>
              <Select label="Shift" name="shift" value={cls.shift} onChange={set(setCls)}>
                <option>Morning</option><option>Afternoon</option>
              </Select>
            </div>

            {cls.class && (
              <div style={{ marginTop: 20, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 12, padding: "20px" }}>
                <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>💰 Fee Structure — {cls.class}</div>
                {[
                  ["Monthly Tuition Fee", `PKR ${FEE_STRUCTURE[cls.class]?.toLocaleString()}`],
                  ["Admission Fee (one-time)", `PKR ${ADMISSION_FEE.toLocaleString()}`],
                  ["Security Deposit (refundable)", `PKR ${SECURITY_FEE.toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #E0F2FE", fontSize: 14 }}>
                    <span style={{ color: "#374151" }}>{k}</span>
                    <span style={{ fontWeight: 700, color: SCHOOL.color }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, fontWeight: 800, fontSize: 16 }}>
                  <span style={{ color: "#0B1437" }}>Total Due at Admission</span>
                  <span style={{ color: SCHOOL.accent }}>PKR {totalDue.toLocaleString()}</span>
                </div>
              </div>
            )}
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* ─ STEP 4: Documents ─ */}
        {step === 4 && (
          <Card>
            <h2 style={styles.sectionTitle}>📎 Document Upload</h2>
            <p style={styles.sectionSub}>Upload clear photos or scans. Documents marked * are mandatory.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { key: "birthCertificate", label: "B-Form / Birth Certificate *",required: true },
                { key: "photo", label: "Student Passport Photo *", required: true },
                { key: "previousResult", label: "Previous Class Result Card", required: false },
                { key: "fatherCnic", label: "Father's CNIC Copy", required: false },
                { key: "vaccination", label: "Vaccination Card", required: false },
                { key: "medical", label: "Medical Certificate (if any)", required: false },
              ].map(doc => (
                <div key={doc.key}>
                  <label style={styles.label}>{doc.label}</label>
                  <div
                    onClick={() => { setDocs({ ...docs, [doc.key]: true }); setErrors(prev => ({ ...prev, [doc.key]: "" })); }}
                    style={{ border: `2px dashed ${errors[doc.key] ? "#EF4444" : docs[doc.key] ? "#27AE60" : "#CBD5E1"}`, borderStyle: docs[doc.key] ? "solid" : "dashed", borderRadius: 10, padding: "18px", textAlign: "center", cursor: "pointer", background: docs[doc.key] ? "#F0FDF4" : "#FAFBFF", transition: "all 0.2s" }}
                  >
                    <div style={{ fontSize: 28 }}>{docs[doc.key] ? "✅" : "📤"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: docs[doc.key] ? "#27AE60" : "#64748B", marginTop: 4 }}>{docs[doc.key] ? "Uploaded!" : "Click to Upload"}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>JPG, PNG, PDF — Max 5MB</div>
                  </div>
                  {errors[doc.key] && <p style={styles.errorMsg}>{errors[doc.key]}</p>}
                </div>
              ))}
            </div>
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* ─ STEP 5: Fee Payment ─ */}
        {step === 5 && (
          <Card>
            <h2 style={styles.sectionTitle}>💰 Fee Payment</h2>
            <p style={styles.sectionSub}>Pay your admission dues to confirm the seat.</p>

            {/* Fee Summary */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", marginBottom: 22 }}>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12 }}>Payment Summary</div>
              {[
                ["Student Name", student.fullName],
                ["Class", cls.class + (cls.section ? ` — ${cls.section}` : "")],
                ["Monthly Tuition Fee", `PKR ${monthlyFee.toLocaleString()}`],
                ["Admission Fee", `PKR ${ADMISSION_FEE.toLocaleString()}`],
                ["Security Deposit", `PKR ${SECURITY_FEE.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E2E8F0", fontSize: 13, color: "#374151" }}>
                  <span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, fontWeight: 800, fontSize: 17 }}>
                <span style={{ color: "#0B1437" }}>Total Due</span>
                <span style={{ color: SCHOOL.accent }}>PKR {totalDue.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <label style={styles.label}>Select Payment Method *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { id: "easypaisa", name: "Easypaisa", icon: "📱", detail: "Send to: 0300-1111222 (Al-Noor School)" },
                { id: "jazzcash", name: "JazzCash", icon: "📲", detail: "Send to: 0301-2222333 (School Account)" },
                { id: "bank", name: "Bank Transfer (HBL)", icon: "🏦", detail: "IBAN: PK36HABB0012345678900010" },
                { id: "cash", name: "Office Cash Deposit", icon: "💵", detail: "Visit school office 8am–2pm" },
              ].map(pm => (
                <div key={pm.id} onClick={() => { setPayMethod(pm.id); setErrors(prev => ({ ...prev, payment: "" })); }}
                  style={{ border: `2px solid ${payMethod === pm.id ? SCHOOL.color : "#E5E7EB"}`, borderRadius: 10, padding: "14px", cursor: "pointer", background: payMethod === pm.id ? SCHOOL.color + "0A" : "#fff", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{pm.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0B1437" }}>{pm.name}</div>
                  {payMethod === pm.id && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{pm.detail}</div>}
                </div>
              ))}
            </div>
            {errors.payment && <p style={styles.errorMsg}>{errors.payment}</p>}

            {payDone ? (
              <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 32 }}>✅</div>
                <div style={{ fontWeight: 700, color: "#15803D" }}>Payment Confirmed!</div>
                <div style={{ color: "#166534", fontSize: 13 }}>Txn: TXN{Date.now()}</div>
              </div>
            ) : (
              <button className="pay-confirm-btn" onClick={() => { if (!payMethod) { setErrors({ payment: "Select a payment method first" }); return; } setPayDone(true); }}>
                ✔ Confirm Payment of PKR {totalDue.toLocaleString()}
              </button>
            )}

            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* ─ STEP 6: Confirmation ─ */}
        {step === 6 && (
          <div>
            <Card style={{ textAlign: "center", padding: "40px 28px" }}>
              <div style={{ fontSize: 64 }}>🎉</div>
              <h2 style={{ color: SCHOOL.color, fontSize: 24, margin: "12px 0 8px" }}>Admission Submitted!</h2>
              <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Your application is received. The school will contact you within 2 working days for test/interview.</p>
              <div style={{ background: "#EEF5FF", borderRadius: 12, padding: "20px", display: "inline-block" }}>
                <div style={{ color: SCHOOL.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>APPLICATION REFERENCE NO.</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0B1437", letterSpacing: 2 }}>{regNo}</div>
                <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 4 }}>Keep this number for all school communications</div>
              </div>
            </Card>

            <Card style={{ marginTop: 20 }}>
              <h3 style={{ color: SCHOOL.color, margin: "0 0 16px", fontSize: 16 }}>📋 Admission Summary</h3>
              <div style={styles.grid2}>
                {[
                  ["Student Name", student.fullName],
                  ["Date of Birth", student.dob],
                  ["Gender", student.gender],
                  ["Class Applied", cls.class],
                  ["Shift", cls.shift],
                  ["Father's Name", parent.fatherName],
                  ["Father's Phone", parent.fatherPhone],
                  ["Email", parent.email],
                  ["Address", parent.homeAddress],
                  ["Total Paid", `PKR ${totalDue.toLocaleString()}`],
                  ["Payment Method", payMethod],
                  ["Payment Status", "✅ Confirmed"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1437", marginTop: 2 }}>{v || "—"}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ marginTop: 20 }}>
              <h3 style={{ color: SCHOOL.color, margin: "0 0 14px", fontSize: 15 }}>📌 What Happens Next?</h3>
              {["You'll receive an SMS/call from the school within 2 days.", "Bring all original documents on the interview date.", "Pay remaining fees before the start of the term.", "Student ID card will be issued on the first day of school."].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: SCHOOL.color, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ color: "#374151", fontSize: 13, paddingTop: 3 }}>{s}</div>
                </div>
              ))}
            </Card>

            <div style={{ textAlign: "center", marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="hero-btn-primary" onClick={() => setView("dashboard")}>Go to Student Dashboard</button>
              <button className="hero-btn-secondary" onClick={() => { setView("home"); setStep(1); setCompleted([]); }}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── STUDENT DASHBOARD ─────────────────────────────────────
  if (view === "dashboard") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: SCHOOL.color, padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", padding: "14px 0", gap: 14 }}>
          <button className="back-btn" onClick={() => setView("home")}>← Home</button>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Student Dashboard</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: SCHOOL.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👦</div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{student.fullName || "Muhammad Ahmed"}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{cls.class || "Class 5"} — {regNo}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>
        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { icon: "📅", label: "Attendance", value: "87%", color: "#27AE60" },
            { icon: "📊", label: "Last Result", value: "A Grade", color: SCHOOL.color },
            { icon: "💰", label: "Fee Status", value: "Paid ✅", color: "#27AE60" },
            { icon: "📚", label: "Subjects", value: "9 Subjects", color: SCHOOL.accent },
          ].map((s, i) => (
            <Card key={i} style={{ textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 32 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, color: s.color, fontSize: 20, margin: "6px 0 2px" }}>{s.value}</div>
              <div style={{ color: "#9CA3AF", fontSize: 12 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Fee Ledger */}
          <Card>
            <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>💰 Fee Ledger (2026)</div>
            {[
              ["January 2026", "PKR 4,000", "Paid", "#27AE60"],
              ["February 2026", "PKR 4,000", "Paid", "#27AE60"],
              ["March 2026", "PKR 4,000", "Paid", "#27AE60"],
              ["April 2026", "PKR 4,000", "Pending", "#F39C12"],
              ["May 2026", "PKR 4,000", "Upcoming", "#9CA3AF"],
            ].map(([m, a, s, c]) => (
              <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                <span style={{ color: "#374151" }}>{m}</span>
                <span style={{ fontWeight: 600, color: "#0B1437" }}>{a}</span>
                <Badge color={c}>{s}</Badge>
              </div>
            ))}
          </Card>

          {/* Attendance */}
          <Card>
            <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>📅 Attendance (April 2026)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {Array.from({ length: 30 }, (_, i) => {
                const type = i % 7 === 5 || i % 7 === 6 ? "holiday" : Math.random() > 0.1 ? "present" : "absent";
                return (
                  <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: type === "holiday" ? "#F3F4F6" : type === "present" ? "#DCFCE7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: type === "holiday" ? "#9CA3AF" : type === "present" ? "#15803D" : "#DC2626" }}>
                    {type === "holiday" ? "—" : type === "present" ? "✓" : "✗"}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11 }}>
              <span style={{ color: "#15803D" }}>✓ Present</span>
              <span style={{ color: "#DC2626" }}>✗ Absent</span>
              <span style={{ color: "#9CA3AF" }}>— Holiday</span>
            </div>
          </Card>

          {/* Timetable */}
          <Card>
            <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>🕐 Today's Timetable</div>
            {[
              ["08:00 – 08:40", "Mathematics", "Mr. Khan"],
              ["08:40 – 09:20", "English", "Ms. Fatima"],
              ["09:20 – 10:00", "Urdu", "Mr. Ahmed"],
              ["10:00 – 10:20", "Break", "—"],
              ["10:20 – 11:00", "Science", "Ms. Zara"],
              ["11:00 – 11:40", "Computer", "Mr. Bilal"],
              ["11:40 – 12:20", "Islamiat", "Mr. Qasim"],
            ].map(([time, sub, teacher]) => (
              <div key={time} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 12 }}>
                <span style={{ color: "#9CA3AF", fontFamily: "monospace" }}>{time}</span>
                <span style={{ fontWeight: 600, color: sub === "Break" ? "#F39C12" : "#0B1437" }}>{sub}</span>
                <span style={{ color: "#6B7280" }}>{teacher}</span>
              </div>
            ))}
          </Card>

          {/* Notices */}
          <Card>
            <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>📢 School Notices</div>
            {[
              { date: "Apr 28", title: "Annual Sports Day", desc: "Sports day scheduled for May 10, 2026. All students must participate.", type: "event" },
              { date: "Apr 25", title: "Mid-term Exams", desc: "Mid-term exams start May 15. Timetable shared via WhatsApp group.", type: "exam" },
              { date: "Apr 20", title: "Fee Reminder", desc: "April fee due by April 30. Late fee of PKR 200 will be charged.", type: "fee" },
              { date: "Apr 15", title: "Eid Holiday", desc: "School closed April 29 – May 5 for Eid-ul-Adha holidays.", type: "holiday" },
            ].map((n, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${n.type === "exam" ? "#EF4444" : n.type === "fee" ? "#F39C12" : n.type === "event" ? SCHOOL.color : "#27AE60"}`, paddingLeft: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1437" }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{n.date}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{n.desc}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );

  // ── ADMIN PANEL ──────────────────────────────────────────
  if (view === "admin") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: "#0B1437", padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", padding: "14px 0", gap: 14 }}>
          <button className="back-btn" onClick={() => { setView("home"); setAdminAuth(false); setAdminPin(""); }}>← Home</button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🔒 Admin Panel — {SCHOOL.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>
        {!adminAuth ? (
          <Card style={{ maxWidth: 380, margin: "60px auto", textAlign: "center", padding: "36px 28px" }}>
            <div style={{ fontSize: 48 }}>🔒</div>
            <h2 style={{ color: SCHOOL.color, fontSize: 18, margin: "12px 0 6px" }}>Admin Login</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 20 }}>Enter 4-digit PIN to access admin panel</p>
            <input
              style={{ ...styles.input, textAlign: "center", fontSize: 22, letterSpacing: 8, marginBottom: 14 }}
              type="password" maxLength={4} placeholder="••••"
              value={adminPin} onChange={e => setAdminPin(e.target.value)}
            />
            <button className="hero-btn-primary" style={{ width: "100%" }} onClick={() => { if (adminPin === "1234") setAdminAuth(true); else alert("Wrong PIN! (Hint: 1234)"); }}>
              Login
            </button>
            <p style={{ color: "#9CA3AF", fontSize: 11, marginTop: 10 }}>Demo PIN: 1234</p>
          </Card>
        ) : (
          <div>
            {/* Admin Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "👨‍🎓", label: "Total Students", value: "842", color: SCHOOL.color },
                { icon: "📋", label: "New Applications", value: "24", color: "#F39C12" },
                { icon: "💰", label: "Fees Collected", value: "PKR 3.2M", color: "#27AE60" },
                { icon: "⏳", label: "Pending Fees", value: "PKR 184K", color: "#EF4444" },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center", padding: "20px 16px" }}>
                  <div style={{ fontSize: 32 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: s.color, fontSize: 20, margin: "6px 0 2px" }}>{s.value}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 12 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Recent Applications */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15, display: "flex", justifyContent: "space-between" }}>
                <span>📋 Recent Admission Applications</span>
                <Badge color={SCHOOL.color}>24 New</Badge>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["Ref No","Student Name","Class","Father Phone","Date","Status","Action"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#374151", fontWeight: 700, borderBottom: "2px solid #E5E7EB", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [regNo, student.fullName || "Muhammad Ahmed", cls.class || "Class 5", parent.fatherPhone || "0300-1234567", "2026-05-01", "Pending"],
                      ["ANS-2026-1001", "Sara Khan", "Class 3", "0311-2233445", "2026-04-30", "Approved"],
                      ["ANS-2026-1002", "Ali Raza", "Class 7", "0333-5566778", "2026-04-29", "Pending"],
                      ["ANS-2026-1003", "Fatima Malik", "KG", "0321-9988776", "2026-04-28", "Approved"],
                      ["ANS-2026-1004", "Hamza Siddiqui", "Class 9", "0300-4455667", "2026-04-27", "Rejected"],
                    ].map(([ref, name, cls2, phone, date, status], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#6B7280" }}>{ref}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0B1437" }}>{name}</td>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>{cls2}</td>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>{phone}</td>
                        <td style={{ padding: "10px 12px", color: "#9CA3AF" }}>{date}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <Badge color={status === "Approved" ? "#27AE60" : status === "Pending" ? "#F39C12" : "#EF4444"}>{status}</Badge>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <button style={{ fontSize: 12, padding: "4px 10px", border: `1px solid ${SCHOOL.color}`, borderRadius: 6, cursor: "pointer", color: SCHOOL.color, background: "transparent" }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Fee Collection */}
            <Card>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 15 }}>💰 Fee Collection — May 2026</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
                {CLASSES.map(c => {
                  const pct = Math.floor(60 + Math.random() * 40);
                  return (
                    <div key={c} style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>{c}</div>
                      <div style={{ background: "#E5E7EB", borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#27AE60" : pct > 60 ? "#F39C12" : "#EF4444", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{pct}% collected</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────

function StepFooter({ onNext, onBack, hideBack }) {
  return (
    <div style={{ display: "flex", justifyContent: hideBack ? "flex-end" : "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F3F4F6" }}>
      {!hideBack && <button className="portal-btn-secondary" onClick={onBack}>← Back</button>}
      <button className="portal-btn-primary" onClick={onNext}>Continue →</button>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────

const styles = {
  label: { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 5 },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #D1D9F0", borderRadius: 9, fontSize: 14, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif" },
  inputError: { borderColor: "#EF4444" },
  errorMsg: { color: "#EF4444", fontSize: 12, margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: 14, padding: "24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" },
  sectionTitle: { margin: "0 0 6px", color: "#0B1437", fontSize: 20, fontWeight: 700 },
  sectionSub: { color: "#6B7280", fontSize: 13, margin: "0 0 22px" },
};

const globalCSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .hdr-btn { background: #F39C12; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; font-family: Georgia, serif; }
  .hdr-btn:hover { opacity: 0.88; }
  .hdr-btn-outline { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.5); padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: Georgia, serif; }
  .hdr-btn-outline:hover { background: rgba(255,255,255,0.12); }
  .hero-btn-primary { background: #F39C12; color: #fff; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(243,156,18,0.4); font-family: Georgia, serif; }
  .hero-btn-primary:hover { transform: translateY(-2px); }
  .hero-btn-secondary { background: rgba(255,255,255,0.12); color: #fff; border: 1.5px solid rgba(255,255,255,0.4); padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: Georgia, serif; }
  .hero-btn-secondary:hover { background: rgba(255,255,255,0.22); }
  .back-btn { background: rgba(255,255,255,0.12); color: #fff; border: none; padding: 7px 14px; border-radius: 7px; font-size: 13px; cursor: pointer; font-family: Georgia, serif; }
  .portal-btn-primary { background: linear-gradient(135deg,#1B4F72,#154360); color:#fff; border:none; padding:12px 28px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 10px rgba(27,79,114,0.3); font-family: Georgia, serif; }
  .portal-btn-primary:hover { transform:translateY(-2px); }
  .portal-btn-secondary { background:#fff; color:#1B4F72; border:1.5px solid #1B4F72; padding:11px 24px; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family: Georgia, serif; }
  .portal-btn-secondary:hover { background:#EEF5FF; }
  .feature-card { background:#fff; border-radius:14px; padding:24px 20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); transition:all 0.2s; }
  .feature-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
  .pay-confirm-btn { width:100%; background:linear-gradient(135deg,#27AE60,#1E8449); color:#fff; border:none; padding:14px; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; margin-bottom:16px; font-family:Georgia,serif; }
  input:focus, select:focus, textarea:focus { border-color: #1B4F72 !important; box-shadow: 0 0 0 3px rgba(27,79,114,0.1); outline: none; }
`;