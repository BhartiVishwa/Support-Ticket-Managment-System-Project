document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const ticketForm = document.getElementById("ticketForm");
  ticketForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ticket = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
    };

    const res = await fetch("http://localhost:5000/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticket),
    });

    if (res.ok) {
      alert("Ticket created successfully");
      window.location.href = "dashboard.html";
    } else {
      const data = await res.json();
      alert(data.message || "Error creating ticket");
    }
  });
});