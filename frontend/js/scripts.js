/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

console.log("scripts.js loaded successfully");

if (typeof products === 'undefined') {
    var products = [
        { id: 1, name: "Predator X34 X5 OLED Gaming Monitor", price: 349, sale: false, category: "Monitors", image: "/WebProject/frontend/assets/PredatorX34Monitor.jpg" },
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

function renderProducts(currentPage = 1) {
    console.log(`renderProducts() called for page ${currentPage}`);
    const productContainer = document.getElementById('product-container');
    const pagination = document.getElementById('pagination');
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    const queryParams = new URLSearchParams({
        action: 'paginated',
        page: currentPage.toString(),
        categories: JSON.stringify(selectedCategories)
    });

    fetch(`/WebProject/backend/dao/test.php?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched products:', data); // Log fetched products
            productContainer.innerHTML = ''; // Clear existing products
            pagination.innerHTML = ''; // Clear existing pagination

            if (data.products && Array.isArray(data.products)) {
                data.products.forEach(product => {
                    const productCard = `
                        <div class="col mb-5">
                            <div class="card h-100">
                                ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                                <img class="card-img-top" src="${product.Images}" alt="${product.Name}" />
                                <div class="card-body p-4">
                                    <div class="text-center">
                                        <h5 class="fw-bolder">${product.Name}</h5>
                                        <div class="price">
                                            ${product.SalePrice ? 
                                                `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM` : 
                                                `${product.Price}KM`}
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    <div class="text-center">
                                        <button class="btn btn-outline-dark mt-auto add-to-cart" 
                                            data-id="${product.ProductID}" 
                                            data-name="${product.Name}" 
                                            data-price="${product.SalePrice || product.Price}">
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    productContainer.insertAdjacentHTML('beforeend', productCard);
                });

                attachAddToCartListeners();
            } else {
                productContainer.innerHTML = '<p class="text-center">No products found.</p>';
                console.log("No products found.");
            }

            // Render pagination
            for (let i = 1; i <= data.totalPages; i++) {
                const active = i === data.currentPage ? 'active' : '';
                const pageItem = `
                    <li class="page-item ${active}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
                pagination.insertAdjacentHTML('beforeend', pageItem);
            }

            // Add previous and next buttons
            pagination.insertAdjacentHTML('afterbegin', `
                <li class="page-item ${data.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${data.currentPage - 1}">Previous</a>
                </li>
            `);
            pagination.insertAdjacentHTML('beforeend', `
                <li class="page-item ${data.currentPage === data.totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${data.currentPage + 1}">Next</a>
                </li>
            `);

            // Attach pagination listeners
            pagination.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const page = parseInt(this.getAttribute('data-page'));
                    if (!isNaN(page)) {
                        renderProducts(page);
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    
    pagination.innerHTML = `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'active' : '';
        pagination.innerHTML += `
            <li class="page-item ${active}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    pagination.innerHTML += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;

    // Attach click handlers
    pagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.parentElement.classList.contains('disabled')) return;
            
            const newPage = parseInt(this.getAttribute('data-page'));
            if (!isNaN(newPage)) {
                localStorage.setItem('currentPage', newPage);
                renderProducts(newPage);
            }
        });
    });
}

function initializePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    function handlePageClick(event) {
        event.preventDefault();
        const target = event.target.closest('.page-link');
        if (!target) return;

        let currentPage = parseInt(localStorage.getItem('currentPage') || '1');
        const page = target.getAttribute('data-page');
        
        if (page === 'prev') {
            if (currentPage > 1) currentPage--;
        } else if (page === 'next') {
            currentPage++;
        } else {
            currentPage = parseInt(page);
        }
        
        localStorage.setItem('currentPage', currentPage);
        renderProducts(currentPage);
    }

    pagination.removeEventListener('click', handlePageClick);
    pagination.addEventListener('click', handlePageClick);
    renderProducts(parseInt(localStorage.getItem('currentPage') || '1'));
}

function initializeCategoryFilters() {
    const categoryFilters = document.getElementById('category-filters');
    if (!categoryFilters) return;

    function filterProductsByCategory() {
        const selectedCategories = Array.from(categoryFilters.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());
        
        localStorage.setItem('currentPage', '1');
        
        const queryParams = new URLSearchParams({
            action: 'paginated',
            page: '1'
        });
        
        if (selectedCategories.length > 0) {
            queryParams.append('categories', JSON.stringify(selectedCategories));
        }

        fetch(`/WebProject/backend/dao/test.php?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            renderProductsWithData(data);
        })
        .catch(error => {
            console.error('Error filtering products:', error);
        });
    }

    categoryFilters.removeEventListener('change', filterProductsByCategory);
    categoryFilters.addEventListener('change', filterProductsByCategory);
}

