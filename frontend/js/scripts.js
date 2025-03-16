/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

if (typeof products === 'undefined') {
    var products = [
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
}

var filteredProducts = products;

function renderProducts(products, currentPage = 1, itemsPerPage = 9) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const productCard = `
            <div class="col mb-3">
                <div class="card h-100 d-flex flex-column">
                    ${product.sale ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                    <img class="card-img-top" src="${product.image}" alt="${product.name}" />
                    <div class="card-body d-flex flex-column justify-content-between text-center">
                        <h5 class="fw-bolder">${product.name}</h5>
                        <div class="price" style="min-height: 30px;">
                            ${product.sale ? `<span class="text-muted text-decoration-line-through">${product.sale}</span> ` : ''}${product.price}KM
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
                        <button class="btn btn-outline-dark mt-auto add-to-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-price="${product.price}">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeEventListener('click', addToCart); 
        button.addEventListener('click', addToCart); 
    });
}

function renderPagination(totalItems, currentPage = 1, itemsPerPage = 9) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevPage = `<li class="page-item"><a class="page-link" href="#" data-page="prev">Previous</a></li>`;
    pagination.insertAdjacentHTML('beforeend', prevPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        pagination.insertAdjacentHTML('beforeend', pageItem);
    }

    const nextPage = `<li class="page-item"><a class="page-link" href="#" data-page="next">Next</a></li>`;
    pagination.insertAdjacentHTML('beforeend', nextPage);
}

function initializePagination() {
    const itemsPerPage = 9;
    let currentPage = 1;

    function handlePageClick(event) {
        event.preventDefault();
        const page = event.target.getAttribute('data-page');
        if (page === 'prev') {
            if (currentPage > 1) currentPage--;
        } else if (page === 'next') {
            if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) currentPage++;
        } else {
            currentPage = parseInt(page);
        }
        renderProducts(filteredProducts, currentPage, itemsPerPage);
    }

    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.removeEventListener('click', handlePageClick); 
        pagination.addEventListener('click', handlePageClick); 
        renderPagination(filteredProducts.length, currentPage, itemsPerPage);
        renderProducts(filteredProducts, currentPage, itemsPerPage);
    }
}

function initializeCategoryFilters() {
    const categoryFilters = document.getElementById('category-filters');

    function filterProductsByCategory() {
        const selectedCategories = Array.from(categoryFilters.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent);
        filteredProducts = selectedCategories.length > 0 
            ? products.filter(product => selectedCategories.includes(product.category)) 
            : products;
        renderProducts(filteredProducts);
        renderPagination(filteredProducts.length);
    }

    if (categoryFilters) {
        categoryFilters.removeEventListener('change', filterProductsByCategory); 
        categoryFilters.addEventListener('change', filterProductsByCategory); 

        renderProducts(filteredProducts);
        renderPagination(filteredProducts.length);
    }
}

function initializeAllProductsPage() {
    initializePagination();
    initializeCategoryFilters();
}

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

function addToCart(event) {
    event.preventDefault(); 
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const button = event.currentTarget;
    const itemId = button.getAttribute('data-id');
    const itemName = button.getAttribute('data-name');
    const itemPrice = button.getAttribute('data-price');
    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        const item = {
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1
        };
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    console.log('Item added to cart:', { id: itemId, name: itemName, price: itemPrice, quantity: 1 });
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
        const itemTotal = parseFloat(item.price) * item.quantity || 0; 
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price} KM</td>
            <td>
                <div class="input-group input-group-sm" style="width: 120px;">
                    <button class="btn btn-outline-secondary btn-sm-width quantity-decrease" type="button" data-index="${index}">-</button>
                    <input type="number" class="form-control cart-quantity text-center" data-index="${index}" value="${item.quantity}" min="1" readonly>
                    <button class="btn btn-outline-secondary btn-sm-width quantity-increase" type="button" data-index="${index}">+</button>
                </div>
            </td>
            <td>${itemTotal.toFixed(2)} KM</td>
            <td><button class="btn btn-sm btn-danger remove-from-cart" data-index="${index}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotal.textContent = `${total.toFixed(2)}KM`;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
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