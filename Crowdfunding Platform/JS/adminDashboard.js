const display = document.getElementById("display");
const usersBtn = document.getElementById("users");
const campaignsBtn = document.getElementById("compaigns");
const pledges = document.getElementById("pledges");
const logout = document.getElementById("logout");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

logout.addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
});


usersBtn.addEventListener("click", async function () {
  const response = await fetch("http://localhost:3000/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const users = await response.json();

  display.innerHTML = `
  <h2>Users</h2>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (u) => `
          <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>
              <button class="btn delete banbtn" 
                      data-id="${u.id}" 
                      data-active="${u.isActive}">
                ${u.isActive === false ? "Unban" : "Ban"}
              </button>

              <button class="btn ${
                u.role === "admin" ? "unapprove" : "approve"
              } rolebtn"
                data-id="${u.id}"
                data-role="${u.role}">
                ${u.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `;

  // Ban / Unban
  document.querySelectorAll(".banbtn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = btn.dataset.id;
      const isActive = btn.dataset.active === "true";
      await banUser(id, !isActive);
    });
  });

  // Role Change
  document.querySelectorAll(".rolebtn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = btn.dataset.id;
      const newRole = btn.dataset.role === "admin" ? "user" : "admin";
      await roleChanging(id, newRole);
    });
  });
});

async function banUser(id, activate) {
  const response= await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive: activate }),
  });

  if (response.ok) usersBtn.click();
}

async function roleChanging(id, newRole) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: newRole }),
  });

  if (response.ok) usersBtn.click();
}



campaignsBtn.addEventListener("click", async function () {
    console.log("Campaign button clicked");
  const response = await fetch("http://localhost:3000/campaigns", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const campaigns = await response.json();

  display.innerHTML = `
  <h2>Campaigns</h2>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Title</th><th>Goal</th><th>Deadline</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${campaigns
          .map(
            (c) => `
          <tr>
            <td>${c.id}</td>
            <td>${c.title}</td>
            <td>$${c.goal}</td>
            <td>${c.deadline}</td>
            <td>${c.isApproved ? "Approved ✅" : "Pending ⏳"}</td>
            <td>
              <button class="btn ${
                c.isApproved ? "unapprove" : "approve"
              } approvebtn" 
                data-id="${c.id}" 
                data-status="${c.isApproved}">
                ${c.isApproved ? "Unapprove" : "Approve"}
              </button>

              <button class="btn delete deletebtn" 
                data-id="${c.id}">
                Delete
              </button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `;

  // approve / unapprove
  document.querySelectorAll(".approvebtn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = btn.dataset.id;
      const status = btn.dataset.status === "true";
      await approval(id, !status);
    });
  });

  //delete compaigns
  document.querySelectorAll(".deletebtn").forEach((btn)=>{
    btn.addEventListener('click',async function(){
        const id=btn.dataset.id;
        await deleteCompaign(id);
    })
  });

});

async function approval(id, status) {
  const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isApproved: status }),
  });

  if (response.ok) campaignsBtn.click();
}

async function deleteCompaign(id){
     const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) campaignsBtn.click();
}

//pledges
pledges.addEventListener("click", async function () {
    console.log("Campaign button clicked");
  try {
    const [pledgesReq, campaignsReq, usersReq] = await Promise.all([
      fetch("http://localhost:3000/pledges", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:3000/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const pledgesRes = await pledgesReq.json();
    const campaignsRes = await campaignsReq.json();
    const usersRes = await usersReq.json();

    display.innerHTML = `
      <h2>Pledges</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Campaign</th>
              <th>User</th>
              <th>Amount</th>
              <th>Remaining Goal</th>
            </tr>
          </thead>
          <tbody>
            ${pledgesRes
              .map((p) => {
                const u = usersRes.find(
                  (x) => String(x.id) === String(p.userId)
                );

                const c = campaignsRes.find(
                  (x) => String(x.id) === String(p.campaignId)
                );

                const remaining = c ? Math.max(c.goal - p.amount, 0) : 0;

                return `
                  <tr>
                    <td>${p.id}</td>
                    <td>${c ? c.title : "Unknown"}</td>
                    <td>${u ? u.name : "Unknown"}</td>
                    <td>$${p.amount}</td>
                    <td>$${remaining}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
});