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
        { id: 2, name: "Redragon Spider Queen C602", price: 240, sale: "200KM", category: "Gaming Chairs", image: "frontend/assets/RedragonSpiderChair.jpg" },
        { id: 3, name: "SONY Playstation 5", price: 1199, sale: "999KM", category: "Consoles", image: "frontend/assets/Playstation5.jpg" },
        { id: 4, name: "Gamepad SONY Dualsense 5", price: 159, sale: false, category: "Consoles", image: "frontend/assets/Ps5Gamepad.jpg" },
        { id: 5, name: "SONY Headphones 2025", price: 129, sale: "99KM", category: "Accessories", image: "frontend/assets/SONYHeadphones.jpg" },
        { id: 6, name: "ROG Delta S Headset", price: 299, sale: false, category: "Accessories", image: "frontend/assets/ROGDeltaSGamingHeadset.jpg" },
        { id: 7, name: "Asus ROG Keyboard", price: 359, sale: "299KM", category: "Accessories", image: "frontend/assets/ASUSRogTastatura.jpg" },
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
                            ${product.sale ? `<span class="text-muted text-decoration-line-through">${product.price}KM</span> ${product.sale}` : `${product.price}KM`}
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

    attachAddToCartListeners();
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

function attachProductLinkListeners() {
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', function(event) {
            const productId = event.currentTarget.getAttribute('data-id');
            localStorage.setItem('selectedProductId', productId);
        });
    });
}

function initializeAllProductsPage() {
    initializePagination();
    initializeCategoryFilters();
    attachProductLinkListeners(); 
}

function toggleAdminPasswordField() {
    let role = document.getElementById("registerRole");
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
    const quantityInput = button.closest('.d-flex') ? button.closest('.d-flex').querySelector('#inputQuantity') : null;
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        const item = {
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity
        };
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    console.log('Item added to cart:', { id: itemId, name: itemName, price: itemPrice, quantity: quantity });
}

function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeEventListener('click', addToCart); 
        button.addEventListener('click', addToCart); 
    });
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
    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
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

function fetchOnSaleItems() {
    const onSaleItems = products.filter(product => product.sale);

    const itemsContainer = document.getElementById('onsale-items');
    itemsContainer.innerHTML = ''; 
    onSaleItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col mb-5';
        itemElement.innerHTML = `
            <div class="card h-100">
                ${item.sale ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${item.name}</h5>
                        <p class="card-text"><del>${item.price}KM</del> ${item.sale}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <button class="btn btn-outline-dark mt-auto add-to-cart" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });
}

function fetchRelatedItems(currentProductId, currentProductCategory) {
    const relatedItems = products.filter(product => product.category === currentProductCategory && product.id !== currentProductId).slice(0, 4);

    const itemsContainer = document.getElementById('related-items');
    itemsContainer.innerHTML = ''; 
    relatedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col mb-5';
        itemElement.innerHTML = `
            <div class="card h-100">
                ${item.sale ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${item.name}</h5>
                        <div class="price" style="min-height: 30px;">
                            ${item.sale ? `<span class="text-muted text-decoration-line-through">${item.sale}</span> ` : ''}${item.price}KM
                        </div>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <button class="btn btn-outline-dark mt-auto add-to-cart" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });

    attachAddToCartListeners();
}

function addToWishlist(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const itemId = button.getAttribute('data-id');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const icon = document.getElementById(`wishlist-icon-${itemId}`);
    
    if (wishlist.includes(itemId)) {
        const index = wishlist.indexOf(itemId);
        wishlist.splice(index, 1);
        icon.src = "frontend/assets/nfheart.png";
    } else {
        wishlist.push(itemId);
        icon.src = "frontend/assets/fheart.png";
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistPage() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    
    if (!wishlistItemsContainer) {
        console.error("Wishlist items container not found");
        return;
    }

    wishlistItemsContainer.innerHTML = ''; 

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<div class="col text-center">Your wishlist is empty.</div>';
        return;
    }

    wishlist.forEach(itemId => {
        const product = products.find(p => p.id == itemId);
        if (product) {
            const itemElement = `
                <div class="col mb-5">
                    <div class="card h-100">
                        ${product.sale ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                        <a href="#product" class="product-link" data-id="${product.id}">
                            <img class="card-img-top" src="${product.image}" alt="${product.name}" />
                        </a>
                        <div class="card-body p-4">
                            <div class="text-center">
                                <a href="#product" class="product-link" data-id="${product.id}">
                                    <h5 class="fw-bolder">${product.name}</h5>
                                </a>
                                <div class="price" style="min-height: 30px;">
                                    ${product.sale ? `<span class="text-muted text-decoration-line-through">${product.price}KM</span> ${product.sale}` : `${product.price}KM`}
                                </div>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
                            <button class="btn btn-outline-dark mt-auto remove-from-wishlist" data-id="${product.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            wishlistItemsContainer.insertAdjacentHTML('beforeend', itemElement);
        }
    });

    attachRemoveFromWishlistListeners();
}

function attachRemoveFromWishlistListeners() {
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function(event) {
            const itemId = event.currentTarget.getAttribute('data-id');
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlist = wishlist.filter(id => id != itemId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistPage();
        });
    });
}

function attachAddToWishlistListeners() {
    document.querySelectorAll('.wishlist-icon').forEach(button => {
        button.removeEventListener('click', addToWishlist);
        button.addEventListener('click', addToWishlist);
    });
}

function loadProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        document.querySelector('.display-5.fw-bolder').textContent = product.name;
        document.querySelector('.fs-5.mb-5 span').textContent = `${product.price}KM`;
        document.querySelector('.lead').textContent = product.description;
        document.querySelector('.card-img-top.mb-5.mb-md-0').src = product.image;
        document.querySelector('.add-to-cart').setAttribute('data-id', product.id);
        document.querySelector('.add-to-cart').setAttribute('data-name', product.name);
        document.querySelector('.add-to-cart').setAttribute('data-price', product.price);
        document.querySelector('.wishlist-icon').setAttribute('data-id', product.id);
        document.querySelector('.wishlist-icon img').id = `wishlist-icon-${product.id}`;
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.includes(product.id.toString())) {
            document.getElementById(`wishlist-icon-${product.id}`).src = "frontend/assets/fheart.png";
        } else {
            document.getElementById(`wishlist-icon-${product.id}`).src = "frontend/assets/nfheart.png";
        }
    }
}

function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    document.getElementById("name").value = user.name || '';
    document.getElementById("email").value = user.email || '';
    document.getElementById("address").value = user.address || '';
    document.getElementById("role").value = user.role || '';
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        alert('Email is already registered.');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const user = {
        name: document.getElementById('registerName').value,
        email: email,
        address: document.getElementById('registerAddress').value,
        password: password,
        role: document.getElementById('registerRole').value
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    updateNavBar();
    window.location.href = 'index.html';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        updateNavBar();
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    resetProfile();
    updateNavBar();
    window.location.href = 'index.html';
}

function resetProfile() {
    const fields = ["name", "email", "address", "role"];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
}

function updateNavBar() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');

    if (user) {
        loginNavItem.classList.add('d-none');
        registerNavItem.classList.add('d-none');
        userDropdown.classList.remove('d-none');
        userName.textContent = user.name;
    } else {
        loginNavItem.classList.remove('d-none');
        registerNavItem.classList.remove('d-none');
        userDropdown.classList.add('d-none');
        userName.textContent = '';
    }
}

document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
document.getElementById('loginForm')?.addEventListener('submit', handleLogin);

attachAddToCartListeners();
attachAddToWishlistListeners();
attachProductLinkListeners(); 
updateCartCount();
