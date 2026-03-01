# 🛒 Next.js Shopping App - Server Side

The backend of the **Next.js Shopping App** built with **Node.js** and **Express.js**.  
This server handles product management, user authentication, session management, and cart persistence, with added security and optimization features.

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
- Custom **rate limiting** and **throttling** logic to prevent API overwhelm and abuse.
- Smooths out sudden traffic spikes to ensure the app performs well under high load and maintains stability.

### 🛡 **Middleware & Validation**
- **Helmet** for securing HTTP headers to protect against known web vulnerabilities.
- **Zod** for input validation and data sanitization, ensuring data integrity and safety.
- **DOMPurify** for sanitizing user-generated content (e.g., product descriptions, comments) to prevent XSS attacks.

---

## 🏗 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Session-based authentication
- **Session Management:** Redis (optional for persistent sessions)
- **Security:** Helmet, Zod, DOMPurify, Custom Rate Limiting & Throttling

---

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
│ ├── rateLimiter.js # Custom rate limiting logic
│ ├── throttle.js # Custom throttling logic
│ └── sanitizeInput.js # Data sanitization middleware using Zod and DOMPurify
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
│ └── rateLimiter.js # Custom rate limiting logic for controlling API requests
│ └── throttle.js # Throttling utility to smooth traffic spikes
├── validators
│ └── validate.js # Input validation functions using Zod
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
- **Middleware:** Handle various pre-route checks (e.g., ID validation, sanitization using Zod and DOMPurify).
- **Services:** Contains utility functions for tasks like sending OTPs.
- **Utils:** Common utilities for performance optimization, including **rate limiting** and **throttling**.
- **Security:** **Helmet** for securing headers and **DOMPurify** for sanitizing content to prevent XSS attacks.

The backend architecture ensures a modular, maintainable, and scalable solution for handling user data, product management, cart functionality, and security, with optimizations in place to handle high traffic and prevent abuse.

---

## 🛡 **Security Features**

### **Helmet:**
- Adds various HTTP headers to protect the app from common web vulnerabilities like clickjacking, XSS, and CSRF attacks.

### **Zod Sanitization:**
- Validates and sanitizes user input with **Zod** to ensure only clean and expected data is processed by the server.
- Reduces the risk of malicious data input that could compromise the application.

### **DOMPurify:**
- **DOMPurify** is used to sanitize any HTML content that may be displayed to the user (e.g., product descriptions, comments) to prevent XSS attacks.
  
### **Custom Rate Limiting & Throttling:**
- Implements a custom rate limiter to control the number of requests a client can make to the API within a specified time period.
- **Throttling** is applied to smooth out sudden traffic spikes, ensuring the server can handle high traffic efficiently without becoming overwhelmed.

---

 