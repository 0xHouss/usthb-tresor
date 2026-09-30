08-06-2025 13:41

Status: #ongoing 
Tags: [[usthb trésor]] [[auto-entrepreneur]] [[coding]]

# USTHB Trésor – A Collaborative Resource Hub for USTHB Students

**USTHB Trésor** is a centralized platform tailored for USTHB students to collaboratively share and access a variety of academic resources. From old exams and lecture notes to practical exercises, the platform aims to foster a culture of sharing and learning within the USTHB community.

---

### **Core Features**

#### 📁 **File Metadata**

Each uploaded file is categorized and searchable based on the following attributes:

- **Major:** Linked to a normalized entity (e.g., Informatique, Génie Civil).
- **Academic Level:** L1, L2, L3, M1, M2, D1–D3, or ING1–ING5.
- **Section:** Class section (e.g., A, B, C).
- **Group (Optional):** Subgroup designation within a section.
- **Academic Year:** Year the file applies to (e.g., 2023).
- **Semester:** S1 or S2.
- **Module:** Linked to a centralized `Module` entity (e.g., Analyse, Compilation).
- **Professor:** Linked to a `Professor` entity via their full name.
- **Type:** File category (`Lecture`, `DW_Worksheet`, `PW_Worksheet`, `Interrogation`, `Exam`, `PW_Exam`).
- **Contributor:** Linked to the `User` entity who uploaded the file.

#### 👤 **Access Roles**

Users are assigned one of the following roles, each with specific privileges:

1. **Admins:**
    - Full access to manage files, users, metadata, and logs.
    - Can approve/reject suggested files.
    - Access full audit logs and manage reported issues.
2. **Moderators:**
    - Can moderate file suggestions (approve, reject, request changes).
    - Have limited administrative privileges.
3. **Users:**
    - Can browse, filter, and download approved files.
    - Can submit new files for review with complete metadata.
4. **Visitors:**
    - Can browse approved files but must log in to contribute or interact further.


---

### 🔑 **Authentication & Authorization**

- **Secure Auth:** Handled with NextAuth.js.
- **OAuth Support:** Compatible with providers like Google and GitHub.
- **Session & Account Management:** Fully integrated via Prisma schema.
- **Role-Based Access Control:** Enforced on both backend and frontend.

---

### 🧩 **Key Functionalities**

#### 📂 **File Management**

- Advanced search and filtering by module, major, type, level, year, etc.
- File naming convention (auto-generated):  
    `"type_module_major_level_section_year.pdf"`  
    _(e.g., `Exam_Compilation_L3_CS_A_2023.pdf`)_

#### 🔄 **Suggestions Workflow**
- Users suggest files via a form with complete metadata.
- Suggestions are stored in the `PendingFile` model.
- Moderators/Admins review and approve them.
- Once approved, they are promoted to the `File` model and linked to normalized entities.

#### 📜 **Event Logging**
- Tracks actions like file uploads, edits, approvals, deletions, and logins.
- Ensures full accountability and traceability.

#### 🐞 **Problem Reporting**
- Users can report corrupted files, metadata errors, or copyright violations.
- Reports go directly to the admin panel for resolution.

---

### 🧱 **Data Modeling Highlights**
- **Modular Design:** Separate models for `Major`, `Module`, and `Professor` ensure data consistency and prevent duplication.
- **Normalized Relations:** Files reference existing entities rather than storing raw strings.
- **Drive Integration:** Each file is linked to a unique `driveId` for scalable storage on Google Drive.

---

### ⚙️ **Tech Stack**

#### **Frontend**
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui

#### **Backend**
- **ORM:** Prisma (SQLite for dev, PostgreSQL for production)
- **Auth:** NextAuth.js
- **Storage:** Google Drive integration for hosting files

#### **Deployment**
- **Platform:** Vercel

---

### 📊 **Advanced Features (Planned)**
1. **Advanced Search:**
    - Multi-field filtering for precise queries (e.g., “All Exams for M2 Informatique, S1”).
2. **Admin Dashboard:**
    - Visual stats: most downloaded files, active contributors, traffic trends.
3. **Contributor Leaderboard:**
    - Recognize top uploaders to encourage collaboration.
4. **Comment System:**
    - Allow users to comment on files (e.g., corrections, clarifications).
5. **Gamification:**
    - Points/badges for contributions, approvals, and engagement.

---

### 🔐 **Security & Compliance**
- **Moderation Workflow:** Prevents malicious or low-quality uploads.
- **Access Controls:** Role-based actions and backend validation.
- **Audit Logs:** Admin actions (e.g., file deletions, approvals) are recorded.
- **Data Privacy:** Compliant with local laws for user data handling.

---

### 🌱 **Future Expansion Ideas**
- **Alumni Access:** Allow verified alumni to contribute past resources.
- **Faculty Partnership:** Collaborate with professors to verify or upload official documents.
- **Verified Tags:** Mark officially approved or high-quality files with a special badge.

## References