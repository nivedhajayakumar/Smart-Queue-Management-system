# 🏥 Smart Queue & Hospital Management System

A full-stack **Hospital Workflow Management Platform** that transforms how hospitals handle patient flow from registration to consultation, lab, billing, and beyond.

Built with real-world hospital logic, this system focuses on **efficiency, automation, and patient experience**.

---

## 🌟 Why this project?

Hospitals often struggle with:

* Long waiting queues ⏳
* Manual patient handling 📄
* Poor coordination between departments 🔄
* Lack of real-time updates 📢

This system solves these problems by introducing a **smart, connected workflow** where every department works in sync.

---

## 🚀 What makes it “Smart”?

Instead of simple CRUD operations, this system includes:

* 🧠 **AI-assisted triage** to suggest departments
* 🎯 **Priority-based queue system** (Emergency > Revisit > Fresh)
* ⚡ **Real-time token workflow**
* 🔔 **Automated notifications** for patients
* 🔗 **End-to-end integration** (Patient → Doctor → Lab → Billing)

---

## 🧩 Complete Hospital Workflow

```text
Patient Registration
→ Appointment Booking
→ Smart Triage (AI)
→ Token Generation
→ Queue Management
→ Doctor Consultation
→ Prescription / Lab Tests
→ Billing & Payment
→ Notifications
```

---

## 🧑‍⚕️ User Roles & Responsibilities

### 👨‍💼 Admin

* Monitor hospital performance
* View reports, revenue, and audit logs
* Manage departments, doctors, and system data

---

### 🧾 Receptionist

* Register patients
* Book appointments
* Generate tokens
* Manage queues
* Handle billing

---

### 👨‍⚕️ Doctor

* View assigned patient queue
* Start and complete consultations
* Add diagnosis and notes
* Prescribe medicines
* Request lab tests
* Schedule follow-ups

---

## 💡 Core Features

### 👤 Patient Management

* Register **Fresh / Revisit / Emergency** patients
* Store symptoms, contact info, and medical data
* Automatically link patients with departments

---

### 📅 Appointment System

* Walk-in, online, revisit, and emergency appointments
* Auto doctor assignment based on department
* Seamless patient-to-doctor flow

---

### 🧠 AI-Assisted Triage

A rule-based engine analyzes symptoms and vitals to determine:

* Suggested department
* Urgency level
* Priority score

#### Example:

```text
Symptoms: Severe chest pain + low oxygen
→ Department: Emergency
→ Urgency: High
→ Action: Immediate consultation
```

---

### 🎟 Smart Token & Queue System

* Department-wise token generation
* Priority-based ordering:

```text
🚑 Emergency → Highest priority  
🔁 Revisit → Medium priority  
🆕 Fresh → Lowest priority  
```

* Estimated waiting time calculation
* Dynamic queue updates

---

### 👨‍⚕️ Consultation Workflow

Doctors can:

* Start consultation
* Record diagnosis
* Add notes
* Prescribe medicines
* Request lab tests
* Schedule follow-ups

---

### 💊 Prescription Management

* Multiple medicines per patient
* Dosage, duration, and instructions
* Medical advice tracking

---

### 🧪 Lab Module

* Lab test requests from doctor
* Lab token generation
* Report uploads
* Patient lab history

---

### 💳 Billing System

* Create billing items
* Generate invoices
* Track payments
* Maintain balance and status

---

### 🔔 Notification System

Patients receive updates for:

* Token generation
* Token call
* Invoice creation
* Payment confirmation

---

### 🔐 Security & Access Control

* JWT-based authentication
* Role-based authorization
* Secure APIs using middleware

---

## 🛠 Tech Stack

### 🖥 Frontend

* React.js (Vite)
* React Router
* Axios
* CSS

---

### ⚙ Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt.js

---

### 🔒 Security & Logging

* Helmet (security headers)
* Rate limiting
* Morgan (logging)
* Audit logs
* Centralized error handling

---

## 🏗 Architecture

The project follows a **modular MVC architecture**:

```text
Models → Database schemas  
Controllers → Business logic  
Routes → API endpoints  
Middleware → Auth & security  
Services → Core logic (queue, triage, notifications)
```

---

## 📂 Project Structure

```text
Smart-Queue-Management-system/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
```

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
npm install
npm run dev
```

---

### 🌐 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` in backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## 📈 Future Improvements

* 🔄 Real-time queue (WebSockets)
* 📱 Mobile app integration
* 💬 WhatsApp / Email notifications
* 📊 Advanced analytics dashboard
* ☁ Cloud deployment (AWS / Docker)

---

## 👩‍💻 Author

**Nivedha J**
🔗 https://github.com/nivedhajayakumar

---

## 🌟 Final Note

This project is more than just CRUD —
it demonstrates **real-world system design, workflow automation, and scalable backend architecture**.

---

## ⭐ Like this project?

If you found this useful, consider giving it a ⭐ on GitHub!
