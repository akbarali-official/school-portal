import { useState, useEffect } from "react";

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
  { id: 1, title: "Student", icon: "👦" },
  { id: 2, title: "Parent", icon: "👨‍👩‍👦" },
  { id: 3, title: "Class", icon: "📚" },
  { id: 4, title: "Docs", icon: "📎" },
  { id: 5, title: "Fee", icon: "💰" },
  { id: 6, title: "Done", icon: "✅" },
];

function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={styles.label}>{label}</label>}
      <input style={{ ...styles.input, ...(error ? styles.inputError : {}) }} {...props} />
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
    <span style={{ background: color + "18", color, border: `1px solid ${color}40`, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function StepFooter({ onNext, onBack, hideBack }) {
  return (
    <div style={{ display: "flex", justifyContent: hideBack ? "flex-end" : "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid #F3F4F6", gap: 10 }}>
      {!hideBack && (
        <button className="portal-btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
      )}
      <button className="portal-btn-primary" onClick={onNext} style={{ flex: 2 }}>Continue →</button>
    </div>
  );
}

export default function SchoolPortal() {
  const [view, setView] = useState("home");
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
  const [menuOpen, setMenuOpen] = useState(false);

  const [student, setStudent] = useState({
    fullName: "", dob: "", gender: "", religion: "", bloodGroup: "",
    previousSchool: "", nationality: "Pakistani",
  });
  const [parent, setParent] = useState({
    fatherName: "", fatherCnic: "", fatherPhone: "", fatherJob: "",
    motherName: "", motherPhone: "", guardianName: "",
    homeAddress: "", email: "",
  });
  const [cls, setCls] = useState({ class: "", section: "", shift: "Morning" });

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const setField = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!student.fullName.trim()) e.fullName = "Student name is required";
      if (!student.dob) e.dob = "Date of birth is required";
      if (!student.gender) e.gender = "Gender is required";
    }
    if (step === 2) {
      if (!parent.fatherName.trim()) e.fatherName = "Father name required";
      if (!parent.fatherCnic.trim()) e.fatherCnic = "CNIC required";
      if (!parent.fatherPhone.trim()) e.fatherPhone = "Phone required";
      if (!parent.homeAddress.trim()) e.homeAddress = "Address required";
    }
    if (step === 3) {
      if (!cls.class) e.class = "Please select a class";
    }
    if (step === 4) {
      if (!docs.birthCertificate) e.birthCertificate = "Required";
      if (!docs.photo) e.photo = "Required";
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

  const resetAll = () => {
    setView("home"); setStep(1); setCompleted([]); setErrors({});
    setPayDone(false); setPayMethod(""); setDocs({});
    setStudent({ fullName: "", dob: "", gender: "", religion: "", bloodGroup: "", previousSchool: "", nationality: "Pakistani" });
    setParent({ fatherName: "", fatherCnic: "", fatherPhone: "", fatherJob: "", motherName: "", motherPhone: "", guardianName: "", homeAddress: "", email: "" });
    setCls({ class: "", section: "", shift: "Morning" });
  };

  // SPLASH
  if (splash) return (
    <div style={{ minHeight: "100vh", background: SCHOOL.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: 20 }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: SCHOOL.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 0 12px rgba(243,156,18,0.2)", animation: "fadeUp 0.6s ease" }}>🏫</div>
      <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 18, animation: "fadeUp 0.6s 0.2s both", textAlign: "center" }}>{SCHOOL.name}</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6, animation: "fadeUp 0.6s 0.4s both", textAlign: "center" }}>{SCHOOL.tagline}</div>
      <div style={{ marginTop: 32, width: 36, height: 36, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  // HOME
  if (view === "home") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: SCHOOL.color, padding: "0 16px", boxShadow: "0 3px 16px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", padding: "12px 0", gap: 12 }}>
          <div style={{ width: 42, height: 42, background: SCHOOL.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏫</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{SCHOOL.name}</div>
          </div>
          <div className="desktop-nav">
            <button className="hdr-btn" onClick={() => setView("admission")}>New Admission</button>
            <button className="hdr-btn-outline" onClick={() => setView("dashboard")}>Dashboard</button>
            <button className="hdr-btn-outline" onClick={() => setView("admin")}>Admin</button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => { setView("admission"); setMenuOpen(false); }}>📋 New Admission</button>
            <button onClick={() => { setView("dashboard"); setMenuOpen(false); }}>📊 Student Dashboard</button>
            <button onClick={() => { setView("admin"); setMenuOpen(false); }}>🔒 Admin Panel</button>
          </div>
        )}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${SCHOOL.color} 0%, #154360 100%)`, padding: "48px 16px", textAlign: "center" }}>
        <div style={{ color: SCHOOL.accent, fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>Student Portal</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(20px, 5vw, 34px)", margin: "0 0 14px", lineHeight: 1.3 }}>Manage Your School Journey<br />All in One Place</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>Online admissions, fee payments, results, attendance — all digitized.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="hero-btn-primary" onClick={() => setView("admission")}>📋 Apply Now</button>
          <button className="hero-btn-secondary" onClick={() => setView("dashboard")}>📊 Dashboard</button>
          <button className="hero-btn-secondary" onClick={() => setView("admin")}>🔒 Admin</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 16px" }}>
        <h2 style={{ textAlign: "center", color: SCHOOL.color, marginBottom: 22, fontSize: 19 }}>Everything You Need</h2>
        <div className="feature-grid">
          {[
            { icon: "📋", title: "Online Admission", desc: "Apply from home step-by-step." },
            { icon: "💰", title: "Fee Payment", desc: "Easypaisa, JazzCash, or bank." },
            { icon: "📊", title: "Dashboard", desc: "Attendance, results, timetable." },
            { icon: "📢", title: "Notices", desc: "Real-time school announcements." },
            { icon: "📝", title: "Result Cards", desc: "Download digital results." },
            { icon: "🔒", title: "Admin Panel", desc: "Manage applications & fees." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 30, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 4, fontSize: 13 }}>{f.title}</div>
              <div style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: SCHOOL.color, padding: "20px 16px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 2 }}>
          📍 {SCHOOL.address}<br />📞 {SCHOOL.phone} &nbsp;·&nbsp; ✉ {SCHOOL.email}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 8 }}>© 2026 {SCHOOL.name}</div>
      </div>
    </div>
  );

  // ADMISSION
  if (view === "admission") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: SCHOOL.color, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <button className="back-btn" onClick={resetAll}>← Home</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admission — {SCHOOL.name}</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "18px 12px 60px" }}>
        {/* Step Bar */}
        <Card style={{ marginBottom: 18, padding: "14px 10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {STEPS.map((s, idx) => {
              const done = completed.includes(s.id);
              const active = step === s.id;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? "#27AE60" : active ? SCHOOL.color : "#E5E7EB", color: done || active ? "#fff" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, transition: "all 0.3s", boxShadow: active ? `0 0 0 3px ${SCHOOL.color}30` : "none" }}>
                      {done ? "✓" : s.icon}
                    </div>
                    <span style={{ fontSize: 8, color: active ? SCHOOL.color : done ? "#27AE60" : "#9CA3AF", fontWeight: 600, textAlign: "center" }}>{s.title}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: done ? "#27AE60" : "#E5E7EB", marginTop: -12, transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* STEP 1 */}
        {step === 1 && (
          <Card>
            <h2 style={styles.sectionTitle}>👦 Student Information</h2>
            <p style={styles.sectionSub}>Enter details as per B-Form or Birth Certificate.</p>
            <Input label="Full Name *" name="fullName" placeholder="Muhammad Ahmed" value={student.fullName} onChange={setField(setStudent)} error={errors.fullName} />
            <Input label="Date of Birth *" name="dob" type="date" value={student.dob} onChange={setField(setStudent)} error={errors.dob} />
            <div className="grid2">
              <Select label="Gender *" name="gender" value={student.gender} onChange={setField(setStudent)} error={errors.gender}>
                <option value="">Select Gender</option>
                <option>Male</option><option>Female</option>
              </Select>
              <Select label="Blood Group" name="bloodGroup" value={student.bloodGroup} onChange={setField(setStudent)}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
              </Select>
            </div>
            <div className="grid2">
              <Select label="Religion" name="religion" value={student.religion} onChange={setField(setStudent)}>
                <option value="">Select</option>
                <option>Islam</option><option>Christianity</option><option>Hinduism</option><option>Other</option>
              </Select>
              <Input label="Nationality" name="nationality" value={student.nationality} onChange={setField(setStudent)} />
            </div>
            <Input label="Previous School (if any)" name="previousSchool" placeholder="Last school attended" value={student.previousSchool} onChange={setField(setStudent)} />
            <StepFooter onNext={nextStep} hideBack />
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card>
            <h2 style={styles.sectionTitle}>👨‍👩‍👦 Parent / Guardian</h2>
            <p style={styles.sectionSub}>Contact info for school communication.</p>
            <Input label="Father's Full Name *" name="fatherName" placeholder="Muhammad Aslam" value={parent.fatherName} onChange={setField(setParent)} error={errors.fatherName} />
            <Input label="Father's CNIC *" name="fatherCnic" placeholder="42101-1234567-1" value={parent.fatherCnic} onChange={setField(setParent)} error={errors.fatherCnic} />
            <div className="grid2">
              <Input label="Father's Phone *" name="fatherPhone" placeholder="0300-1234567" value={parent.fatherPhone} onChange={setField(setParent)} error={errors.fatherPhone} />
              <Input label="Father's Occupation" name="fatherJob" placeholder="e.g. Teacher" value={parent.fatherJob} onChange={setField(setParent)} />
            </div>
            <div className="grid2">
              <Input label="Mother's Name" name="motherName" placeholder="Fatima Aslam" value={parent.motherName} onChange={setField(setParent)} />
              <Input label="Mother's Phone" name="motherPhone" placeholder="0311-1234567" value={parent.motherPhone} onChange={setField(setParent)} />
            </div>
            <Input label="Email Address" name="email" type="email" placeholder="parent@gmail.com" value={parent.email} onChange={setField(setParent)} />
            <Input label="Home Address *" name="homeAddress" placeholder="House No, Street, Area, City" value={parent.homeAddress} onChange={setField(setParent)} error={errors.homeAddress} />
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Card>
            <h2 style={styles.sectionTitle}>📚 Class & Section</h2>
            <p style={styles.sectionSub}>Select the class for admission.</p>
            <Select label="Applying for Class *" name="class" value={cls.class} onChange={setField(setCls)} error={errors.class}>
              <option value="">Select Class</option>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <div className="grid2">
              <Select label="Preferred Section" name="section" value={cls.section} onChange={setField(setCls)}>
                <option value="">No Preference</option>
                {SECTIONS.map(s => <option key={s}>Section {s}</option>)}
              </Select>
              <Select label="Shift" name="shift" value={cls.shift} onChange={setField(setCls)}>
                <option>Morning</option><option>Afternoon</option>
              </Select>
            </div>
            {cls.class && (
              <div style={{ marginTop: 14, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 10, fontSize: 13 }}>💰 Fee Structure — {cls.class}</div>
                {[
                  ["Monthly Tuition Fee", `PKR ${FEE_STRUCTURE[cls.class]?.toLocaleString()}`],
                  ["Admission Fee (one-time)", `PKR ${ADMISSION_FEE.toLocaleString()}`],
                  ["Security Deposit (refundable)", `PKR ${SECURITY_FEE.toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E0F2FE", fontSize: 13, gap: 8 }}>
                    <span style={{ color: "#374151" }}>{k}</span>
                    <span style={{ fontWeight: 700, color: SCHOOL.color, whiteSpace: "nowrap" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, fontWeight: 800, fontSize: 15 }}>
                  <span>Total Due</span>
                  <span style={{ color: SCHOOL.accent }}>PKR {totalDue.toLocaleString()}</span>
                </div>
              </div>
            )}
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <Card>
            <h2 style={styles.sectionTitle}>📎 Upload Documents</h2>
            <p style={styles.sectionSub}>Documents marked * are mandatory.</p>
            <div className="doc-grid">
              {[
                { key: "birthCertificate", label: "B-Form / Birth Cert *" },
                { key: "photo", label: "Student Photo *" },
                { key: "previousResult", label: "Previous Result" },
                { key: "fatherCnic", label: "Father's CNIC" },
                { key: "vaccination", label: "Vaccination Card" },
                { key: "medical", label: "Medical Certificate" },
              ].map(doc => (
                <div key={doc.key}>
                  <label style={{ ...styles.label, fontSize: 12 }}>{doc.label}</label>
                  <div
                    onClick={() => { setDocs({ ...docs, [doc.key]: true }); setErrors(prev => ({ ...prev, [doc.key]: "" })); }}
                    style={{ border: `2px dashed ${errors[doc.key] ? "#EF4444" : docs[doc.key] ? "#27AE60" : "#CBD5E1"}`, borderStyle: docs[doc.key] ? "solid" : "dashed", borderRadius: 10, padding: "14px 8px", textAlign: "center", cursor: "pointer", background: docs[doc.key] ? "#F0FDF4" : "#FAFBFF" }}
                  >
                    <div style={{ fontSize: 22 }}>{docs[doc.key] ? "✅" : "📤"}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: docs[doc.key] ? "#27AE60" : "#64748B", marginTop: 3 }}>{docs[doc.key] ? "Uploaded!" : "Tap to Upload"}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>JPG, PNG, PDF</div>
                  </div>
                  {errors[doc.key] && <p style={styles.errorMsg}>{errors[doc.key]}</p>}
                </div>
              ))}
            </div>
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <Card>
            <h2 style={styles.sectionTitle}>💰 Fee Payment</h2>
            <p style={styles.sectionSub}>Pay admission dues to confirm your seat.</p>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 10, fontSize: 13 }}>Payment Summary</div>
              {[
                ["Student", student.fullName || "—"],
                ["Class", cls.class || "—"],
                ["Monthly Fee", `PKR ${monthlyFee.toLocaleString()}`],
                ["Admission Fee", `PKR ${ADMISSION_FEE.toLocaleString()}`],
                ["Security Deposit", `PKR ${SECURITY_FEE.toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E2E8F0", fontSize: 13, gap: 8 }}>
                  <span style={{ color: "#6B7280" }}>{k}</span>
                  <span style={{ fontWeight: 600, color: "#0B1437", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, fontWeight: 800, fontSize: 16 }}>
                <span>Total Due</span>
                <span style={{ color: SCHOOL.accent }}>PKR {totalDue.toLocaleString()}</span>
              </div>
            </div>

            <label style={styles.label}>Select Payment Method *</label>
            <div className="pay-grid">
              {[
                { id: "easypaisa", name: "Easypaisa", icon: "📱", detail: "0300-1111222" },
                { id: "jazzcash", name: "JazzCash", icon: "📲", detail: "0301-2222333" },
                { id: "bank", name: "Bank (HBL)", icon: "🏦", detail: "PK36HABB001234" },
                { id: "cash", name: "Office Cash", icon: "💵", detail: "8am–2pm" },
              ].map(pm => (
                <div key={pm.id} onClick={() => { setPayMethod(pm.id); setErrors(prev => ({ ...prev, payment: "" })); }}
                  style={{ border: `2px solid ${payMethod === pm.id ? SCHOOL.color : "#E5E7EB"}`, borderRadius: 10, padding: "12px 8px", cursor: "pointer", background: payMethod === pm.id ? SCHOOL.color + "0A" : "#fff", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 22 }}>{pm.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#0B1437", marginTop: 4 }}>{pm.name}</div>
                  {payMethod === pm.id && <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3 }}>{pm.detail}</div>}
                </div>
              ))}
            </div>
            {errors.payment && <p style={styles.errorMsg}>{errors.payment}</p>}

            {payDone ? (
              <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "16px", textAlign: "center", margin: "14px 0" }}>
                <div style={{ fontSize: 32 }}>✅</div>
                <div style={{ fontWeight: 700, color: "#15803D" }}>Payment Confirmed!</div>
                <div style={{ color: "#166534", fontSize: 12 }}>Txn: TXN{Date.now()}</div>
              </div>
            ) : (
              <button className="pay-confirm-btn" style={{ marginTop: 14 }} onClick={() => { if (!payMethod) { setErrors({ payment: "Select a payment method" }); return; } setPayDone(true); }}>
                ✔ Confirm — PKR {totalDue.toLocaleString()}
              </button>
            )}
            <StepFooter onNext={nextStep} onBack={() => setStep(step - 1)} />
          </Card>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <div>
            <Card style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: 52 }}>🎉</div>
              <h2 style={{ color: SCHOOL.color, fontSize: 20, margin: "10px 0 6px" }}>Admission Submitted!</h2>
              <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 18px" }}>School will contact you within 2 working days.</p>
              <div style={{ background: "#EEF5FF", borderRadius: 12, padding: "14px 18px", display: "inline-block" }}>
                <div style={{ color: SCHOOL.color, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>APPLICATION NO.</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0B1437", letterSpacing: 2 }}>{regNo}</div>
                <div style={{ color: "#9CA3AF", fontSize: 10, marginTop: 4 }}>Save for communications</div>
              </div>
            </Card>

            <Card style={{ marginTop: 14 }}>
              <h3 style={{ color: SCHOOL.color, margin: "0 0 12px", fontSize: 14 }}>📋 Summary</h3>
              <div className="summary-grid">
                {[
                  ["Student Name", student.fullName],
                  ["Date of Birth", student.dob],
                  ["Gender", student.gender],
                  ["Class Applied", cls.class],
                  ["Shift", cls.shift],
                  ["Father's Name", parent.fatherName],
                  ["Father's Phone", parent.fatherPhone],
                  ["Email", parent.email],
                  ["Total Paid", `PKR ${totalDue.toLocaleString()}`],
                  ["Payment", "✅ Confirmed"],
                ].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1437", marginTop: 1, wordBreak: "break-word" }}>{v || "—"}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ marginTop: 14 }}>
              <h3 style={{ color: SCHOOL.color, margin: "0 0 12px", fontSize: 14 }}>📌 Next Steps</h3>
              {["You'll receive a call/SMS within 2 working days.", "Bring all original documents on interview date.", "Pay remaining fees before term starts.", "Student ID card issued on first day."].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, minWidth: 22, borderRadius: "50%", background: SCHOOL.color, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <div style={{ color: "#374151", fontSize: 13, paddingTop: 2, lineHeight: 1.5 }}>{s}</div>
                </div>
              ))}
            </Card>

            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button className="hero-btn-primary" style={{ flex: 1, minWidth: 130 }} onClick={() => setView("dashboard")}>Go to Dashboard</button>
              <button className="hero-btn-secondary2" style={{ flex: 1, minWidth: 130 }} onClick={resetAll}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // DASHBOARD
  if (view === "dashboard") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: SCHOOL.color, padding: "12px 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button className="back-btn" onClick={() => setView("home")}>← Home</button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, flex: 1 }}>Student Dashboard</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: SCHOOL.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👦</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "18px 12px 40px" }}>
        <div className="stats-grid" style={{ marginBottom: 16 }}>
          {[
            { icon: "📅", label: "Attendance", value: "87%", color: "#27AE60" },
            { icon: "📊", label: "Last Result", value: "A Grade", color: SCHOOL.color },
            { icon: "💰", label: "Fee Status", value: "Paid ✅", color: "#27AE60" },
            { icon: "📚", label: "Subjects", value: "9", color: SCHOOL.accent },
          ].map((s, i) => (
            <Card key={i} style={{ textAlign: "center", padding: "14px 10px" }}>
              <div style={{ fontSize: 26 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, color: s.color, fontSize: 16, margin: "4px 0 2px" }}>{s.value}</div>
              <div style={{ color: "#9CA3AF", fontSize: 11 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12, fontSize: 14 }}>💰 Fee Ledger 2026</div>
          {[
            ["January 2026", "PKR 4,000", "Paid", "#27AE60"],
            ["February 2026", "PKR 4,000", "Paid", "#27AE60"],
            ["March 2026", "PKR 4,000", "Paid", "#27AE60"],
            ["April 2026", "PKR 4,000", "Pending", "#F39C12"],
            ["May 2026", "PKR 4,000", "Upcoming", "#9CA3AF"],
          ].map(([m, a, s, c]) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13, flexWrap: "wrap", gap: 6 }}>
              <span style={{ color: "#374151" }}>{m}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{a}</span>
                <Badge color={c}>{s}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12, fontSize: 14 }}>📅 Attendance — April 2026</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: 30 }, (_, i) => {
              const type = i % 7 === 5 || i % 7 === 6 ? "holiday" : Math.random() > 0.1 ? "present" : "absent";
              return (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 5, background: type === "holiday" ? "#F3F4F6" : type === "present" ? "#DCFCE7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: type === "holiday" ? "#9CA3AF" : type === "present" ? "#15803D" : "#DC2626" }}>
                  {type === "holiday" ? "—" : type === "present" ? "✓" : "✗"}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11 }}>
            <span style={{ color: "#15803D" }}>✓ Present</span>
            <span style={{ color: "#DC2626" }}>✗ Absent</span>
            <span style={{ color: "#9CA3AF" }}>— Holiday</span>
          </div>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12, fontSize: 14 }}>🕐 Today's Timetable</div>
          {[
            ["08:00–08:40", "Mathematics", "Mr. Khan"],
            ["08:40–09:20", "English", "Ms. Fatima"],
            ["09:20–10:00", "Urdu", "Mr. Ahmed"],
            ["10:00–10:20", "Break", "—"],
            ["10:20–11:00", "Science", "Ms. Zara"],
            ["11:00–11:40", "Computer", "Mr. Bilal"],
            ["11:40–12:20", "Islamiat", "Mr. Qasim"],
          ].map(([time, sub, teacher]) => (
            <div key={time} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 12, flexWrap: "wrap", gap: 4 }}>
              <span style={{ color: "#9CA3AF", fontFamily: "monospace", minWidth: 85 }}>{time}</span>
              <span style={{ fontWeight: 600, color: sub === "Break" ? "#F39C12" : "#0B1437", flex: 1 }}>{sub}</span>
              <span style={{ color: "#6B7280" }}>{teacher}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12, fontSize: 14 }}>📢 School Notices</div>
          {[
            { date: "Apr 28", title: "Annual Sports Day", desc: "May 10, 2026. All students participate.", type: "event" },
            { date: "Apr 25", title: "Mid-term Exams", desc: "Exams start May 15. Timetable via WhatsApp.", type: "exam" },
            { date: "Apr 20", title: "Fee Reminder", desc: "April fee due Apr 30. Late fee PKR 200.", type: "fee" },
            { date: "Apr 15", title: "Eid Holiday", desc: "School closed April 29 – May 5.", type: "holiday" },
          ].map((n, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${n.type === "exam" ? "#EF4444" : n.type === "fee" ? "#F39C12" : n.type === "event" ? SCHOOL.color : "#27AE60"}`, paddingLeft: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0B1437" }}>{n.title}</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{n.date}</span>
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{n.desc}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  // ADMIN
  if (view === "admin") return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "Georgia, serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background: "#0B1437", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button className="back-btn" onClick={() => { setView("home"); setAdminAuth(false); setAdminPin(""); }}>← Home</button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🔒 Admin Panel</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 12px 40px" }}>
        {!adminAuth ? (
          <Card style={{ maxWidth: 340, margin: "40px auto", textAlign: "center", padding: "30px 20px" }}>
            <div style={{ fontSize: 44 }}>🔒</div>
            <h2 style={{ color: SCHOOL.color, fontSize: 17, margin: "10px 0 6px" }}>Admin Login</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 16 }}>Enter 4-digit PIN</p>
            <input
              style={{ ...styles.input, textAlign: "center", fontSize: 22, letterSpacing: 8, marginBottom: 14 }}
              type="password" maxLength={4} placeholder="••••"
              value={adminPin} onChange={e => setAdminPin(e.target.value)}
            />
            <button className="hero-btn-primary" style={{ width: "100%" }} onClick={() => { if (adminPin === "1234") setAdminAuth(true); else alert("Wrong PIN! Demo: 1234"); }}>Login</button>
            <p style={{ color: "#9CA3AF", fontSize: 11, marginTop: 8 }}>Demo PIN: 1234</p>
          </Card>
        ) : (
          <div>
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              {[
                { icon: "👨‍🎓", label: "Total Students", value: "842", color: SCHOOL.color },
                { icon: "📋", label: "New Applications", value: "24", color: "#F39C12" },
                { icon: "💰", label: "Fees Collected", value: "3.2M", color: "#27AE60" },
                { icon: "⏳", label: "Pending Fees", value: "184K", color: "#EF4444" },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center", padding: "14px 10px" }}>
                  <div style={{ fontSize: 26 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: s.color, fontSize: 16, margin: "4px 0 2px" }}>{s.value}</div>
                  <div style={{ color: "#9CA3AF", fontSize: 11 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 14, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📋 Recent Applications</span>
                <Badge color={SCHOOL.color}>24 New</Badge>
              </div>
              {[
                [regNo, student.fullName || "Muhammad Ahmed", cls.class || "Class 5", "Pending"],
                ["ANS-2026-1001", "Sara Khan", "Class 3", "Approved"],
                ["ANS-2026-1002", "Ali Raza", "Class 7", "Pending"],
                ["ANS-2026-1003", "Fatima Malik", "KG", "Approved"],
                ["ANS-2026-1004", "Hamza Siddiqui", "Class 9", "Rejected"],
              ].map(([ref, name, cls2, status], i) => (
                <div key={i} style={{ borderBottom: "1px solid #F3F4F6", padding: "11px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#0B1437", fontSize: 13 }}>{name}</div>
                    <div style={{ color: "#9CA3AF", fontSize: 10, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ref} · {cls2}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <Badge color={status === "Approved" ? "#27AE60" : status === "Pending" ? "#F39C12" : "#EF4444"}>{status}</Badge>
                    <button style={{ fontSize: 11, padding: "4px 8px", border: `1px solid ${SCHOOL.color}`, borderRadius: 6, cursor: "pointer", color: SCHOOL.color, background: "transparent" }}>View</button>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <div style={{ fontWeight: 700, color: SCHOOL.color, marginBottom: 12, fontSize: 14 }}>💰 Fee Collection — May 2026</div>
              <div className="fee-grid">
                {CLASSES.map(c => {
                  const pct = Math.floor(60 + Math.random() * 40);
                  return (
                    <div key={c} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{c}</div>
                      <div style={{ background: "#E5E7EB", borderRadius: 4, height: 7, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#27AE60" : pct > 60 ? "#F39C12" : "#EF4444", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{pct}%</div>
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

// ── Styles ────────────────────────────────────────────────

const styles = {
  label: { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 5 },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #D1D9F0", borderRadius: 9, fontSize: 14, background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif" },
  inputError: { borderColor: "#EF4444" },
  errorMsg: { color: "#EF4444", fontSize: 12, margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: 14, padding: "18px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  sectionTitle: { margin: "0 0 6px", color: "#0B1437", fontSize: 18, fontWeight: 700 },
  sectionSub: { color: "#6B7280", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 },
};

const globalCSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }

  .grid2         { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
  .doc-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 4px; }
  .pay-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .stats-grid    { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .feature-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .summary-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .fee-grid      { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

  .desktop-nav   { display: flex; gap: 8px; }
  .hamburger     { display: none; background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 20px; padding: 6px 12px; border-radius: 7px; cursor: pointer; }
  .mobile-menu   { background: #154360; border-top: 1px solid rgba(255,255,255,0.1); }
  .mobile-menu button { display: block; width: 100%; text-align: left; background: none; border: none; color: #fff; padding: 13px 18px; font-size: 14px; cursor: pointer; font-family: Georgia, serif; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .mobile-menu button:hover { background: rgba(255,255,255,0.08); }

  .hdr-btn         { background: #F39C12; color: #fff; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: Georgia, serif; }
  .hdr-btn-outline { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.5); padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: Georgia, serif; }
  .hero-btn-primary    { background: #F39C12; color: #fff; border: none; padding: 13px 22px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: Georgia, serif; }
  .hero-btn-secondary  { background: rgba(255,255,255,0.12); color: #fff; border: 1.5px solid rgba(255,255,255,0.4); padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: Georgia, serif; }
  .hero-btn-secondary2 { background: #fff; color: #1B4F72; border: 1.5px solid #1B4F72; padding: 12px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: Georgia, serif; }
  .back-btn            { background: rgba(255,255,255,0.12); color: #fff; border: none; padding: 7px 12px; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: Georgia, serif; white-space: nowrap; }
  .portal-btn-primary  { background: linear-gradient(135deg,#1B4F72,#154360); color:#fff; border:none; padding:12px 18px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family: Georgia, serif; }
  .portal-btn-secondary{ background:#fff; color:#1B4F72; border:1.5px solid #1B4F72; padding:11px 16px; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; font-family: Georgia, serif; }
  .feature-card        { background:#fff; border-radius:14px; padding:18px 14px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
  .pay-confirm-btn     { width:100%; background:linear-gradient(135deg,#27AE60,#1E8449); color:#fff; border:none; padding:14px; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; font-family:Georgia,serif; }
  input:focus, select:focus, textarea:focus { border-color: #1B4F72 !important; box-shadow: 0 0 0 3px rgba(27,79,114,0.1); outline: none; }

  @media (max-width: 640px) {
    .grid2        { grid-template-columns: 1fr; gap: 0; }
    .stats-grid   { grid-template-columns: 1fr 1fr; gap: 10px; }
    .feature-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .fee-grid     { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .desktop-nav  { display: none; }
    .hamburger    { display: block; }
  }

  @media (max-width: 400px) {
    .doc-grid     { grid-template-columns: 1fr; }
    .feature-grid { grid-template-columns: 1fr; }
    .summary-grid { grid-template-columns: 1fr; }
    .fee-grid     { grid-template-columns: repeat(2, 1fr); }
    .pay-grid     { grid-template-columns: 1fr 1fr; }
  }
`;