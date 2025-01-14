import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import serveStatic from "serve-static";

const STATIC_PATH =
    process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

dotenv.config();
const app = express();
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3305,
    user: 'root',
    password: '1234',
    database: 'foodorder',
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get("/api/meals", (req, res) => {
  const query = "SELECT * FROM meals";

  db.query(query, (err, results) => {
      if (err) {
        console.log("meals data", err);
          return res.status(500).json({ success: false, message: "An error occurred." });
      }
      if (results.length === 0) {
          return res.status(404).json({ success: false, message: "No member found." });
      }
      res.status(200).json({success: true, data: results});
  });
});

app.post("/api/orders", (req, res) => {
  const orderData = req.body.order;

  if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
    return res.status(400).json({ message: "Invalid or missing order data." });
  }

  if (
    !orderData.customer.email ||
    !orderData.customer.email.includes("@") ||
    !orderData.customer.name ||
    !orderData.customer.street ||
    !orderData.customer["postal-code"] ||
    !orderData.customer.city
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code, or city is required.",
    });
  }

  const customerJson = JSON.stringify(orderData.customer);
  const itemsJson = JSON.stringify(orderData.items);

  const orderQuery = `
    INSERT INTO orders (customer, items)
    VALUES (?, ?)
  `;

  db.query(orderQuery, [customerJson, itemsJson], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ message: "Failed to create order." });
    }

    res.status(201).json({ message: "Order created successfully!" });
  });
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.listen(PORT, () => {
  console.log(`React app listening on port ${PORT}`);
});
