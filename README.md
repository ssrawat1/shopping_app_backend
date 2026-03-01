# 🛒 Next.js Shopping App - Server Side

The backend of the **Next.js Shopping App** built with **Node.js** and **Express.js**.  
This server handles product management, user authentication, session management, and cart persistence.

---

## 🚀 Features

### 🔐 **Session-Based Authentication**
- Secure session-based authentication system.
- Guest users can browse and add items to the cart.
- On login, guest cart items are merged into the user's account cart.
- On logout, cart items are preserved in the guest session.
- Seamless cart restoration on re-login.

### 🛍 **Smart Cart System**
- Manages guest (session-based) and authenticated user (database-based) carts.
- Automatic merging of guest and user carts upon login.
- Add, remove, and update product quantities.
- Persistent cart experience similar to major e-commerce platforms.

### 📦 **Product Management**
- Product listing, detail, and cart summary.
- Clean API endpoints for handling product data.

### 📑 **Rate Limiting and Throttling**
- Implements rate limiting and throttling to improve performance and protect the API from abuse.

### 🛡 **Middleware & Validation**
- Middleware for input validation and request handling (e.g., validate ID format).

---

## 🏗 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Session-based authentication
- **Session Management:** Redis (optional for persistent sessions)
- **Security:** Rate Limiting, Input Validation, and Throttling

---

## 📂 Project Structure

## 📂 Project Structure

```
shop_server
├── config
│ ├── db.js
│ └── setup.js
├── controllers
│ ├── authController.js
│ ├── cartController.js
│ ├── productController.js
│ └── userController.js
├── middlewares
│ ├── validateId.js
├── models
│ ├── cartModel.js
│ ├── otpModel.js
│ ├── productModel.js
│ ├── sessionModel.js
│ └── userModel.js
├── routes
│ ├── authRoutes.js
│ ├── cartRoutes.js
│ ├── productRoutes.js
│ └── userRoutes.js
├── services
│ ├── sendOtp.js
├── utils
│ ├── rateLimiter.js
│ └── throttle.js
├── validators
│ └── validate.js
├── app.js
├── package.json
└── .env
```

---

## 🧠 **Authentication & Cart Logic**

### Guest Flow:
1. Guest user visits the website.
2. Items are added to the guest session cart.
3. Cart data is stored temporarily in the session.

### Login Flow:
1. User logs in.
2. Guest cart items are merged into the user's database cart.
3. Any duplicate products are handled by updating the quantities.

### Logout Flow:
1. User logs out.
2. The current cart data is stored in the guest session.
3. Cart data is restored on the next login.

This ensures that the shopping experience remains seamless, even if the user switches between guest and authenticated sessions.

---

### **Project Breakdown**

- **Controllers:** Manage application logic (e.g., auth, cart, products, and users).
- **Models:** Define the MongoDB schema for various resources like products, users, and carts.
- **Routes:** Define the API endpoints for each feature (auth, cart, products, etc.).
- **Middleware:** Handle various pre-route checks (e.g., ID validation).
- **Services:** Contains utility functions for tasks like sending OTPs.
- **Utils:** Common utilities for performance optimization (rate limiting and throttling).

The backend architecture ensures a modular, maintainable, and scalable solution for handling user data, product management, and cart functionality.