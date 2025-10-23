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

</div>

---

## 🧠 Project Summary

**FixTrack** is a web-based application designed for real-time reporting, tracking, and resolution of issues. It provides a platform for users to submit issues with location data, and for administrators to manage and monitor the status of these issues. The interactive map interface allows for easy visualization of issue locations.

---

## 🚀 Features

- 🔐 **User Authentication:** Secure user registration and login functionality.
- 🗺️ **Interactive Map:** Users can report issues by selecting a location on an interactive map powered by Leaflet.
- 📝 **Issue Reporting:** A detailed form for submitting new issues, including title, description, and location.
- 📊 **Dashboard:** A comprehensive dashboard to view, filter, and manage all reported issues.
- 🔔 **Real-Time Updates:** Issues and their statuses are updated in real-time using Firebase.
- 🤖 **Chatbot:** An integrated chatbot to provide assistance to users.
- 👤 **User Management:** Admins can manage users and their roles within the system.
- 🎨 **Responsive Design:** A modern and responsive UI built with React and custom CSS.

---

## 🗃️ Project Structure

```bash
FixTrack
├── public
│   ├── logo
│   └── assets
├── src
│   ├── animation
│   ├── assets
│   ├── components
│   │   ├── Auth
│   │   ├── BuiltWith
│   │   ├── Chatbot
│   │   ├── ContactUs
│   │   ├── Dashboard
│   │   ├── Footer
│   │   ├── Home
│   │   ├── HowItWorks
│   │   ├── IssueForm
│   │   ├── IssueList
│   │   ├── LoadingSpinner
│   │   ├── Navbar
│   │   ├── OurTeam
│   │   ├── Profile
│   │   └── ProfileMenu
│   ├── pages
│   │   └── LandingPage
│   ├── App.tsx
│   ├── firebaseConfig.ts
│   ├── main.tsx
│   └── types.ts
├── .firebaserc
├── firebase.json
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🔧 Setup & Installation

> Make sure Node.js and npm are installed.

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

This project uses Firebase for backend services. To run the project, you need to set up your own Firebase project and configure the app.

1.  Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2.  Add a new web app to your project.
3.  Copy the Firebase configuration object and replace the placeholder in `FixTrack/src/firebaseConfig.ts`.

---

## 🚀 Deployment

The project can be built for production using the following command:

```bash
npm run build
```

The production-ready files will be located in the `dist` directory. These files can be deployed to any static hosting service.

This project is configured for deployment with Firebase Hosting. To deploy to Firebase, you can use the Firebase CLI:

```bash
firebase deploy --only hosting
```

---

<div align="center">

⭐ Support this project by dropping a star on GitHub!

</div>
