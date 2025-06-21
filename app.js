const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "./.env") });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route: Show login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

// New route to get current user info
app.get("/auth/me", require("./middleware/auth"), async (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, role: req.user.role });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on: http://localhost:${PORT}`));