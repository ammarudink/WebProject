<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
Flight::group('/auth', function() {
   /**
    * @OA\Post(
    *     path="/auth/register",
    *     summary="Register new user.",
    *     description="Add a new user to the database.",
    *     tags={"auth"},
    *     security={
    *         {"ApiKey": {}}
    *     },
    *     @OA\RequestBody(
    *         description="Add new user",
    *         required=true,
    *         @OA\MediaType(
    *             mediaType="application/json",
    *             @OA\Schema(
    *                 required={"Password", "Email", "Name","Address"},
    *                 @OA\Property(
    *                     property="Password",
    *                     type="string",
    *                     example="some_password",
    *                     description="User password"
    *                 ),
    *                 @OA\Property(
    *                     property="Email",
    *                     type="string",
    *                     example="demo@gmail.com",
    *                     description="User email"
    *                 ),
    *                 @OA\Property(
    *                     property="Name",
    *                     type="string",
    *                     example="John Doe",
    *                     description="User name"
    *                 ),
    *                 @OA\Property(
    *                     property="Address",
    *                     type="string",
    *                     example="123 Main St, City, Country",
    *                     description="User address"
    *                 )
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="User has been added."
    *     ),
    *     @OA\Response(
    *         response=500,
    *         description="Internal server error."
    *     )
    * )
    */
   Flight::route("POST /register", function () {
       $data = Flight::request()->data->getData();


       $response = Flight::auth_service()->register($data);
  
       if ($response['success']) {
           Flight::json([
               'message' => 'User registered successfully',
               'data' => $response['data']
           ]);
       } else {
           Flight::halt(500, $response['error']);
       }
   });

   /**
    * @OA\Post(
    *      path="/auth/login",
    *      tags={"auth"},
    *      summary="Login to system using email and password",
    *      @OA\Response(
    *           response=200,
    *           description="Student data and JWT"
    *      ),
    *      @OA\RequestBody(
    *          description="Credentials",
    *          @OA\JsonContent(
    *              required={"Email","Password"},
    *              @OA\Property(property="Email", type="string", example="demo@gmail.com", description="Student email address"),
    *              @OA\Property(property="Password", type="string", example="some_password", description="Student password")
    *          )
    *      )
    * )
    */
   Flight::route('POST /login', function() {
    $login_data = Flight::request()->data->getData();
    
    try {
        if (!isset($login_data['Email']) || !isset($login_data['Password'])) {
            throw new Exception('Email and password are required.');
        }

        $response = Flight::auth_service()->login($login_data);
        if($response['success']){
            Flight::json([
                'success' => true,
                'user' => $response['data'],
                'token' => $response['data']['token']
            ]);
        } else {
            Flight::json([
                'success' => false,
                'message' => $response['error']
            ], 401);
        }
    } catch (\Exception $e) {
        Flight::json([
            'success' => false,
            'message' => $e->getMessage()
        ], 401);
    }
    });
});
?>
