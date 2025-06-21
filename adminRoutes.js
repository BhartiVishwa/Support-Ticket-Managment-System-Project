const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} = require("../controllers/adminController");

// ✅ Admin-only routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.patch("/users/:id/status", protect, authorizeRoles("admin"), toggleUserStatus);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;