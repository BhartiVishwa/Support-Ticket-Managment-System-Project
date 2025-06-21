const token = localStorage.getItem("token");
let userRole = "user";
let currentPage = 1;
const limit = 5;

const fetchUserInfo = async () => {
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  const res = await fetch("http://localhost:5000/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }
  const data = await res.json();
  userRole = data.role;
  renderUserInfo();
  fetchTickets();
};

const renderUserInfo = () => {
  const userInfoDiv = document.getElementById("userInfo");
  userInfoDiv.innerHTML = `
    <p>Welcome, <strong>${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</strong>!</p>
    ${userRole === "admin" ? '<p><a href="admin.html">Go to Admin Panel</a></p>' : ""}
  `;
  const createTicketButton = document.getElementById("createTicketButton");
  if (userRole === "user") {
    createTicketButton.innerHTML = `<button onclick="window.location.href='create-ticket.html'">Create Ticket</button>`;
  }
};

const fetchTickets = async () => {
  const search = document.getElementById("search")?.value || "";
  const status = document.getElementById("filterStatus")?.value || "";
  const priority = document.getElementById("filterPriority")?.value || "";

  let url = userRole === "user"
    ? `http://localhost:5000/tickets/my`
    : `http://localhost:5000/tickets?search=${search}&status=${status}&priority=${priority}&page=${currentPage}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    alert("Error fetching tickets");
    return;
  }
  const data = await res.json();
  const tickets = userRole === "user" ? data : data.tickets;
  const totalPages = data.totalPages || 1;
  renderTickets(tickets);
  renderPagination(totalPages);
};

const renderTickets = (tickets) => {
  const tbody = document.querySelector("#ticketTable tbody");
  tbody.innerHTML = "";
  tickets.forEach((ticket) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ticket.title}</td>
      <td>${ticket.description}</td>
      <td>${ticket.priority}</td>
      <td>
        <select onchange="updateStatus('${ticket._id}', this.value)">
          <option value="open" ${ticket.status === "open" ? "selected" : ""}>Open</option>
          <option value="in-progress" ${ticket.status === "in-progress" ? "selected" : ""}>In Progress</option>
          <option value="resolved" ${ticket.status === "resolved" ? "selected" : ""}>Resolved</option>
          <option value="closed" ${ticket.status === "closed" ? "selected" : ""}>Closed</option>
        </select>
      </td>
      <td>
        <button onclick="deleteTicket('${ticket._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

const renderPagination = (totalPages) => {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active-page" : "";
    btn.onclick = () => {
      currentPage = i;
      fetchTickets();
    };
    paginationDiv.appendChild(btn);
  }
};

const updateStatus = async (ticketId, newStatus) => {
  const res = await fetch(`http://localhost:5000/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (res.ok) {
    fetchTickets();
  } else {
    alert("Error updating ticket");
  }
};

const deleteTicket = async (ticketId) => {
  const res = await fetch(`http://localhost:5000/tickets/${ticketId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    fetchTickets();
  } else {
    alert("Error deleting ticket");
  }
};

document.getElementById("applyFilters")?.addEventListener("click", () => {
  currentPage = 1;
  fetchTickets();
});

fetchUserInfo();