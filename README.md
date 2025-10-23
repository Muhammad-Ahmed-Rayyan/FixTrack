<div align="center">

# 🗺️ FixTrack

**Real-Time Issue Reporting and Tracking System**

![Last Commit](https://img.shields.io/github/last-commit/Muhammad-Ahmed-Rayyan/FixTrack)
![TypeScript](https://img.shields.io/badge/TypeScript-70.2%25-blue?logo=typescript)
![CSS](https://img.shields.io/badge/CSS-29.8%25-orange?logo=css3)
![languages](https://img.shields.io/github/languages/count/Muhammad-Ahmed-Rayyan/FixTrack)

<br>

Built with the tools and technologies: 

![React](https://img.shields.io/badge/React-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-%23199900.svg?style=for-the-badge&logo=leaflet&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-%233498DB.svg?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## 🧠 Project Summary

**FixTrack** is a web-based application designed for real-time reporting, tracking, and resolution of issues. It provides a platform for users to submit issues with location data, and for administrators to manage and monitor the status of these issues. The interactive map interface allows for easy visualization of issue locations and supports department-based management for better organization.

---

## 🚀 Features

- 🔐 **User Authentication:** Secure user registration and login functionality.
- 🗺️ **Interactive Map:** Users can report issues by selecting a location on an interactive map powered by **Leaflet**.
- 📝 **Issue Reporting:** Submit detailed reports including title, description, image (via **Cloudinary**), and location.
- 📊 **Dashboard:** View, filter, and manage all reported issues in one place.
- 🔔 **Real-Time Updates:** Issue data and statuses update in real-time through **Firebase**.
- 🤖 **Chatbot Integration:** An intelligent chatbot assists users with reporting or tracking issues.
- 👥 **Role-Based Access:**
  - **Department Admins** can view and manage reports related only to their respective departments (e.g., road, sanitation, etc.).
  - **Super Admins** have full access — they can view/manage all reports and handle user management.
- 🧭 **Location-Based Reporting:** Each issue is tagged with its geographic coordinates for accurate placement on the map.
- 🎨 **Responsive Design:** Fully responsive and mobile-friendly UI built with **React** and custom **CSS**.

---

## 🗃️ Project Structure

```bash
FixTrack
├── public
│   ├── assets
│   ├── logo
│   │   ├── FixTrack.ico
│   │   └── FixTrack.png
│   ├── index.html
│   └── vite.svg
├── src
│   ├── animation
│   │   └── Map_Pinging.json
│   ├── components
│   │   ├── BuiltWith
│   │   │   ├── BuiltWith.css
│   │   │   └── BuiltWith.tsx
│   │   ├── ContactUs
│   │   │   ├── ContactUs.css
│   │   │   └── ContactUs.tsx
│   │   ├── Footer
│   │   │   ├── Footer.css
│   │   │   └── Footer.tsx
│   │   ├── Home
│   │   │   ├── Home.css
│   │   │   └── Home.tsx
│   │   ├── HowItWorks
│   │   │   ├── HowItWorks.css
│   │   │   └── HowItWorks.tsx
│   │   ├── LoadingSpinner
│   │   │   ├── LoadingSpinner.css
│   │   │   └── LoadingSpinner.tsx
│   │   ├── Navbar
│   │   │   ├── Navbar.css
│   │   │   └── Navbar.tsx
│   │   ├── OurTeam
│   │   │   ├── OurTeam.css
│   │   │   └── OurTeam.tsx
│   │   ├── Auth.css
│   │   ├── Auth.tsx
│   │   ├── Chatbot.css
│   │   ├── Chatbot.tsx
│   │   ├── Dashboard.css
│   │   ├── Dashboard.tsx
│   │   ├── IssueForm.css
│   │   ├── IssueForm.tsx
│   │   ├── IssueList.css
│   │   ├── IssueList.tsx
│   │   ├── Profile.css
│   │   ├── Profile.tsx
│   │   ├── ProfileMenu.css
│   │   ├── ProfileMenu.tsx
│   │   ├── UserManagement.css
│   │   └── UserManagement.css
│   ├── pages
│   │   ├── LandingPage.css
│   │   ├── LandingPage.test.tsx
│   │   └── LandingPage.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── firebaseConfig.ts
│   ├── index.css
│   ├── main.tsx
│   ├── setupTests.ts
│   ├── types.ts
│   └── vite-env.d.ts
├── .env
├── .eslintrc.cjs
├── .firebaserc
├── cors.json
├── firebase.json
├── firebase.rules
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🔧 Setup & Installation

> Make sure **Node.js** and **npm** are installed on your system.

```bash
# Clone the repo
git clone https://github.com/Muhammad-Ahmed-Rayyan/FixTrack.git
cd FixTrack

# Install required libraries
npm install

# Run the development server
npm run dev
```

---

## 🔥 Firebase Configuration

This project uses **Firebase** for backend services.  
To set it up:

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a new **web app** to your Firebase project.
3. Copy the Firebase configuration object.
4. Replace the placeholder in `FixTrack/src/firebaseConfig.ts` with your own config.

---

## ⚙️ Firebase Deployment & Hosting

This project uses Firebase Hosting for deployment.
Below are the steps and commands used to configure, build, and deploy FixTrack from Firebase Studio:
```bash
# Log in to Firebase
firebase login

# Link your local project to a Firebase project
firebase use --add

# Initialize Firebase Hosting (select "dist" or your build folder)
firebase init hosting

# Build the production-ready project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```
After deployment, your production files will be available online via the Firebase Hosting URL.
The optimized build files are located in the dist directory.

---

<div align="center">

⭐ **Support this project by giving it a star on GitHub!** ⭐

</div>
