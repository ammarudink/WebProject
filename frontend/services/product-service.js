var ProductService = {
    init: function() {
        if (!AuthService.validateToken()) {
            window.location.hash = '#login';
            return;
        }

        // Setup AJAX defaults
        $.ajaxSetup({
            beforeSend: function(xhr) {
                const token = localStorage.getItem('user_token');
                if (token) {
                    xhr.setRequestHeader('Authentication', 'Bearer ' + token);
                }
            }
        });

        // Attach event handlers
        this.attachEventHandlers();
    },

    attachEventHandlers: function() {
        // Add to cart handler
        $(document).off('click', '.add-to-cart').on('click', '.add-to-cart', (e) => {
            e.preventDefault();
            const button = $(e.currentTarget);
            this.addToCart(button);
        });
        
        // Product link handler
        $(document).off('click', '.product-link').on('click', '.product-link', (e) => {
            e.preventDefault();
            const productId = $(e.currentTarget).data('id');
            if (productId) {
                localStorage.setItem('currentProductId', productId);
                window.location.hash = 'product';
            }
        });

        // Wishlist handler
        $(document).off('click', '.wishlist-icon').on('click', '.wishlist-icon', (e) => {
            e.preventDefault();
            const icon = $(e.currentTarget);
            const productId = icon.data('id');
            this.toggleWishlist(productId, icon);
        });
    },

    toggleWishlist: function(productId, icon) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (wishlist.includes(productId.toString())) {
            wishlist = wishlist.filter(id => id !== productId.toString());
            icon.attr('src', 'frontend/assets/nfheart.png');
            toastr.success('Removed from wishlist');
        } else {
            wishlist.push(productId.toString());
            icon.attr('src', 'frontend/assets/fheart.png');
            toastr.success('Added to wishlist');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    },

    addToCart: function(button) {
        const productId = button.data('id');
        const productName = button.data('name');
        const productPrice = button.data('price');
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        toastr.success('Product added to cart');
    },

    loadProductDetails: function(productId) {
        if (!productId) {
            console.error('No product ID provided');
            return;
        }

        return $.ajax({
            url: Constants.project_base_url() + "product/" + productId,
            type: "GET",
            beforeSend: function() {
                $.blockUI({ message: '<h3>Loading product details...</h3>' });
            },
            success: function(result) {
                if (result && result.data) {
                    const product = result.data;
                    ProductService.updateProductUI(product);
                    
                    if (product.Category) {
                        ProductService.getRelatedProducts(product.ProductID, product.Category);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading product:', error);
                toastr.error('Failed to load product details');
            },
            complete: function() {
                $.unblockUI();
            }
        });
    },

    updateProductUI: function(product) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.includes(product.ProductID.toString());
        
        const productContent = `
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6">
                    <img class="card-img-top mb-5 mb-md-0" src="${product.Images}" alt="${product.Name}" />
                </div>
                <div class="col-md-6">
                    <h1 class="display-5 fw-bolder">${product.Name}</h1>
                    <div class="fs-5 mb-5">
                        ${product.SalePrice ? 
                            `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> 
                             <span class="text-danger">${product.SalePrice}KM</span>` : 
                            `${product.Price}KM`}
                    </div>
                    <p class="lead">${product.Description || 'No description available'}</p>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-outline-dark flex-shrink-0 add-to-cart" 
                            data-id="${product.ProductID}" 
                            data-name="${product.Name}" 
                            data-price="${product.SalePrice || product.Price}">
                            <i class="bi-cart-fill me-1"></i>
                            Add to cart
                        </button>
                        <img src="frontend/assets/${isInWishlist ? 'fheart.png' : 'nfheart.png'}" 
                             class="wishlist-icon" 
                             style="width: 24px; height: 24px; cursor: pointer;"
                             id="wishlist-icon-${product.ProductID}"
                             data-id="${product.ProductID}"
                             alt="Wishlist" />
                    </div>
                </div>
            </div>
        `;
        
        $('.container.px-4.px-lg-5.my-5').html(productContent);
        
        // Reattach event listeners
        attachAddToCartListeners();
        attachAddToWishlistListeners();
    },

    getRelatedProducts: function(productId, category) {
        return $.ajax({
            url: Constants.project_base_url() + `product/related?category=${category}&exclude=${productId}`,
            type: "GET",
            success: function(result) {
                if (result && result.data && result.data.length > 0) {
                    const container = $('#related-items');
                    container.empty();
                    
                    result.data.forEach(product => {
                        container.append(ProductService.renderProductCard(product));
                    });
                    
                    attachAddToCartListeners();
                    attachAddToWishlistListeners();
                }
            }
        });
    },

    getDashboardProducts: function() {
        return $.ajax({
            url: Constants.project_base_url() + "product/dashboard",
            type: "GET",
            beforeSend: function() {
                $.blockUI({ message: '<h3>Loading products...</h3>' });
            },
            success: function(result) {
                if (result && result.data) {
                    const container = $('#dashboard-items');
                    container.empty();
                    result.data.forEach(product => {
                        container.append(ProductService.renderProductCard(product));
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading dashboard products:', error);
                toastr.error('Failed to load products');
            },
            complete: function() {
                $.unblockUI();
            }
        });
    },

    getCategories: function() {
        return $.ajax({
            url: Constants.project_base_url() + "product/categories",
            type: "GET"
        });
    },

    updateProduct: function(productId, data) {
        return $.ajax({
            url: Constants.project_base_url() + "product/" + productId,
            type: "PATCH",
            data: JSON.stringify(data),
            contentType: "application/json"
        });
    },

    renderProductCard: function(product) {
        return `
            <div class="col mb-5">
                <div class="card h-100">
                    ${product.SalePrice ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                    <a href="#" class="product-link" data-id="${product.ProductID}">
                        <img class="card-img-top" src="${product.Images}" alt="${product.Name}">
                    </a>
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${product.Name}</h5>
                            <div class="price mb-3">
                                ${product.SalePrice ? 
                                    `<span class="text-muted text-decoration-line-through">${product.Price}KM</span> ${product.SalePrice}KM` : 
                                    `${product.Price}KM`}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <div class="d-flex justify-content-center align-items-center gap-2 mb-1">
                                <button class="btn btn-outline-dark add-to-cart" 
                                    data-id="${product.ProductID}" 
                                    data-name="${product.Name}" 
                                    data-price="${product.SalePrice || product.Price}">
                                    Add to cart
                                </button>
                                <img src="frontend/assets/nfheart.png" 
                                     class="wishlist-icon" 
                                     style="width: 24px; height: 24px; cursor: pointer;"
                                     id="wishlist-icon-${product.ProductID}"
                                     data-id="${product.ProductID}"
                                     alt="Add to wishlist" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    getAllProducts: function(page = 1, selectedCategories = []) {
        return $.ajax({
            url: Constants.project_base_url() + `product/all?page=${page}`,
            type: "GET",
            data: { categories: JSON.stringify(selectedCategories) },
            success: function(result) {
                if (result && result.data) {
                    const container = $('#product-container');
                    container.empty();
                    result.data.products.forEach(product => {
                        container.append(ProductService.renderProductCard(product));
                    });
                    // Update pagination if needed
                    if (result.data.totalPages > 1) {
                        updatePagination(result.data.currentPage, result.data.totalPages);
                    }
                    // Reattach event listeners
                    attachAddToCartListeners();
                    attachAddToWishlistListeners();
                    attachProductLinkListeners();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading products:', error);
                toastr.error('Failed to load products');
            }
        });
    }
};