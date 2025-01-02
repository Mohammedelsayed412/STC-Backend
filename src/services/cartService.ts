import fs from "fs";
import path from "path";
import products from "../data/products.json";
import { IProduct } from "../interfaces/products";
import { ICart, ICartItem } from "../interfaces/cart";

const cartFilePath = path.join(__dirname, "../data/cart.json");

interface ICartProduct extends IProduct {
  quantity: number;
}

const ensureCartFileExists = (): void => {
  if (!fs.existsSync(cartFilePath)) {
    fs.writeFileSync(cartFilePath, JSON.stringify({ items: [] }, null, 2));
  }
};

export const getCartProducts = (): ICartProduct[] => {
  ensureCartFileExists();
  const cart: ICart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));

  return cart.items.map((cartItem: ICartItem) => {
    const product = products.find((product: IProduct) => product.id === cartItem.productId);

    if (product) {
      return {
        ...product,
        quantity: cartItem.quantity,
      };
    }
    return null;
  }).filter(item => item !== null) as ICartProduct[];
};

const validateProductIds = (items: ICartItem[]): boolean => {
  return items.every((item) => products.some((product: IProduct) => product.id === item.productId));
};

export const editCart = (items: ICartItem[]): ICart => {
  if (!validateProductIds(items)) {
    throw new Error("One or more product IDs are invalid.");
  }

  ensureCartFileExists();
  const cart: ICart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));

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
  ensureCartFileExists();
  const cart: ICart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
  const outOfStockItems = cart.items.filter((cartItem) => {
    const product = products.find((product: IProduct) => product.id === cartItem.productId);
    return product ? cartItem.quantity > product.countAvailable : false;
  });

  if (outOfStockItems.length > 0) {
    throw new Error("One or more products have insufficient stock.");
  }

  cart.items.forEach((cartItem) => {
    const product = products.find((product: IProduct) => product.id === cartItem.productId);
    if (product) {
      product.countAvailable -= cartItem.quantity;
    }
  });

  fs.writeFileSync(path.join(__dirname, "../data/products.json"), JSON.stringify(products, null, 2));
  fs.writeFileSync(cartFilePath, JSON.stringify({ items: [] }, null, 2));

  return "Checkout successful! All items have been processed.";
};
