const token = localStorage.getItem("token");
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
  if (!res.ok || (await res.json()).role !== "admin") {
    alert("Access Denied");
    window.location.href = "dashboard.html";
    return;
  }
  fetchUsers();
  fetchTickets();
};

const fetchUsers = async () => {
  const res = await fetch("http://localhost:5000/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await res.json();
  renderUsers(users);
};

const renderUsers = (users) => {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <select onchange="updateRole('${user._id}', this.value)">
          <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
          <option value="agent" ${user.role === "agent" ? "selected" : ""}>Agent</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
      <td>
        <select onchange="updateStatus('${user._id}', this.value)">
          <option value="active" ${user.status === "active" ? "selected" : ""}>Active</option>
          <option value="inactive" ${user.status === "inactive" ? "selected" : ""}>Inactive</option>
        </select>
      </td>
      <td>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

const updateRole = async (userId, newRole) => {
  const res = await fetch(`http://localhost:5000/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: newRole }),
  });
  if (res.ok) {
    fetchUsers();
  } else {
    alert("Error updating role");
  }
};

const updateStatus = async (userId, newStatus) => {
  const res = await fetch(`http://localhost:5000/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (res.ok) {
    fetchUsers();
  } else {
    alert("Error updating status");
  }
};

const deleteUser = async (userId) => {
  const res = await fetch(`http://localhost:5000/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    fetchUsers();
  } else {
    alert("Error deleting user");
  }
};

const fetchTickets = async () => {
  const search = document.getElementById("search")?.value || "";
  const status = document.getElementById("filterStatus")?.value || "";
  const priority = document.getElementById("filterPriority")?.value || "";

  const url = `http://localhost:5000/tickets?search=${search}&status=${status}&priority=${priority}&page=${currentPage}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  renderTickets(data.tickets);
  renderPagination(data.totalPages);
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
        <select onchange="updateTicketStatus('${ticket._id}', this.value)">
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

const updateTicketStatus = async (ticketId, newStatus) => {
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