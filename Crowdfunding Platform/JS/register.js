const register=document.getElementById("register");
const fullname=document.getElementById("fullname");
const email=document.getElementById("email");
const password=document.getElementById("password");

register.addEventListener('submit',async function(event){
    event.preventDefault();//to refresh
    const user={
        name:fullname.value,
        email: email.value,
        password: password.value,
        role:"user",
        isActive: true
    };
    try{
        const response=await fetch("http://localhost:3000/users", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error("Server responded with an error");
        }
        alert(`user Registered successfull`);
        /*setTimeout(() => {
            window.location.href = "login.html";
        }, 500);*/
        window.location.href = "login.html";
    }catch(error)
    {
        console.error(error.message);
        alert("Registeration failed!")
    }

});