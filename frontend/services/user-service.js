var UserService = {
 init: function () {
        // Remove the token check here since AuthService handles it
        $("#loginForm").validate({
            submitHandler: function (form) {
                var entity = Object.fromEntries(new FormData(form).entries());
                UserService.login(entity);
            },
        });

        $("#registerForm").validate({
            submitHandler: function (form) {
                var entity = Object.fromEntries(new FormData(form).entries());
                UserService.register(entity);
            },
        });
    },

    login: function() {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "auth/login",
            type: "POST",
            data: {
                email: $("#email").val(),
                password: $("#password").val()
            },
            success: function(response) {
                if (response.success) {
                    AuthService.handleLogin(response.data);
                } else {
                    toastr.error(response.message || 'Login failed');
                }
            },
            error: function(XMLHttpRequest) {
                toastr.error(XMLHttpRequest?.responseText || 'Login failed');
            }
        });
    },

    logout: function () {
        localStorage.clear();
        window.location.replace('#login');  // Changed to use hash instead of direct HTML file
    },
 
 register: function (entity) {
   $.ajax({
     url: Constants.PROJECT_BASE_URL + "auth/register",
     type: "POST",
     data: JSON.stringify(entity),
     contentType: "application/json",
     dataType: "json",
     success: function (result) {
       console.log(result);
       localStorage.setItem("user_token", result.data.token);
       window.location.replace("index.html");
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
       toastr.error(XMLHttpRequest?.responseText ?  XMLHttpRequest.responseText : 'Error');
     },
   });
 },
};
