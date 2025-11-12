# 🍔 Grace Dabeli Centre — Real-Time MERN Ordering & Catering Platform

🚀 **A full-stack, real-time MERN (MongoDB, Express, React, Node.js) ordering and catering platform** built for my family’s business — *Grace Dabeli Centre*, run by my maternal uncle, Mr. Subhash Mudpalliwar.

This project brings traditional food business operations online with real-time order tracking, admin notifications, event catering management, and an intuitive customer experience.

---

## 🌐 Live Demo

**Frontend (Vercel):** [https://grace-dabeli-centre.vercel.app](https://grace-dabeli-centre.vercel.app)  
**Backend (Render):** [https://grace-dabeli-back.onrender.com](https://grace-dabeli-back.onrender.com)

*(Feel free to explore — place a test order; admin panel receives instant Socket.IO notifications! ⚡)*

---

## ⚙️ Tech Stack

| Layer | Technology Used |
|--------|-----------------|
| 🎨 **Frontend** | React.js, Material UI (MUI), Axios, Framer Motion |
| ⚙️ **Backend** | Node.js, Express.js |
| 🧠 **Database** | MongoDB (Mongoose ODM) |
| ⚡ **Real-Time** | Socket.IO |
| 🔐 **Authentication** | JSON Web Token (JWT) |
| ☁️ **Image Storage** | Cloudinary |
| 💳 **Payment (Future-ready)** | Razorpay Integration |
| 🌍 **Hosting** | Render (Backend) + Vercel (Frontend) |

---

## 🍽️ Customer-Facing Features

✅ Dynamic, searchable menu with category filters  
✅ Smooth shopping cart with live item count  
✅ Customizable items (e.g., “extra cheese”, “spicy”)  
✅ Secure JWT-based customer authentication 🔐  
✅ Smart checkout (Home Delivery / Self Pickup)  
✅ Live Order Tracking — no page refresh required 🔄  

---

## 👨‍💼 Admin Panel (CMS)

✅ Secure admin-only login & authentication  
✅ Live Order Wall — instant updates via Socket.IO 🔔  
✅ CRUD Menu Management (Add/Edit/Delete Items)  
✅ "In Stock" / "Featured" toggles  
✅ Analytics Dashboard — sales insights & top sellers 📊  
✅ Customer & Feedback management inbox 💬  

---

## 🎉 Event Catering System

✅ Smart event booking form for parties & functions 🎈  
✅ Flexible service modes — Delivery, Pickup, Full Service 🍴  
✅ Real-time admin alerts on new catering requests 🚨  
✅ Status updates visible to customers instantly ✅  

---

## 🧩 Project Structure
```bash
grace-dabeli-centre/
│
├── backend/                 # Express + MongoDB + Socket.IO server
│   ├── routes/              # All API endpoints
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, error handling, etc.
│   └── server.js            # Entry point
│
├── frontend/                # React.js web app
│   ├── src/components/      # UI components
│   ├── src/pages/           # All page views
│   ├── src/hooks/           # Custom hooks
│   ├── src/assets/          # Images, icons
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation


🔒 Environment Variables
🖥️ Backend (.env on Render)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_key
CLOUDINARY_API_SECRET=your_cloud_secret
CLIENT_URL=https://grace-dabeli-centre.vercel.app


🌐 Frontend (on Vercel)
REACT_APP_API_BASE_URL=https://grace-dabeli-back.onrender.com


🧠 Learning Outcomes

Implemented real-time communication using Socket.IO

Built scalable REST APIs with Node.js & Express

Managed data persistence using MongoDB & Mongoose

Deployed full-stack apps using Render + Vercel

Designed responsive, animated UI with React & MUI

Strengthened problem-solving through real-world application


📸 Screenshots
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/bfd21fc9-07b2-40ae-b031-d2aa3142759a" />
<img width="1910" height="924" alt="image" src="https://github.com/user-attachments/assets/7061c270-b439-4878-b40b-e48427db0a84" />


🧑‍💻 Author

Harsh Maroti Gorantiwar
🎓 B.E. Computer Science & Engineering | GEC Chandrapur
💼 Full Stack Developer | MERN | Python | JavaScript
🔗 LinkedIn
 | GitHub

🏁 License

This project is licensed under the MIT License — feel free to use and learn from it.



