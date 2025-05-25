var ProfileService = {
    init: function() {
        if (!AuthService.validateToken()) {
            window.location.replace('#login');
            return;
        }
        this.loadProfile();
        this.loadOrderHistory();
        this.checkAdminStatus();

        $(document).on('click', '#updateProductBtn', this.updateProduct);
        $(document).on('click', '#deleteUserBtn', this.deleteUser);
        $(document).on('click', '.view-order-details', function(e) {
            const orderId = $(this).data('order-id');
            ProfileService.viewOrderDetails(orderId);
        });
    },

    loadProfile: function() {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "users/profile",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                $("#name").val(result.data.name);
                $("#email").val(result.data.email);
                $("#address").val(result.data.address);
                $("#role").val(result.data.role);
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error loading profile');
            }
        });
    },

    loadOrderHistory: function() {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "orders/history",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                $("#orderHistoryBody").empty();
                result.data.forEach(order => {
                    $("#orderHistoryBody").append(`
                        <tr>
                            <td>${order.id}</td>
                            <td>$${order.total_amount.toFixed(2)}</td>
                            <td><span class="badge bg-${order.status === 'completed' ? 'success' : 'warning'}">${order.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-info view-order-details" data-order-id="${order.id}">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error loading orders');
            }
        });
    },

    viewOrderDetails: function(orderId) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "orders/" + orderId,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                console.log("Order details:", result);
                toastr.info("Order details loaded");
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error loading order details');
            }
        });
    },

    checkAdminStatus: function() {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "users/role",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                if (result.data && result.data.role === Constants.ADMIN_ROLE) {
                    $("#adminControls").show();
                }
            },
            error: function(XMLHttpRequest) {
                if (XMLHttpRequest.status === 401) {
                    window.location.replace('#login');
                }
                console.error("Error checking admin status:", XMLHttpRequest);
            }
        });
    },

    loadProductsIntoSelect: function() {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "products",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                $("#productSelect").empty();
                result.data.forEach(product => {
                    $("#productSelect").append(`
                        <option value="${product.id}">${product.name} - Current Price: $${product.price}</option>
                    `);
                });
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error loading products');
            }
        });
    },

    updateProduct: function() {
        const productId = $("#productSelect").val();
        const newPrice = $("#updatePrice").val();
        const salePrice = $("#updateSalePrice").val() || null;

        $.ajax({
            url: Constants.PROJECT_BASE_URL + "products/" + productId,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("user_token")
            },
            data: JSON.stringify({
                price: newPrice,
                sale_price: salePrice
            }),
            contentType: "application/json",
            success: function(result) {
                toastr.success('Product price updated successfully');
                $("#updateProductModal").modal('hide');
                ProfileService.loadProductsIntoSelect();
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error updating product');
            }
        });
    },

    deleteUser: function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            $.ajax({
                url: Constants.PROJECT_BASE_URL + "users/profile",
                type: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("user_token")
                },
                success: function() {
                    localStorage.clear();
                    window.location.replace("#login");
                    toastr.success('Account deleted successfully');
                },
                error: function(XMLHttpRequest) {
                    toastr.error(XMLHttpRequest?.responseText || 'Error deleting account');
                }
            });
        }
    }
};