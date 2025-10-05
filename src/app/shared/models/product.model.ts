export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;        // in Cent
    imageUrl: string;
    category?: string;
    sku?: string;
    stock?: number;
  }