# 🛒 Next.js Shopping App

A modern, secure, and user-friendly shopping application built with **Next.js**.  
This project focuses on seamless user experience, session-based authentication, smart cart management, and performance optimization.

---

## 🚀 Features

### 🔐 Session-Based Authentication
- Secure session-based authentication system
- Guest users can browse and add items to cart
- On login, guest cart items are automatically merged with the user’s account cart
- On logout, cart items are preserved in guest session
- Smooth cart restoration on re-login

### 🛍 Smart Cart System
- Guest cart (session-based)
- Authenticated user cart (database-based)
- Automatic cart merging logic
- Add, remove, and update product quantities
- Persistent cart experience similar to major e-commerce platforms

### 📦 Product Management
- Product listing page
- Product detail page
- Cart page with full summary
- Clean and responsive UI

### 📑 Pagination
- Implemented pagination for product listing
- Improves performance
- Enhances user experience
- Reduces excessive scrolling

### 🎨 Theme Support
- Light/Dark mode support
- Improved accessibility and modern UI feel

---

## 🏗 Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js / Express.js
- **Database:** MongoDB
- **Authentication:** Session-based authentication
- **State Management:** Context API

---

## 🧠 Authentication & Cart Logic

### Guest Flow:
1. User visits website
2. Items added to guest session cart
3. Cart stored temporarily

### Login Flow:
1. User logs in
2. Guest cart items are merged into user's database cart
3. Duplicate products are handled properly (quantities updated)

### Logout Flow:
1. User logs out
2. Current cart items are stored in guest session
3. Cart restored on next login

This ensures a seamless shopping experience without losing user data.

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
│ └── rateLimiter.js
│ └── throttle.js
├── validators
│ └── validate.js
├── app.js
├── package.json
└── .env
```