function renderProductsWithData(data) {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    data.products.forEach(product => {
        const productCard = `
            <div class="col mb-3">
                <div class="card h-100 d-flex flex-column">
                    ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                    <img class="card-img-top" src="${product.Images}" alt="${product.Name}" />
                    <div class="card-body d-flex flex-column justify-content-between text-center">
                        <h5 class="fw-bolder">${product.Name}</h5>
                        <div class="price" style="min-height: 30px;">
                            ${product.SalePrice ? 
                                `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM` : 
                                `${product.Price}KM`}
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
                        <button class="btn btn-outline-dark mt-auto add-to-cart" 
                            data-id="${product.ProductID}" 
                            data-name="${product.Name}" 
                            data-price="${product.SalePrice || product.Price}">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productCard);
    });
    
    attachAddToCartListeners();
    
    if (data.totalPages > 1) {
        renderPagination(data.totalPages, parseInt(localStorage.getItem('currentPage') || '1'));
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
// Removed invalid line
function initializeAllProductsPage() {
    console.log('initializeAllProductsPage() called');
    fetchCategories(); // Fetch categories from the backend
    renderProducts(1); // Fetch and render products for page 1
}

function fetchCategories() {
    const categoryFilters = document.querySelector('#category-filters .list-group');
    if (!categoryFilters) {
        console.warn("Category filters element not found. Skipping fetchCategories.");
        return;
    }

    fetch('/WebProject/backend/dao/test.php?action=getCategories')
        .then(response => response.json())
        .then(categories => {
            categoryFilters.innerHTML = categories.map(category => `
                <li class="list-group-item">
                    <input class="form-check-input me-1" type="checkbox" value="${category}" id="category-${category}">
                    <label class="form-check-label" for="category-${category}">${category}</label>
                </li>
            `).join('');
            categoryFilters.addEventListener('change', () => renderProducts(1));
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function renderProducts(page) {
    const productContainer = document.getElementById('product-container');
    const pagination = document.getElementById('pagination');
    if (!productContainer || !pagination) {
        console.warn("Product container or pagination element not found. Skipping renderProducts.");
        return;
    }

    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const queryParams = new URLSearchParams({
        action: 'paginated',
        page,
        categories: JSON.stringify(selectedCategories),
        cacheBuster: new Date().getTime() // Add cache-busting parameter
    });

    fetch(`/WebProject/backend/dao/test.php?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            productContainer.innerHTML = data.products.map(product => `
                <div class="col mb-5">
                    <div class="card h-100">
                        ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 10px; right: 10px;">Sale</div>' : ''}
                        <a href="#product" class="product-link" onclick="storeProductDetails(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', '${product.Price}', '${product.Images}', '${product.SalePrice || ''}', '${product.Description ? product.Description.replace(/'/g, "\\'") : ''}')">
                            <img class="card-img-top" src="${product.Images}" alt="${product.Name}">
                        </a>
                        <div class="card-body text-center">
                            <h5 class="fw-bolder">${product.Name}</h5>
                            <div class="price">
                                ${product.SalePrice ? 
                                    `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM` : 
                                    `${product.Price}KM`}
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button class="btn btn-outline-dark mt-auto add-to-cart" 
                                    data-id="${product.ProductID}" 
                                    data-name="${product.Name}" 
                                    data-price="${product.SalePrice || product.Price}">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            pagination.innerHTML = `
                <li class="page-item ${data.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="javascript:void(0);" onclick="renderProducts(${data.currentPage - 1})">Previous</a>
                </li>
            `;

            for (let i = 1; i <= data.totalPages; i++) {
                pagination.innerHTML += `
                    <li class="page-item ${i === data.currentPage ? 'active' : ''}">
                        <a class="page-link" href="javascript:void(0);" onclick="renderProducts(${i})">${i}</a>
                    </li>
                `;
            }

            pagination.innerHTML += `
                <li class="page-item ${data.currentPage === data.totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="javascript:void(0);" onclick="renderProducts(${data.currentPage + 1})">Next</a>
                </li>
            `;

            attachAddToCartListeners(); // Ensure "Add to cart" buttons have event listeners
        })
        .catch(error => console.error('Error fetching products:', error));
}

function storeProductDetails(id, name, price, image, salePrice, description) {
    const productDetails = {
        id,
        name,
        price: parseFloat(price), // Ensure price is stored as a number
        image, // No fallback, as every product has an image
        salePrice: salePrice ? parseFloat(salePrice) : null, // Ensure salePrice is stored as a number or null
        description: description || "No description available." // Fallback if description is missing
    };
    console.log('Storing product details:', productDetails); // Debugging log
    localStorage.setItem('selectedProduct', JSON.stringify(productDetails));
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
    const itemsContainer = document.getElementById('onsale-items');
    if (!itemsContainer) return;

    fetch('/WebProject/backend/dao/test.php?action=onsale')
    .then(response => response.json())
    .then(products => {
        itemsContainer.innerHTML = '';
        products.forEach(product => {
            const itemElement = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                        <img src="${product.Images}" class="card-img-top" alt="${product.Name}">
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${product.Name}</h5>
                                <div class="price" style="min-height: 30px;">
                                    <span class="text-muted text-decoration-line-through">${product.Price}KM</span> 
                                    ${product.SalePrice}KM
                                </div>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button class="btn btn-outline-dark mt-auto add-to-cart" 
                                    data-id="${product.ProductID}" 
                                    data-name="${product.Name}" 
                                    data-price="${product.SalePrice}">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            itemsContainer.insertAdjacentHTML('beforeend', itemElement);
        });
        attachAddToCartListeners();
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
    console.log(`Fetching product details for productId: ${productId}`);
    fetch(`/WebProject/backend/dao/test.php?view=product&productId=${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Product details fetched:', data);
            if (data.product) {
                // Populate product details
                document.getElementById('product-image').src = data.product.Images || '/WebProject/frontend/assets/noImage.png';
                document.getElementById('product-name').textContent = data.product.Name || 'Product Name';
                document.getElementById('product-price').textContent = data.product.SalePrice
                    ? `${data.product.SalePrice}KM (Sale)`
                    : `${data.product.Price}KM`;
                document.getElementById('product-description').textContent = data.product.Description || 'No description available.';
                document.getElementById('add-to-cart').setAttribute('data-id', data.product.ProductID);
                document.getElementById('add-to-cart').setAttribute('data-name', data.product.Name);
                document.getElementById('add-to-cart').setAttribute('data-price', data.product.SalePrice || data.product.Price);

                // Load related products
                loadRelatedProducts(data.relatedProducts);
            } else {
                console.error('Product not found:', data.error || 'Unknown error');
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function loadRelatedProducts(relatedProducts) {
    const relatedItemsContainer = document.getElementById('related-items');
    relatedItemsContainer.innerHTML = ''; // Clear existing items
    if (relatedProducts && relatedProducts.length > 0) {
        relatedProducts.forEach(product => {
            const productCard = `
                <div class="col mb-5">
                    <div class="card h-100">
                        ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                        <img class="card-img-top" src="${product.Images || '/WebProject/frontend/assets/noImage.png'}" alt="${product.Name}" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${product.Name}</h5>
                                <div class="price">
                                    ${product.SalePrice
                                        ? `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM`
                                        : `${product.Price}KM`}
                                </div>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto" href="#product" onclick="storeProductDetails(${product.ProductID}, '${product.Name}', '${product.Price}', '${product.Images}', '${product.SalePrice || ''}', '${product.Description || ''}')">View Product</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            relatedItemsContainer.insertAdjacentHTML('beforeend', productCard);
        });
    } else {
        relatedItemsContainer.innerHTML = '<p class="text-center">No related products found.</p>';
    }
}

function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    
    if (user.UserID) {
        fetch(`/WebProject/backend/dao/test.php?action=getProfile&userId=${user.UserID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("name").value = data.user.name;
                    document.getElementById("email").value = data.user.email;
                    document.getElementById("address").value = data.user.address;
                    document.getElementById("role").value = data.user.role;
                    
                    // Show admin controls if user is admin
                    if (data.user.role === 'Admin') {
                        document.getElementById('adminControls').style.display = 'block';
                        // Load products into select when modal opens
                        $('#updateProductModal').on('show.bs.modal', loadProductsIntoSelect);
                    }
                } else {
                    alert('Failed to load profile data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to load profile data');
            });
    }
}

function loadProductsIntoSelect() {
    console.log('Loading products...');
    fetch('/WebProject/backend/dao/test.php?action=getAllProducts')
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.success) {
                const select = document.getElementById('productSelect');
                select.innerHTML = '';
                data.products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.ProductID; // Ensure ProductID matches your database column
                    option.textContent = `${product.Name} - Current Price: ${product.Price}KM${product.SalePrice ? ' (On Sale: ' + product.SalePrice + 'KM)' : ''}`;
                    select.appendChild(option);
                });
            } else {
                console.error('Failed to get products:', data.message);
            }
        })
        .catch(error => console.error('Error loading products:', error));
}

function updateProduct() {
    const formData = new FormData();
    formData.append('action', 'updateProduct');
    formData.append('productId', document.getElementById('productSelect').value);
    formData.append('price', document.getElementById('updatePrice').value);
    formData.append('salePrice', document.getElementById('updateSalePrice').value);

    console.log('Updating product with data:', {
        productId: formData.get('productId'),
        price: formData.get('price'),
        salePrice: formData.get('salePrice')
    });

    fetch('/WebProject/backend/dao/test.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product updated successfully!');
            $('#updateProductModal').modal('hide');
            document.getElementById('updateProductForm').reset();
            loadProductsIntoSelect(); // Refresh the product list
        } else {
            alert('Failed to update product');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update product');
    });
}

