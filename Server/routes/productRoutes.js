import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  restoreProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
import {
  brainTreePaymentController,
  braintreeTokenController,
} from "../controllers/paymentController.js";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

router.post(
  "/products",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update a product
router.put(
  "/products/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get all products
router.get("/products", getProductController);

// Get a single product
router.get("/products/:slug", getSingleProductController);

// Get product photo
router.get("/products/:pid/photo", productPhotoController);

// Delete a product
router.delete("/products/:pid", deleteProductController);

// Filter products
router.post("/products/filters", productFiltersController);

// Get product count
router.get("/products/count", productCountController);

// Get paginated product list
router.get("/products/page/:page?", productListController);

// Search products
router.get("/search/:keyword", searchProductController);

//restore productg
router.put("/restore/:id", restoreProductController);

// Get related products
router.get("/products/:pid/related/:cid", relatedProductController);

// Get products by category
router.get("/products/category/:slug", productCategoryController);

// Get Braintree token
router.get("/braintree/token", braintreeTokenController);

// Process Braintree payment
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
