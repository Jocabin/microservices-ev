export interface AddToBasketDto {
        id: string;
        quantity: number;
}

export interface BasketDto {
        totalPrice: number;
        products: ProductsAddedToBasketDto[];
}

export interface ProductsAddedToBasketDto {
        id: string;
        name: string;
        description: string;
        unitPrice: number;
        quantity: number;
}

export interface AvailableProductDto {
        id: string;
        name: string;
        description: string;
        unitPrice: number;
}

export interface ProductDto {
        _id?: string;
        ean: string;
        name: string;
        description: string;
        categories: string[];
        price: number;
}

export interface PurchasedProductDto {
        productId: string;
        quantity: number;
}