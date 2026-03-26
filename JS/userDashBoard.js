const token=localStorage.getItem("token");
const user=JSON.parse(localStorage.getItem("user"));
if(!token||!user){//chech if user logged in
    alert("please login");
    window.location.href="login.html";
}

const campaignsTable=document.getElementById("campaignsTable");
const profileForm=document.getElementById("profileForm");
const userName=document.getElementById("userName");
const email=document.getElementById("email");
const password=document.getElementById("password");

profileForm.addEventListener('submit',async function(event){//udates user data
    event.preventDefault();//stop browser from executing default actions
    const userUpdate={
        name:userName.value.trim()||user.name,//trim removes any white space usernew value or old 
        email:email.value.trim()||user.email,
        password:password.value.trim()||user.password
    };
    try {
    const response = await fetch(`http://localhost:3000/users/${user.id}`, {//connect with the server
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,//sends the token to the server
      },
      body: JSON.stringify(userUpdate),
    });
    if(!response)
        throw new Error("Failed to update");
    const data=await response.json();//the data returned from the server
    localStorage.setItem("user",JSON.stringify(data));//updates user data
    alert("User Updated");
    window.location.reload();
    }catch(error){
        console.error(error.message);
        alert("Error in updating");

    }
});
async function fetchCampaigns(){
    try{
        const response=await fetch("http://localhost:3000/campaigns",{
            headers:{Authorization:`Bearer ${token}`},
        });
        if(!response.ok)
            throw new Error("Failed to fetch campaigns");
        let campaigns=await response.json();
        campaigns=campaigns.filter((c)=>c.creatorId===user.id&&c.isApproved===true);//returns approved campaigns of user
        displayCampaigns(campaigns);
    }catch(error){
        console.error(error.message);
        campaignsTable.innerHTML="<tr><td colspan='5' style='color:blue;'>Failed to load campaigns</td></tr>";
    }
}

//display user campaigns
function displayCampaigns(campaigns){
    campaignsTable.innerHTML="";
    if (campaigns.length === 0) {
        campaignsTable.innerHTML ="<tr><td colspan='5'>No approved campaigns yet.</td></tr>";
        return;
    }
    campaigns.forEach(c => {
        const row=document.createElement("tr");//creates new row in the campaignstable
        row.innerHTML = `
      <td>${c.title}</td>
      <td>$${c.goal}</td>
      <td>${c.deadline}</td>
      <td><img src="${c.image}" alt="campaign"></td>
      <td>
        <button class="update-btn" onclick="updateCampaign(${c.id})">Update</button>
        <button class="delete-btn" onclick="deleteCampaign(${c.id})">Delete</button>
      </td>
    `;
    campaignsTable.appendChild(row);//add the created row
        
    });
}

async function updateCampaign(id) {
    const newTitle=prompt("Enter new title: ");
    const newGoal=prompt("Enter new goal:");
    const newDeadline=prompt("Enter new deadline:");
    try{
         const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...(newTitle && { title: newTitle }),
                ...(newGoal && { goal: parseFloat(newGoal) }),
                ...(newDeadline && { deadline: newDeadline }),
            }),
        });
        if(!response)
            throw new Error("Failed to update campaign");
        alert("Campaigns update");
        fetchCampaigns();
    }
    catch(error){
        console.error(error.message);
        alert("Error in updating");
    }
}
async function deleteCampaign(id) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try{
        const response=await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if(!response)
            throw new Error("Failed to delete campaigns");
        alert("Campaign deleted");
        fetchCampaigns();
    }catch(error){
        console.error(error.message);
        alert("Error in deleting");
    }
}
function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href="index.html";
}
fetchCampaigns();//load user campaigns
