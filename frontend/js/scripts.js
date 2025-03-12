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
    let role = document.getElementById("role");
    let adminPasswordField = document.getElementById("adminPasswordField");
    if (role && adminPasswordField) {
        adminPasswordField.style.display = role.value === "Admin" ? "block" : "none";
    }
}
function validatePasswords() {
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let errorMessage = document.getElementById("passwordError");
    if (password && confirmPassword && errorMessage) {
        errorMessage.style.display = password.value !== confirmPassword.value && confirmPassword.value.length > 0 ? "block" : "none";
    }
}
function initializeRegisterView() {
    let roleSelect = document.getElementById("role");
    let registerForm = document.getElementById("registerForm");
    if (roleSelect) {
        roleSelect.addEventListener("change", toggleAdminPassword);
    }
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            let role = document.getElementById("role");
            let adminPassword = document.getElementById("adminPassword");
            let adminPasswordField = document.getElementById("adminPasswordField");
            let password = document.getElementById("password");
            let confirmPassword = document.getElementById("confirmPassword");
            if (role && role.value === "Admin" && adminPassword && adminPasswordField) {
                adminPasswordField.style.display = "block";
                const correctAdminPassword = "adminadmin";
                if (adminPassword.value !== correctAdminPassword) {
                    event.preventDefault();
                    alert("Incorrect Admin Password!");
                }
            }
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                event.preventDefault();
                alert("Passwords don't match!");
            }
        });
    }
}
$(document).on("spapp:ready", function (event) {
    if (event.detail === "#register") {
        setTimeout(initializeRegisterView, 100);
    }
});
window.addEventListener("hashchange", function () {
    if (window.location.hash === "#register") {
        setTimeout(initializeRegisterView, 100);
    }
});
if (window.location.hash === "#register") {
    setTimeout(initializeRegisterView, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = ''; 
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>';
            cartTotal.textContent = "0.00KM";
            return;
        }
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price;
            total += itemTotal;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} KM</td>
                <td>1</td>
                <td>${itemTotal} KM</td>
                <td><button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Remove</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });
    
        cartTotal.textContent = total.toFixed(2) + " KM";
    }
    document.addEventListener('DOMContentLoaded', renderCart);
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            const product = {
                id: productId,
                name: productName,
                price: productPrice
            };

            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${productName} has been added to your cart.`);
        });
    });
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart')) {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        });
    }
    updateCartCount();
    if (cartItemsContainer) renderCart();
});