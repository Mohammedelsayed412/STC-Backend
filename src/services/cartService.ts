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

  return cart.items
    .map((cartItem: ICartItem) => {
      const product = products.find(
        (product: IProduct) => product.id === cartItem.id
      );

      if (product) {
        return {
          ...product,
          quantity: cartItem.quantity,
        };
      }
      return null;
    })
    .filter((item) => item !== null) as ICartProduct[];
};

const validateids = (items: ICartItem[]): boolean => {
  return items.every((item) =>
    products.some((product: IProduct) => product.id === item.id)
  );
};
export const editCart = (items: ICartItem[]): ICart => {
  if (!Array.isArray(items)) {
    throw new Error("Invalid input: items must be an array.");
  }

  if (items.length > 0 && !validateids(items)) {
    throw new Error("One or more product IDs are invalid.");
  }

  ensureCartFileExists();

  const newCart: ICart = { items };
  fs.writeFileSync(cartFilePath, JSON.stringify(newCart, null, 2));

  return newCart;
};

export const checkout = (): string => {
  ensureCartFileExists();
  const cart: ICart = JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
  const outOfStockItems = cart.items.filter((cartItem) => {
    const product = products.find(
      (product: IProduct) => product.id === cartItem.id
    );
    return product ? cartItem.quantity > product.countAvailable : false;
  });

  if (outOfStockItems.length > 0) {
    throw new Error("One or more products have insufficient stock.");
  }

  cart.items.forEach((cartItem) => {
    const product = products.find(
      (product: IProduct) => product.id === cartItem.id
    );
    if (product) {
      product.countAvailable -= cartItem.quantity;
    }
  });

  fs.writeFileSync(
    path.join(__dirname, "../data/products.json"),
    JSON.stringify(products, null, 2)
  );
  fs.writeFileSync(cartFilePath, JSON.stringify({ items: [] }, null, 2));

  return "Checkout successful! All items have been processed.";
};
