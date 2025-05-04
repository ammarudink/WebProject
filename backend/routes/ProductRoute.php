<?php
    /**
    * @OA\Get(
    *      path="/product",
    *      tags={"products"},
    *      summary="Get all products",
    *      @OA\Response(
    *           response=200,
    *           description="Array of all products in the database"
    *      )
    * )
    */
    Flight::route("GET /product", function(){
        $product = Flight::product_service()->getAll();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $product
        ]);
    });

    /**
    * @OA\Get(
    *      path="/product/total",
    *      tags={"products"},
    *      summary="Get total number of products",
    *      @OA\Response(
    *           response=200,
    *           description="Returns the total count of products"
    *      )
    * )
    */
    Flight::route("GET /product/total", function(){
        $total = Flight::product_service()->getTotalProducts();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $total
        ]);
    });

    /**
     * @OA\Get(
     *     path="/product/sale",
     *     tags={"products"},
     *     summary="Get products on sale",
     *     @OA\Response(
     *         response=200,
     *         description="List of products on sale"
     *     )
     * )
     */
    Flight::route("GET /product/sale", function(){
        $product = Flight::product_service()->getOnSaleProducts();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $product
        ]);
    });

    /**
     * @OA\Get(
     *     path="/product/dashboard",
     *     tags={"products"},
     *     summary="Get dashboard products",
     *     @OA\Response(
     *         response=200,
     *         description="List of dashboard products"
     *     )
     * )
     */
    Flight::route("GET /product/dashboard", function(){
        $product = Flight::product_service()->getDashboardProducts();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $product
        ]);
    });

    /**
     * @OA\Get(
     *     path="/product/categories",
     *     tags={"products"},
     *     summary="Get all product categories",
     *     @OA\Response(
     *         response=200,
     *         description="List of product categories"
     *     )
     * )
     */
    Flight::route("GET /product/categories", function(){
        $categories = Flight::product_service()->fetchCategories();
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $categories
        ]);
    });

    /**
     * @OA\Get(
     *     path="/product/name/{name}",
     *     tags={"products"},
     *     summary="Get product by name",
     *     @OA\Parameter(
     *         name="name",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product details"
     *     )
     * )
     */
    Flight::route("GET /product/name/@name", function($name){
        $product = Flight::product_service()->getByProductName($name);
        Flight::json([
            "message" => "OK",
            "code" => 200,
            "data" => $product
        ]);
    });

    /**
     * @OA\Get(
     *     path="/product/{id}",
     *     tags={"products"},
     *     summary="Get product by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product details"
     *     )
     * )
     */
    Flight::route("GET /product/@id", function($id){
        Flight::json(Flight::product_service()->getProductById($id));
    });

    /**
     * @OA\Patch(
     *     path="/product/{id}",
     *     tags={"products"},
     *     summary="Update product by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product updated successfully"
     *     )
     * )
     */
    Flight::route("PATCH /product/@id", function($id){
        $product = Flight::request()->data->getData();
        Flight::json([
            "message" => "Product updated successfully",
            "data" => Flight::product_service()->update($id, $product)
        ]);
    });
?>