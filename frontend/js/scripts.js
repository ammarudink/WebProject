/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// All products
const products = [
    { id: 1, name: "Predator X34 X5 OLED Gaming Monitor", price: 349, sale: false, category: "Monitors", image: "frontend/assets/PredatorX34Monitor.jpg" },
    { id: 2, name: "Redragon Spider Queen C602", price: 200, sale: "240KM", category: "Gaming Chairs", image: "frontend/assets/RedragonSpiderChair.jpg" },
    { id: 3, name: "SONY Playstation 5", price: 999, sale: "1199KM", category: "Consoles", image: "frontend/assets/Playstation5.jpg" },
    { id: 4, name: "Gamepad SONY Dualsense 5", price: 159, sale: false, category: "Consoles", image: "frontend/assets/Ps5Gamepad.jpg" },
    { id: 5, name: "SONY Headphones 2025", price: 99, sale: "129KM", category: "Accessories", image: "frontend/assets/SONYHeadphones.jpg" },
    { id: 6, name: "ROG Delta S Headset", price: 299, sale: false, category: "Accessories", image: "frontend/assets/ROGDeltaSGamingHeadset.jpg" },
    { id: 7, name: "Asus ROG Keyboard", price: 299, sale: "359KM", category: "Accessories", image: "frontend/assets/ASUSRogTastatura.jpg" },
    { id: 8, name: "RGS-622 Gaming Mouse", price: 79, sale: false, category: "Accessories", image: "frontend/assets/RGS-622GamingMouse.jpg" },
    { id: 9, name: "Odyssey G5 Gaming Monitor", price: 279, sale: false, category: "Monitors", image: "frontend/assets/OdysseyG5Monitor.jpg" },
    { id: 10, name: "Odyssey G7 Gaming Monitor", price: 320, sale: false, category: "Monitors", image: "frontend/assets/OdysseyG7Monitor.jpg" },
    { id: 11, name: "Cooler Master CK-530 Keyboard", price: 179, sale: false, category: "Accessories", image: "frontend/assets/CoolerMasterCK530Keyboard.jpg" }
];

function toggleAdminPasswordField() {
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

function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemId = $(this).data('id');
    const itemName = $(this).data('name');
    const itemPrice = $(this).data('price');
    const item = {
        id: itemId,
        name: itemName,
        price: itemPrice
    };
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    console.log('Item added to cart:', item);
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
        const itemTotal = parseFloat(item.price) || 0; 
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price} KM</td>
            <td>1</td>
            <td>${itemTotal.toFixed(2)} KM</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotal.textContent = `${total.toFixed(2)}KM`;
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart)); 
        renderCart(); 
        updateCartCount(); 
    }
}
