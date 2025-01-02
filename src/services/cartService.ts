import fs from "fs";
import path from "path";
import products from "../data/products.json";

const cartFilePath = path.join(__dirname, "../data/cart.json");

interface CartItem {
  productId: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export const getCartProducts = (): Cart => {
  const cart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
  return cart;
};

const validateProductIds = (items: CartItem[]): boolean => {
  return items.every((item) => products.some((product) => product.id === item.productId));
};

export const editCart = (items: CartItem[]): Cart => {
  if (!validateProductIds(items)) {
    throw new Error("One or more product IDs are invalid.");
  }
  const cart = getCartProducts();

  items.forEach((item) => {
    const cartItemIndex = cart.items.findIndex((cartItem) => cartItem.productId === item.productId);
    
    if (cartItemIndex !== -1) {
      cart.items[cartItemIndex].quantity = item.quantity;
    } else {
      cart.items.push(item);
    }
  });

  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));

  return cart;
};

export const checkout = (): string => {
  const cart = getCartProducts();

  const outOfStockItems = cart.items.filter((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);
    return product ? cartItem.quantity > product.countAvailable : false;
  });

  if (outOfStockItems.length > 0) {
    throw new Error("One or more products have insufficient stock.");
  }

  cart.items.forEach((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);
    if (product) {
      product.countAvailable -= cartItem.quantity;
    }
  });

  fs.writeFileSync(path.join(__dirname, "../data/products.json"), JSON.stringify(products, null, 2));
  fs.writeFileSync(cartFilePath, JSON.stringify({ items: [] }, null, 2));

  return "Checkout successful! All items have been processed.";
};
