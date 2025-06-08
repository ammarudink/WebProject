var ProfileService = {
    init: function() {
        if (!AuthService.validateToken()) {
            window.location.replace('#login');
            return;
        }
        this.loadProfile();
        this.loadOrderHistory();
        this.checkAdminStatus();
    },

    loadProfile: function() {
    const token = localStorage.getItem('user_token');
    if (!token) {
        toastr.error('Authentication token not found');
        return;
    }

    // First try to get user data from JWT token
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userData = tokenPayload.user;
        
        if (userData) {
            $("#name").val(userData.Name);
            $("#email").val(userData.Email);
            $("#address").val(userData.Address);
            $("#role").val(userData.Role);
        }
    } catch (e) {
        console.error('Error parsing JWT token:', e);
    }

    // Then make API call to get latest data
    $.ajax({
        url: Constants.project_base_url() + "user/" + JSON.parse(atob(token.split('.')[1])).user.UserID,
        type: "GET",
        headers: {
            "Authentication": "Bearer " + token
        },
        success: function(result) {
            const userData = result.data || result;
            
            if (userData && userData.Name) {
                $("#name").val(userData.Name);
                $("#email").val(userData.Email);
                $("#address").val(userData.Address);
                $("#role").val(userData.Role);
            } else {
                console.warn('Server returned invalid profile data:', result);
                toastr.error('Could not load profile data');
            }
        },
        error: function(XMLHttpRequest) {
            console.error('Profile load error:', XMLHttpRequest);
            toastr.error(XMLHttpRequest?.responseText || 'Error loading profile from server');
        }
    });
},

    loadOrderHistory: function() {
        $.ajax({
            url: Constants.project_base_url() + "order/history",
            type: "GET",
            headers: {
                "Authentication": "Bearer " + localStorage.getItem("user_token")
            },
            success: function(result) {
                $("#orderHistoryBody").empty();
                if (result && result.data) {
                    result.data.forEach(order => {
                        // Make sure order properties exist before using toFixed()
                        const totalAmount = order.TotalAmount ? parseFloat(order.TotalAmount).toFixed(2) : '0.00';
                        const row = `
                            <tr>
                                <td>${order.OrderID}</td>
                                <td>$${totalAmount}</td>
                                <td>${order.Status}</td>
                            </tr>`;
                        $("#orderHistoryBody").append(row);
                    });
                }
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Error loading orders');
            }
        });
    },

    viewOrderDetails: function(orderId) {
        $.ajax({
            url: Constants.project_base_url() + "order/" + orderId,
            type: "GET",
            headers: {
                "Authentication": "Bearer " + localStorage.getItem("user_token")
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
    const token = localStorage.getItem('user_token');
    if (!token) return;

    $.ajax({
        url: Constants.project_base_url() + "user/" + JSON.parse(atob(token.split('.')[1])).user.UserID,
        type: "GET",
        headers: {
            "Authentication": "Bearer " + token
        },
        success: function(result) {
            const userData = result.data || result;
            if (userData && userData.Role === 'Admin') {
                $("#adminControls").show();
            } else {
                $("#adminControls").hide();
            }
        },
        error: function(XMLHttpRequest) {
            console.error('Admin status check error:', XMLHttpRequest);
            $("#adminControls").hide();
        }
    });
},

    loadProductsIntoSelect: function() {
        $.ajax({
            url: Constants.project_base_url() + "products",
            type: "GET",
            headers: {
                "Authentication": "Bearer " + localStorage.getItem("user_token")
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
            url: Constants.project_base_url() + "products/" + productId,
            type: "PUT",
            headers: {
                "Authentication": "Bearer " + localStorage.getItem("user_token")
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
                url: Constants.project_base_url() + "user/" + JSON.parse(atob(localStorage.getItem("user_token").split('.')[1])).user.UserID,
                type: "DELETE",
                headers: {
                    "Authentication": "Bearer " + localStorage.getItem("user_token")
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