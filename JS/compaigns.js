const myCampaignsBtn = document.getElementById("myCampaignsBtn");
const allCampaignsBtn = document.getElementById("allCampaignsBtn");
const campaignsList = document.getElementById("campaignsList");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Redirect if not logged in
if (!token || !user) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Fetch campaigns
async function fetchCampaigns(filter = "all") {
    try {
        const response = await fetch("http://localhost:3000/campaigns", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); 

        if (!response.ok) throw new Error("Failed to fetch campaigns");

        let campaigns = await response.json();

        // Only approved campaigns
        campaigns = campaigns.filter(c => c.isApproved === true);

        // Filter by "my campaigns"
        if (filter === "my") {
            campaigns = campaigns.filter(c => c.creatorId === user.id);
        }

        displayCampaigns(campaigns, filter);

    } catch (error) {
        console.error(error);
        campaignsList.innerHTML = `<p style="text-align:center; color:red;">Failed to load campaigns</p>`;
    }
}

// Display campaigns
function displayCampaigns(campaigns, filter) {
    campaignsList.innerHTML = "";

    if (campaigns.length === 0) {
        campaignsList.innerHTML = `<p style="text-align:center; color=blue;">
            ${filter === "my" ? "You don't have any campaigns yet." : "No campaigns available yet."}
        </p>`;
        return;
    }

    campaigns.forEach(c => {
        const card = document.createElement("div");
        card.className = "campaign-container";
        card.innerHTML = `
            <img src="${c.image}" alt="Campaign Image" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
            <h3>${c.title}</h3>
            <p><strong>Goal:</strong> $${c.goal}</p> 
            <p><strong>Deadline:</strong> ${c.deadline}</p>
            <button class="donate-btn">Donate</button>
        `;

        card.querySelector(".donate-btn").addEventListener("click", () => {
            if (c.goal <= 0) {
                alert("This campaign is already completed!");
                return;
            }
            window.location.href = "pledges.html?campaignId=" + c.id;
        });

        campaignsList.appendChild(card);
    });
}

// Button listeners
myCampaignsBtn.addEventListener("click", () => {
    fetchCampaigns("my");
});

allCampaignsBtn.addEventListener("click", () => {
    fetchCampaigns("all");
});

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// Initial load
fetchCampaigns("all");