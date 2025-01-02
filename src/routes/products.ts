import { Router } from "express";
import { getProducts, getTotalProductsCount } from "../services/productService";

const router = Router();

router.get("/", (req, res) => {
  const { page = 1, size = 7 } = req.query;

  const pageNumber = Number(page);
  const sizeNumber = Number(size);

  const products = getProducts(pageNumber, sizeNumber);
  const totalProducts = getTotalProductsCount();
  const totalPages = Math.ceil(totalProducts / sizeNumber);

  res.json({
    products,
    totalPages,
  });
});

export default router;
