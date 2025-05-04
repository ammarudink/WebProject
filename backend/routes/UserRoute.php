<?php   
    /**
    * @OA\Get(
    *      path="/user",
    *      tags={"users"},
    *      summary="Get all users",
    *      @OA\Response(
    *           response=200,
    *           description="Array of all users in the database"
    *      )
    * )
    */
    Flight::route("GET /user", function(){
        $user = Flight::user_service()->getAll();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $user
        ]);
    });

    /**
    * @OA\Post(
    *      path="/user",
    *      tags={"users"},
    *      summary="Create a new user",
    *      @OA\RequestBody(
    *           required=true,
    *           @OA\JsonContent(
    *                type="object",
    *                @OA\Property(property="name", type="string"),
    *                @OA\Property(property="email", type="string")
    *           )
    *      ),
    *      @OA\Response(
    *           response=200,
    *           description="User created successfully with returned data"
    *      )
    * )
    */
    Flight::route("POST /user", function(){
        $request = Flight::request()->data->getData();
        Flight::json([
            "message" => "User created successfully",
            "data" => Flight::user_service()->insert($request)
        ]);
    });

    /**
     * @OA\Get(
     *     path="/user/{id}",
     *     tags={"users"},
     *     summary="Get user by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User details"
     *     )
     * )
     */
    Flight::route("GET /user/@id", function($id){
        Flight::json(Flight::user_service()->getById($id));
    });

    /**
     * @OA\Delete(
     *     path="/user/{id}",
     *     tags={"users"},
     *     summary="Delete user by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User deleted successfully"
     *     )
     * )
     */
    Flight::route("DELETE /user/@id", function($id){
        Flight::user_service()->delete($id);
        Flight::json(["message" => "User deleted successfully"]);
    });

    /**
     * @OA\Get(
     *     path="/user/email/{email}",
     *     tags={"users"},
     *     summary="Get user by email",
     *     @OA\Parameter(
     *         name="email",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User details"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     */
    Flight::route("GET /user/email/@email", function($email){
        $user = Flight::user_service()->getByEmail($email);
        if ($user) {
            Flight::json([
                "message" => "OK",
                "code" => 200,
                "data" => $user
            ]);
        } else {
            Flight::json([
                "message" => "User not found",
                "code" => 404,
                "data" => null
            ]);
        }
    });
?>