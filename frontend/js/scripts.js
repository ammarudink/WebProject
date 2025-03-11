/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var app = $.spapp({
    defaultView: "#dashboard",
    templateDir: "./frontend/views/"
});
app.run();


function toggleAdminPassword() {
    let role = document.getElementById("role").value;
    let adminPasswordField = document.getElementById("adminPasswordField");

    if (role === "Admin") {
        adminPasswordField.style.display = "block";
    } else {
        adminPasswordField.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("role").addEventListener("change", toggleAdminPassword);
    
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        let role = document.getElementById("role").value;
        let adminPassword = document.getElementById("adminPassword").value;
        let adminPasswordField = document.getElementById("adminPasswordField");
        if (role === "Admin") {
            adminPasswordField.style.display = "block";
            const correctAdminPassword = "adminadmin";
            if (adminPassword !== correctAdminPassword) {
                event.preventDefault(); 
                alert("Incorrect Admin Password!"); 
            }
        }
    });
});

function validatePasswords() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorMessage = document.getElementById("passwordError");

    if (password !== confirmPassword && confirmPassword.length > 0) {
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}
document.getElementById("registerForm").addEventListener("submit", function (event) {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        event.preventDefault();
        alert("Passwords don't match!");
    }
});