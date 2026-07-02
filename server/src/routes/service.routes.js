import express from "express";
import { getCategories, getProvidersByCategory, getProviderDetail } from "../controllers/service.controller.js";

const router = express.Router();

// GET /api/services/categories
router.get("/categories", getCategories);

// GET /api/services/providers?categoryId=X
router.get("/providers", getProvidersByCategory);

// GET /api/services/providers/:id
router.get("/providers/:id", getProviderDetail);

export default router;
