import products from "../data/products.json";
import { IProduct } from "../interfaces/products";

export const getProducts = (
  page: number = 1,
  limit: number = 10
): IProduct[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return products.slice(startIndex, endIndex);
};

export const getProductById = (id: number): IProduct => {
  const product = products.find((product: IProduct) => product.id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};
