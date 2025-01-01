import { Router } from "express";
import { getProducts } from "../services/productService";

const router = Router();

router.get("/", (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const products = getProducts(Number(page), Number(limit));
  res.json(products);
});

export default router;
