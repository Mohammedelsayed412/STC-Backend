export interface ICartItem {
  id: number;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
}
