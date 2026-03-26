const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const loginform = document.getElementById("loginform");
const email = document.getElementById("email");
const password = document.getElementById("password");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});
 
loginform.addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailInput = email.value.trim();
    const passwordInput = password.value.trim();

    if (!emailInput || !passwordInput) {
        alert("Please enter both email and password!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users?email=${emailInput}&password=${passwordInput}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Server responded with an error");

        const data = await response.json(); 

        if (data.length > 0) {
            const loggedUser = data[0];//return first matched user

            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(loggedUser));

            // Store a dummy token using date 
            const token = btoa(`${loggedUser.id}:${Date.now()}`);
            localStorage.setItem("token", token);

            if (!loggedUser.isActive) {
                alert("You are banned!");
            } else if (loggedUser.role === "user") {
                alert("Logged in successfully!");
                window.location.href = "compaigns.html";
            } else if (loggedUser.role === "admin") {
                alert("Logged in successfully!");
                window.location.href = "adminDashboard.html";
            }

        } else {
            alert("Invalid email or password!");
        }

    } catch (error) {
        console.error("Login error:", error.message);
        alert("Failed to connect to server. Make sure json-server is running!");
    }
}); 