function deleteUser() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
        if (user.UserID) {
            fetch(`/WebProject/backend/dao/test.php?UserID=${user.UserID}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/WebProject/index.html';
                    updateNavBar();
                } else {
                    alert('Failed to delete user');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete user');
            });
        }
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('email', document.getElementById('loginEmail').value);
    formData.append('password', document.getElementById('loginPassword').value);

    fetch('/WebProject/backend/dao/test.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            document.getElementById('loginForm').reset();
            updateNavBar();
            window.location.hash = '#dashboard';
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed');
    });
}

function logout() {
    localStorage.removeItem('loggedInUser');
    updateNavBar();
    window.location.href = 'index.html';
}

function updateNavBar() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');

    if (user) {
        if (loginNavItem) loginNavItem.classList.add('d-none');
        if (registerNavItem) registerNavItem.classList.add('d-none');
        if (userDropdown) userDropdown.classList.remove('d-none');
        if (userName) userName.textContent = user.name;
    } else {
        if (loginNavItem) loginNavItem.classList.remove('d-none');
        if (registerNavItem) registerNavItem.classList.remove('d-none');
        if (userDropdown) userDropdown.classList.add('d-none');
        if (userName) userName.textContent = '';
    }
}

function validateRegistration() {
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let role = document.getElementById("registerRole");
    let adminPassword = document.getElementById("adminPassword");

    if (password.value !== confirmPassword.value) {
        alert("Passwords don't match!");
        return false;
    }

    if (role.value === "Admin") {
        const correctAdminPassword = "adminadmin";
        if (adminPassword.value !== correctAdminPassword) {
            alert("Incorrect Admin Password!");
            return false;
        }
    }
    return true;
}

function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    document.getElementById("name").value = user.name || '';
    document.getElementById("email").value = user.email || '';
    document.getElementById("address").value = user.address || '';;
    document.getElementById("role").value = user.role || '';
    
    // Show admin controls if user is admin
    if (user.role === 'Admin') {
        document.getElementById('adminControls').style.display = 'block';
    }
}

function addProduct() {
    const formData = new FormData();
    formData.append('action', 'addProduct');
    formData.append('name', document.getElementById('productName').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('image', document.getElementById('productImage').value);
    formData.append('sale', document.getElementById('productSale').value || null);

    fetch('/WebProject/backend/dao/test.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            $('#addProductModal').modal('hide');
            document.getElementById('addProductForm').reset();
        } else {
            alert('Failed to add product');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add product');
    });
}

function loadDashboardProducts() {
    console.log('Loading dashboard products...');
    const dashboardItems = document.getElementById('dashboard-items');
    if (!dashboardItems) {
        console.error("Dashboard items container not found.");
        return;
    }

    fetch('/WebProject/backend/dao/test.php?action=dashboard')
        .then(response => response.json())
        .then(products => {
            console.log('Fetched dashboard products:', products); // Debugging log
            dashboardItems.innerHTML = ''; // Clear existing products
            if (products.length === 0) {
                dashboardItems.innerHTML = '<p class="text-center">No products available.</p>';
                return;
            }
            products.forEach(product => {
                const productCard = `
                    <div class="col mb-5">
                        <div class="card h-100">
                            ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                            <a href="#product" class="product-link" data-id="${product.ProductID}">
                                <img class="card-img-top" src="${product.Images}" alt="${product.Name}">
                            </a>
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">${product.Name}</h5>
                                    <div class="price">
                                        ${product.SalePrice ? 
                                            `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM` : 
                                            `${product.Price}KM`}
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center">
                                    <button class="btn btn-outline-dark mt-auto add-to-cart" 
                                        data-id="${product.ProductID}" 
                                        data-name="${product.Name}" 
                                        data-price="${product.SalePrice || product.Price}">
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                dashboardItems.insertAdjacentHTML('beforeend', productCard);
            });

            attachProductLinkListeners();
            attachAddToCartListeners(); // Ensure "Add to cart" buttons have event listeners
        })
        .catch(error => console.error('Error loading dashboard products:', error));
}

