import express from "express";
import { connectDb } from "./config/db.js";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import loadProducts from "./seeds/products.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cartRoutes.js";
import helmet from "helmet"
import CspViolationReport from "./cspViolationReport.json" with {type: "json"}
import { writeFile } from "fs/promises"

const app = express();

/* First Connect With mongoDb server */
await connectDb()

/* loading products: */
await loadProducts()

/* Security Headers: */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      directives: {
        reportUri: ["/csp-violation-report"],
        frameAncestors: ["'self'", ...allowedOrigins],
      },
    }
  })
);

/* Cors Enable: */
const allowedOrigins = [process.env.CLIENT_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


/* Cookie Parser: */
app.use(cookieParser(process.env.SESSION_SECRET))

/* Enable Body JSON Parsing: */
app.use(express.json())

/* load products: */
app.use("/products", productRoutes)

app.get(['/', '/health'], (req, res) => {
  return res.status(200).json({
    service: 'Shopee App API',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/* Users Route specific middleware */
app.use("/user", userRoutes)

/* Auth Specific Middleware:*/
app.use("/auth", authRoutes);

/* Add to Cart API Specific Middleware: */
app.use("/cart", cartRoutes)


/* CSP Violation */
app.post(
  "/csp-violation-report",
  express.json({ type: ["application/csp-report", "application/json"] }),
  async (req, res) => {
    const violation = req.body;

    try {
      CspViolationReport.push({
        timestamp: new Date().toISOString(),
        report: violation
      });

      await writeFile(
        "./cspViolationReport.json",
        JSON.stringify(CspViolationReport, null, 2)
      );

      return res.status(204).end();
    } catch (error) {
      console.log("Error while writing CSP violation:", error);
      return res.status(500).json({ error: "Failed to log CSP report" });
    }
  }
);


/* Global Error Middleware: */
app.use((err, req, res, next) => {
  console.log("Global Error Middleware", err);
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: "Email Already Exist" })
  }
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" })
})

/* Server listening route: */
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`server is listening on address http://localhost:${PORT}`)
})
