<?php
    /**
     * @OA\Get(
     *      path="/order",
     *      tags={"orders"},
     *      summary="Get all orders",
     *      @OA\Response(
     *           response=200,
     *           description="Array of all orders in the database"
     *      )
     * )
     */
    Flight::route("GET /order", function(){
        $order = Flight::order_service()->getAll();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $order
        ]);
    });

    /**
     * @OA\Post(
     *      path="/order/create",
     *      tags={"orders"},
     *      summary="Create a new order",
     *      @OA\RequestBody(
     *           required=true,
     *           @OA\JsonContent(
     *                @OA\Property(property="UserID", type="integer", description="ID of the user placing the order"),
     *                @OA\Property(property="TotalAmount", type="number", description="Total amount of the order")
     *           )
     *      ),
     *      @OA\Response(
     *           response=200,
     *           description="Order created successfully with returned data"
     *      )
     * )
     */
    Flight::route("POST /order/create", function(){
        $request = Flight::request()->data->getData();
        $userId = $request['UserID'];
        $totalAmount = $request['TotalAmount'];
        
        Flight::json([
            "message"=> "Order created successfully",
            "data" => Flight::order_service()->createOrder($userId, $totalAmount)
        ]);
    });

    /**
     * @OA\Get(
     *     path="/order/status/{status}",
     *     tags={"orders"},
     *     summary="Get orders by status",
     *     @OA\Parameter(
     *         name="status",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of orders with specified status"
     *     )
     * )
     */
    Flight::route("GET /order/status/@status", function($status){
        $order = Flight::order_service()->getByStatus($status);
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $order
        ]);
    });

    /**
     * @OA\Get(
     *     path="/order/user/{id}",
     *     tags={"orders"},
     *     summary="Get orders by user ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of orders for specified user"
     *     )
     * )
     */
    Flight::route("GET /order/user/@id", function($id){
        $order = Flight::order_service()->getByUserId($id);
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $order
        ]);
    });    
?>