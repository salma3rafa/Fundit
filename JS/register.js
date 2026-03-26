const container = document.getElementById("container");
const registerBtn = document.getElementById("register"); 
const loginBtn = document.getElementById("login");       


const registerForm = document.getElementById("registerform"); 
const fullname = document.getElementById("fullname");
const emailReg = document.getElementById("email_reg");
const passwordReg = document.getElementById("password_reg");


registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

registerForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const user = {
        name: fullname.value,
        email: emailReg.value,
        password: passwordReg.value,
        role: "user",
        isActive: true
    };

    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!response.ok) throw new Error("Server error");
        console.log("Attempting to redirect...");
        alert("User Registered Successfully!");
        window.location.href = "../login.html";
    } catch(error) {
        console.error(error.message); 
        alert("Registration failed");
    }
});