export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;        // in Cent
    imageFront: string;
    imageBack: string;
    category?: string;
    sku?: string;
    stock?: number;
  }