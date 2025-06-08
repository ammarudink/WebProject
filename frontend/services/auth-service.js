var AuthService = {
    init: function() {
        this.setupTokenCheck();
        this.setupAjaxInterceptor();
        $(document).on('submit', '#loginForm', this.handleLoginSubmit.bind(this));
    },

    setupTokenCheck: function() {
        $(document).ready(() => {
            if (window.location.hash === '#login' || window.location.hash === '#register') {
                return;
            }
            
            if (!Utils.validateToken()) {
                window.location.replace('#login');
            }
        });
    },

    setupAjaxInterceptor: function() {
        $(document).ajaxSend((event, jqXHR, options) => {
            const token = localStorage.getItem("user_token");
            if (token) {
                jqXHR.setRequestHeader("Authentication", "Bearer " + token);
            }
        });

        
        $(document).ajaxError((event, jqXHR, settings, error) => {
            if (jqXHR.status === 401) {
                Utils.clearAuth();
                window.location.replace('#login');
            }
        });
    },

    handleLoginSubmit: function(e) {
        e.preventDefault();
        const loginData = {
            Email: $('#loginEmail').val(),
            Password: $('#loginPassword').val()
        };

        $.ajax({
            url: Constants.project_base_url() + 'auth/login',
            type: 'POST',
            data: JSON.stringify(loginData),
            contentType: "application/json",
            dataType: "json",
            success: (result) => {
                this.handleLogin(result);
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                toastr.error(XMLHttpRequest.responseJSON?.message || 'Login failed');
            }
        });
    },

    handleLogin: function(loginData) {
        $.ajax({
            url: Constants.project_base_url() + 'auth/login',
            type: 'POST',
            data: JSON.stringify(loginData),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                console.log('Login success:', response);
                if (response.success && response.token && response.user) {
                    localStorage.setItem('user_token', response.token);
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                    localStorage.setItem('user_id', response.user.UserID);
                    updateNavBar();
                    window.location.replace('#dashboard');
                } else {
                    toastr.error(response.message || 'Login failed');
                }
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.message || 'Login failed');
            }
        });
    },

    logout: function() {
        Utils.clearAuth();
        window.location.replace('#login');
    },

    validateToken: function() {
        const token = localStorage.getItem('user_token');
        if (!token) {
            return false;
        }

        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            
            if (!tokenPayload.user) {
                return false;
            }
            if (!localStorage.getItem('user_data')) {
                localStorage.setItem('user_data', JSON.stringify(tokenPayload.user));
            }

            return true;
        } catch (e) {
            console.error('Token validation error:', e);
            return false;
        }
    }
};