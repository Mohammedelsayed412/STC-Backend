import { Router } from "express";
import { getCart, addToCart, clearCart } from "../services/cartService";

const router = Router();

router.get("/", (req, res) => {
  const cart = getCart();
  res.json(cart);
});

router.post("/add", (req, res) => {
  const { productId, quantity } = req.body;
  const cart = addToCart(productId, quantity);
  res.json(cart);
});

router.post("/checkout", (req, res) => {
  clearCart();
  res.json({ message: "Checkout successful!" });
});

export default router;
