var AuthService = {
    init: function() {
        this.setupTokenCheck();
        this.setupAjaxInterceptor();
    },

    setupTokenCheck: function() {
        $(document).ready(() => {
            if (window.location.hash === '#login' || window.location.hash === '#register') {
                return;
            }
            
            if (!this.validateToken()) {
                window.location.replace('#login');
            }
        });
    },

    setupAjaxInterceptor: function() {
        $(document).ajaxSend((event, jqXHR, options) => {
            const token = localStorage.getItem("user_token");
            if (token) {
                jqXHR.setRequestHeader("Authorization", "Bearer " + token);
            }
        });
    },

    validateToken: function() {
        const token = localStorage.getItem("user_token");
        if (!token) {
            return false;
        }

        const decoded = Utils.parseJwt(token);
        if (!decoded) {
            localStorage.removeItem("user_token");
            return false;
        }

        return true;
    },

    handleLogin: function(loginData) {
        localStorage.setItem("user_token", loginData.token);
        window.location.replace('#dashboard'); 
    }
};