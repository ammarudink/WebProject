let Utils = {
    _lastValidation: 0,
    _validationInterval: 1000,
    _lastValidationResult: false,

    init: function() {
        this.setupAjaxInterceptor();
        this._lastValidationResult = this.validateToken();
    },

    datatable: function(table_id, columns, data, pageLength = 15) {
        if ($.fn.dataTable.isDataTable("#" + table_id)) {
            $("#" + table_id).DataTable().destroy();
        }
        $("#" + table_id).DataTable({
            data: data,
            columns: columns,
            pageLength: pageLength,
            lengthMenu: [2, 5, 10, 15, 25, 50, 100, "All"],
        });
    },

    setupAjaxInterceptor: function() {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                const token = localStorage.getItem('user_token');
                if (token) {
                    xhr.setRequestHeader('Authentication', 'Bearer ' + token);
                    console.log('Setting Authentication header:', 'Bearer ' + token);
                }
            }
        });
    },

    validateToken: function() {
        const now = Date.now();
        if (now - this._lastValidation < this._validationInterval) {
            return this._lastValidationResult;
        }

        const token = localStorage.getItem('user_token');
        this._lastValidation = now;
        
        if (!token) {
            console.log('No token found');
            this._lastValidationResult = false;
            return false;
        }
        
        try {
            const decoded = this.parseJwt(token);
            console.log('Decoded token:', decoded);
            
            if (!decoded) {
                console.log('Token decode failed');
                this._lastValidationResult = false;
                return false;
            }
            
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                console.log('Token expired');
                localStorage.removeItem('user_token');
                this._lastValidationResult = false;
                return false;
            }

            this._lastValidationResult = true;
            return true;
        } catch (e) {
            console.error('Token validation failed:', e);
            localStorage.removeItem('user_token');
            this._lastValidationResult = false;
            return false;
        }
    },

    parseJwt: function(token) {
        if (!token) return null;
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('Invalid token format');
                return null;
            }
            
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = atob(base64);
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('JWT parse error:', e);
            return null;
        }
    },

    isLoggedIn: function() {
        return this.validateToken();
    },

    clearAuth: function() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        this._lastValidationResult = false;
        window.location.replace('#login');
    }
};
