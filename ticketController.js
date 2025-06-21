const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const ticket = await Ticket.create({ title, description, priority, createdBy: req.user._id });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
};

exports.getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user._id });
  res.json(tickets);
};

exports.getAllTickets = async (req, res) => {
  const { search, status, priority, page = 1, limit = 5 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: "i" };

  try {
    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Not found" });
  if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role === "user") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Not found" });
  if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role === "user") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};