function loadProductPage() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (!product) {
        console.error('No product details found in localStorage. Ensure storeProductDetails is called before navigating to the product page.');
        return; 
    }

    console.log('Loaded product details:', product); 

    const productContainer = document.querySelector('.container.px-4.px-lg-5.my-5');
    if (productContainer) {
        productContainer.innerHTML = `
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6">
                    <img class="card-img-top mb-5 mb-md-0" src="${product.image}" alt="${product.name}" onerror="this.src='/WebProject/frontend/assets/noImage.png';" />
                </div>
                <div class="col-md-6">
                    <h1 class="display-5 fw-bolder">${product.name}</h1>
                    <div class="fs-5 mb-5">
                        ${product.salePrice 
                            ? `<span class="text-muted text-decoration-line-through">${product.price}KM</span> ${product.salePrice}KM`
                            : `${product.price}KM`}
                    </div>
                    <p class="lead">${product.description || 'No description available.'}</p>
                    <div class="d-flex">
                        <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1" style="max-width: 3rem" />
                        <button class="btn btn-outline-dark flex-shrink-0 add-to-cart" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.salePrice || product.price}">
                            <i class="bi-cart-fill me-1"></i>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachAddToCartListeners();
    fetchRelatedItems(product.id, product.category);
}

// Initialize components
updateNavBar();
attachAddToCartListeners();
attachAddToWishlistListeners();
attachProductLinkListeners();
updateCartCount();

// Only call these functions if the relevant elements exist
if (document.querySelector('#category-filters')) {
    fetchCategories();
}
if (document.getElementById('product-container')) {
    renderProducts(1);
}