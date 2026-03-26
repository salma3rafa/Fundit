const donateForm = document.getElementById("donateForm");
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("You must be logged in to pledge.");
  window.location.href = "login.html";
}

const url = new URLSearchParams(window.location.search);
const campaignId = parseInt(url.get("campaignId"));

donateForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const expire = document.getElementById("expire").value;
  const amount = parseFloat(document.getElementById("amount").value.trim());

  if (amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {


    const campaignRes = await fetch(`http://localhost:3000/campaigns/${campaignId}`);
    const campaign = await campaignRes.json();

    if (campaign.goal === 0) {
      alert("This campaign has already reached its goal.");
      return;
    }

    if (amount > campaign.goal) {
      alert(`The maximum you can donate is ${campaign.goal}`);
      return;
    }

    const pledge = {
      campaignId: campaignId,
      userId: user.id,
      amount: amount,
    };

    const response = await fetch("http://localhost:3000/pledges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pledge),
    });

    if (!response.ok) {
      throw new Error("Failed to create pledge");
    }
    const remainGoal = campaign.goal - amount;

    const updateCampaign = await fetch(
      `http://localhost:3000/campaigns/${campaignId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: remainGoal }),
      }
    );

    if (!updateCampaign.ok) {
      throw new Error("Failed to update campaign!");
    }

    window.location.href = "compaigns.html";

  } catch (error) {
    console.error(error.message);
  }
});