# 📚 Mini Book-store Management

A full-stack **book store management application** built using the MERN stack (MongoDB, Express, React, Next.js). This project simulates a real-world e-commerce platform with essential features such as book browsing, shopping cart, user authentication, order placement, and an admin dashboard.

> 🛠️ **Frontend was fully built during hands-on practice in an online course.** Backend logic is adapted from an open-source learning project on YouTube.

---

## 🚀 Live Demo

- **Deploy**: **[https://booklify-duyln-dev.vercel.app/](https://booklify-duyln-dev.vercel.app/)**
- **GitHub Repository**: **[https://github.com/duyln-dev/Booklify](https://github.com/duyln-dev/Booklify)**

---

## 🔧 Technologies Used

### 🔹 Frontend:

- **React.js** (Functional components + Hooks)
- **Next.js** (App Router)
- **React-Bootstrap** for UI Customer UI
- **Ant Design (Antd)** for Admin Dashboard
- **Sass** for custom styling
- **Axios** for API communication
- **Redux Toolkit** for global state management
- **React Router / Next Router** for navigation

### 🔹 Backend:

- **Express.js** for REST APIs
- **MongoDB + Mongoose** for database management
- **JWT Authentication** for secure access
- **Deployment via Render**

---

## 📦 Features

### 🛍️ Client-side:

- Product catalog with search, filter, and sort
- Book detail page
- Add to cart & preview cart
- Checkout flow with order confirmation
- Authentication: Login / Register
- Persistent login with Access/Refresh tokens
- View order history
- Manage personal information (planned feature)

### 🔐 Authentication:

- JWT-based login/session
- Protected routes (checkout, admin dashboard)
- Role-based access control (user/admin)

### 🧑‍💼 Admin Dashboard:

- Manage:
  - 📚 Books (CRUD + upload cover images)
  - 🧾 Orders
  - 👤 Users
- Search, filter, sort
- Basic analytics: revenue, order count (in process)
- Export/import with Excel/CSV (planned feature)

---

## 🗂️ Folder Structure (Frontend)

```plaintext
src/
├── assets/
├── components/
│   ├── Admin/
│   ├── Book/
│   ├── Footer/
│   ├── Header/
│   ├── Home/
│   ├── Loading/
│   ├── NotFound/
│   ├── Order/
│   └── ProtectedRoute/
├── pages/
│   ├── admin/
│   ├── book/
│   ├── contact/
│   ├── login/
│   └── register/
├── redux/
│   ├── account/
│   ├── counter/
│   ├── order/
│   └── store.js
├── services/
│   └── api.js
├── styles/
│   └── Counter.module.css
├── utils/
│   ├── axios-customize.js
│   └── constant.js
├── App.jsx
└── main.jsx
```

## 🔒 Security

- Access/refresh token system with Axios interceptors
- Token expiration and auto re-login logic
- Route guards for protected pages

---

## 🧪 Key Learnings

This project helped reinforce the following:

- Building full-stack applications with MERN
- UI state management with Redux Toolkit
- Secure JWT-based auth handling
- Working with dynamic routes in Next.js
- Integration with third-party libraries: Antd, Chart.js, XLSX

---

## 📌 Notes

- Backend + MongoDB deployed on **Render**
- Frontend will be deployed using **Vercel**
- MongoDB Atlas used for production-ready database
  ⚠️ _Some parts of the UI are not fully responsive yet:_
  - _Homepage (customer view): partially responsive, needs refinement on tablet/mobile_
  - _Admin Dashboard: not responsive yet, planned for future updates_

---

## 🎯 Future Improvements

- Integrate payment gateways (Zalopay, Momo)
- Make the UI fully responsive (Homepage & Admin Dashboard)
- Migrate Customer UI from React-Bootstrap to Ant Design
- Improve responsive design using **Tailwind CSS**

---

## 💬 Feedback

This project is open for feedback and improvements. Contributions or suggestions are welcome through GitHub issues or pull requests.

```

```
