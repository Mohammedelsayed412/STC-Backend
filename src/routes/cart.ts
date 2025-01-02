import { Router } from "express";
import { getCartProducts, editCart, checkout } from "../services/cartService";

const router = Router();

router.get("/", (req, res) => {
  try {
    const cart = getCartProducts();
    res.json(cart);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

router.put("/edit", (req, res) => {
  try {
    const updatedCart = editCart(req.body.items);
    res.json(updatedCart);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
});

router.post("/checkout", (req, res) => {
  try {
    const message = checkout();
    res.json({ message });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
});

export default router;
