const API_URL = "http://localhost:3000";


async function loadApprovedCampaigns() {
    try {
        const [campaignsRes, pledgesRes] = await Promise.all([
            fetch(`${API_URL}/campaigns`),
            fetch(`${API_URL}/pledges`)
        ]);

        let campaigns = await campaignsRes.json();
        const pledges = await pledgesRes.json();

        campaigns = campaigns.filter(c => c.isApproved === true);

        campaigns.forEach(campaign => {//calc total pledges of compaign
            const totalPledged = pledges
                .filter(p => String(p.campaignId) === String(campaign.id))
                .reduce((sum, p) => sum + p.amount, 0);
            campaign.currentAmount = totalPledged;
        });

        displayCampaigns(campaigns);

    } catch (error) {
        console.error(error.message);
    }
}

function displayCampaigns(data) {
    const container = document.getElementById("campaignContainer");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p style='text-align:center'>No campaigns found.</p>";
        return;
    }

    data.forEach(item => {
        const card = `
        <div class="campaign">
            <img src="${item.image || 'images/placeholder.jpg'}" alt="campaign">
            <div class="detail">
                <span>Category: ${item.category || "General"}</span>
                <h6>${item.title}</h6>
                <p>${item.description}</p>
                <div class="progress">
                    <span>Goal: <strong>$${item.goal}</strong> | Pledges: <strong>$${item.currentAmount || 0}</strong></span>
                </div>
            </div>
            <div class="cost" onclick="alert('Please register to donate!')">
                Donate
            </div>
        </div>
        `;

        container.innerHTML += card;
    });
}

async function handleGuestSearch() {
    const query = document.getElementById("searchInput").value.trim();

    try {
        const [campaignsRes, pledgesRes] = await Promise.all([
            fetch(`${API_URL}/campaigns`),
            fetch(`${API_URL}/pledges`)
        ]);

        let campaigns = await campaignsRes.json();
        const pledges = await pledgesRes.json();

        campaigns = campaigns.filter(c => c.isApproved === true);

        // If search query exists, filter by title/description
        if (query) {
            const q = query.toLowerCase();
            campaigns = campaigns.filter(c => 
                c.title.toLowerCase().includes(q) || 
                (c.description && c.description.toLowerCase().includes(q))
            );
        }

        campaigns.forEach(campaign => {
            const totalPledged = pledges
                .filter(p => String(p.campaignId) === String(campaign.id))
                .reduce((sum, p) => sum + p.amount, 0);
            campaign.currentAmount = totalPledged;
        });

        displayCampaigns(campaigns);

    } catch (error) {
        console.error("Search error:", error);
    }
}

// Load campaigns when page opens
window.onload = loadApprovedCampaigns;