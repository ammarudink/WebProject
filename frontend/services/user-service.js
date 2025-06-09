var UserService = {
    init: function () {
        // Listen for hash changes to initialize forms
        $(window).on('hashchange', () => {
            this.setupAjaxHeaders();
            if (window.location.hash === '#login') {
                setTimeout(() => this.initializeLoginForm(), 100);
            } else if (window.location.hash === '#register') {
                setTimeout(() => this.initializeRegisterForm(), 100);
            }
        });

        // Initialize on page load
        $(document).ready(() => {
            this.setupAjaxHeaders();
            if (window.location.hash === '#login') {
                setTimeout(() => this.initializeLoginForm(), 100);
            } else if (window.location.hash === '#register') {
                setTimeout(() => this.initializeRegisterForm(), 100);
            }
        });
    },

    setupAjaxHeaders: function() {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                const token = localStorage.getItem('user_token');
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }
        });
    },

    initializeLoginForm: function() {
        const loginForm = $('#loginForm');
        if (!loginForm.length) return;

        if (loginForm.data('validator')) {
            loginForm.validate().destroy();
        }

        loginForm.validate({
            errorElement: 'div',
            errorClass: 'invalid-feedback',
            errorPlacement: function(error, element) {
                error.insertAfter(element);
            },
            highlight: function(element) {
                $(element).addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function(element) {
                $(element).addClass('is-valid').removeClass('is-invalid');
            },
            rules: {
                Email: {
                    required: true,
                    email: true
                },
                Password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                Email: {
                    required: "Please enter your email",
                    email: "Please enter a valid email"
                },
                Password: {
                    required: "Please enter your password",
                    minlength: "Password must be at least 6 characters"
                }
            },
            submitHandler: (form) => {
                const loginData = {
                    Email: $('#loginEmail').val().trim(),
                    Password: $('#loginPassword').val()
                };
                this.login(loginData);
                return false;
            }
        });
    },

    initializeRegisterForm: function() {
        const registerForm = $('#registerForm');
        if (!registerForm.length) return;

        if (registerForm.data('validator')) {
            registerForm.validate().destroy();
        }

        registerForm.validate({
            errorElement: 'div',
            errorClass: 'invalid-feedback',
            errorPlacement: function(error, element) {
                error.insertAfter(element);
            },
            highlight: function(element) {
                $(element).addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function(element) {
                $(element).addClass('is-valid').removeClass('is-invalid');
            },
            rules: {
                Name: {
                    required: true,
                    minlength: 2
                },
                Email: {
                    required: true,
                    email: true,
                    remote: {
                        url: Constants.project_base_url() + "auth/check-email",
                        type: "post",
                        data: {
                            email: function() {
                                return $("#registerEmail").val().trim();
                            }
                        }
                    }
                },
                Password: {
                    required: true,
                    minlength: 6,
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
                },
                ConfirmPassword: {
                    required: true,
                    equalTo: "#password"
                },
                Address: {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                Name: {
                    required: "Please enter your name",
                    minlength: "Name must be at least 2 characters"
                },
                Email: {
                    required: "Please enter your email",
                    email: "Please enter a valid email",
                    remote: "This email is already registered"
                },
                Password: {
                    required: "Please enter your password",
                    minlength: "Password must be at least 6 characters",
                    pattern: "Password must contain at least one letter and one number"
                },
                ConfirmPassword: {
                    required: "Please confirm your password",
                    equalTo: "Passwords don't match"
                },
                Address: {
                    required: "Please enter your address",
                    minlength: "Address must be at least 5 characters"
                }
            },
            submitHandler: (form) => {
                if (!this.validatePasswords()) {
                    return false;
                }

                const userData = {
                    name: $('#registerName').val().trim(),
                    email: $('#registerEmail').val().trim(),
                    password: $('#password').val(),
                    address: $('#registerAddress').val().trim(),
                    role: $('#registerRole').val()
                };

                if (userData.role === 'Admin') {
                    const adminPassword = $('#adminPassword').val();
                    if (!adminPassword) {
                        toastr.error('Admin password is required');
                        return false;
                    }
                    userData.adminPassword = adminPassword;
                }

                this.register(userData);
                return false;
            }
        });

        // Initialize password validation
        $('#password, #confirmPassword').on('keyup', this.validatePasswords);
        $('#registerRole').on('change', this.toggleAdminPasswordField);
    },

    login: function(loginData) {
        console.log('Login attempt with:', loginData.Email);
        
        $.ajax({
            url: Constants.project_base_url() + 'auth/login',
            type: 'POST',
            data: JSON.stringify(loginData),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function() {
                $('#loginForm button[type="submit"]').prop('disabled', true)
                    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
            },
            success: (response) => {
                if (response?.token && response?.user) {
                    localStorage.setItem('user_token', response.token);
                    localStorage.setItem('user_id', response.user.UserID);
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                    
                    Utils.setupAjaxInterceptor();
                    $('#loginForm')[0].reset();
                    updateNavBar();
                    
                    toastr.success(`Welcome back, ${response.user.Name}!`); // Fixed string syntax
                    
                    setTimeout(() => {
                        window.location.hash = '#dashboard'; // Changed to hash instead of replace
                    }, 500);
                } else {
                    toastr.error(response?.message || 'Invalid response from server');
                }
            },
            error: function(xhr) {
                console.error('Login error:', xhr.responseJSON);
                toastr.error(xhr.responseJSON?.message || 'Login failed. Please check your credentials.');
            },
            complete: function() {
                $('#loginForm button[type="submit"]').prop('disabled', false)
                    .html('Login');
            }
        });
    },

    register: function(userData) {
        $.blockUI({ message: '<h3>Creating account...</h3>' });
        $.ajax({
            url: Constants.project_base_url() + "auth/register",
            type: "POST",
            data: JSON.stringify(userData),
            contentType: "application/json",
            dataType: "json",
            success: function(result) {
                $.unblockUI();
                if (result && result.token) {
                    localStorage.setItem("user_token", result.token);
                    localStorage.setItem('user_id', result.user.UserID);
                    localStorage.setItem('user_data', JSON.stringify(result.user));
                    
                    Utils.setupAjaxInterceptor();
                    updateNavBar();
                    
                    window.location.hash = '#dashboard';
                    toastr.success('Registration successful');
                } else {
                    toastr.error(result.message || 'Registration failed');
                }
            },
            error: function(xhr) {
                $.unblockUI();
                console.error('Registration error:', xhr.responseJSON);
                toastr.error(xhr.responseJSON?.message || 'Registration failed');
            }
        });
    },

    validatePasswords: function() {
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        const errorElement = $('#passwordError');
        
        if (confirmPassword.length > 0) {
            errorElement.toggle(password !== confirmPassword);
        }
        return password === confirmPassword;
    },

    logout: function() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_id');
        
        $("#loginNavItem, #registerNavItem").show();
        $("#userDropdown").hide();
        $("#userName").text('');
        
        window.location.hash = '#login';
        toastr.success('Logged out successfully');
    },

    // Helper method to check if user is logged in
    isLoggedIn: function() {
        return !!localStorage.getItem('user_token');
    },

    // Helper method to get current user data
    getCurrentUser: function() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }
};
