let Constants = {
   project_base_url: function(){
      if(location.hostname === "localhost"){
         return "http://localhost/WebProject/backend/";
      }else{
         return "https://monkfish-app-7io3u.ondigitalocean.app/backend/";
      }
   },
   //PROJECT_BASE_URL: "http://localhost/WebProject/backend/",
   CUSTOMER_ROLE: "Customer",
   ADMIN_ROLE: "Admin"
}
