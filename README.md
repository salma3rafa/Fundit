Fundit – Funding Campaign Platform
Fundit is a web-based platform that allows users to create, manage, and support funding campaigns.
The system includes role-based access (Guest, User, Admin) and simulates a real backend using a local JSON database.

Overview

Fundit provides a complete flow for crowdfunding:

Guests can browse approved campaigns
Users can register, create campaigns, and donate
Admins manage the platform by approving campaigns and controlling users

✨ Features
👤 Guest
View all approved campaigns
Explore campaign details
🙋 User
Register and login
Create new funding campaigns
Donate to campaigns
View own campaigns
🛡️ Admin
Approve or reject campaigns
Delete campaigns
View all users
Ban/unban users
Monitor platform activity

Tech Stack
Frontend: HTML, CSS, JavaScript
Backend (Mock API): json-server
Database: db.json

How to Run the Project
1. Clone the repository
git clone https://github.com/salma3rafa/Fundit.git
cd Fundit
2. Install json-server
npm install -g json-server
3. Run the backend server
json-server --watch db.json --port 3000
4. Start the application

Open index.html in your browser.


🔐 Roles & Permissions
Role	Permissions
Guest	View approved campaigns
User	Create campaigns, donate
Admin	Approve/reject campaigns, manage users
