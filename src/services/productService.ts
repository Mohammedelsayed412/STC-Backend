import products from "../data/products.json";
import { IProduct } from "../interfaces/products";

export const getProducts = (
  page: number = 1,
  size: number = 10
): IProduct[] => {
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  return products.slice(startIndex, endIndex);
};

export const getTotalProductsCount = () => {
  return products.length;
};