import fs from "fs";
import path from "path";
import { ICart, ICartItem } from "../interfaces/cart";

const cartFilePath = path.join(__dirname, "../data/cart.json");

export const getCart = (): ICart => {
  const cart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
  return cart;
};

export const addToCart = (productId: number, quantity: number): ICart => {
  const cart = getCart();
  const existingItem = cart.items.find(
    (item: ICartItem) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
  return cart;
};

export const clearCart = (): ICart => {
  const cart = { items: [] };
  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
  return cart;
};
