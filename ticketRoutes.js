const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

router.post("/", protect, authorizeRoles("user"), createTicket);
router.get("/my", protect, authorizeRoles("user"), getMyTickets);
router.get("/", protect, authorizeRoles("agent", "admin"), getAllTickets);
router.patch("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

module.exports = router;
