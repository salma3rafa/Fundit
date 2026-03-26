const loginform = document.getElementById("loginform");
const email = document.getElementById("email");
const password = document.getElementById("password");

loginform.addEventListener('submit', async function(event) {
    event.preventDefault();
    const emailInput = email.value;
    const passwordInput = password.value;

    try {
        const response = await fetch(`http://localhost:3000/users?email=${emailInput}&password=${passwordInput}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Server responded with an error");
        }

        const data = await response.json(); 

        if (data.length > 0) {
            const loggedUser = data[0]; // Get the first matching user

            console.log("Logged in successfully!");
            
            localStorage.setItem("user", JSON.stringify(loggedUser));//store user

            if (!loggedUser.isActive) {
                alert("You are banned");
            } 
            else if (loggedUser.isActive === true && loggedUser.role === "user") {
                alert("Logged in successfully!");
                window.location.href = "compaigns.html";
            } 
            else if (loggedUser.isActive === true && loggedUser.role === "admin") {
                alert("Logged in successfully!");
                window.location.href = "adminDashboard.html";
            }
        } else {
            alert("Invalid email or password!");
        }

    } catch (error) {
        console.error(error.message);
        alert("Failed to login!");
    }
});