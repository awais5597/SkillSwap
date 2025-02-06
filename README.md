# SkillSwap

Project Setup Instructions

Prerequisites
Before beginning the setup procedure, make sure the following software is installed on your computer:
Node.js
XAMPP

Frontend Configuration (FE)
Locate the Folder for FE:
After extracting the project files, open a terminal and navigate to the frontend (FE) folder.

Set up the dependencies:
Run the following command to install the dependencies for the project:
npm install
Launch the Frontend:
To initiate the frontend, use the following command:
npm start

Backend (BE) Configuration
Place the BE Folder:
Put the backend (BE) folder into the htdocs directory of your XAMPP installation.

Start XAMPP Services:
Open XAMPP and start both the Apache and MySQL services.

Setup of a Database:

Access http://localhost/phpmyadmin/ using your web browser.
Choose a name for your new database that matches the database connection file.
Open the newly created database and import the SQL file that came with the code. The initial data and the required database structure are included in this file.

Executing the Project
Now that the frontend and backend have been configured, you are able to access and work with the project. To access the frontend application, open your web browser and type http://localhost:3000/ into the URL bar.
