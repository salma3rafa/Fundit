function continueAsGuest() {
    localStorage.removeItem('userToken');
    localStorage.setItem('userRole', 'guest');

    const campaignSection = document.getElementById('funds');
    if (campaignSection) {
        campaignSection.scrollIntoView({ behavior: 'smooth' });
    }

    console.log("Browsing as Guest: Fetching public campaigns...");
    fetchApprovedCampaigns();
}
function updateUIForGuest() {
    const role = localStorage.getItem('userRole');
    if (role === 'guest') {
        const donateButtons = document.querySelectorAll('.donate-btn');
        donateButtons.forEach(btn => {
            btn.innerHTML = "Log in to Donate";
            btn.style.backgroundColor = "#ccc";
        });
    }
}