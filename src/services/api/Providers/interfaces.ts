export interface Providers {
    id: number;
    service_provider: string;
    name: string;
    check_balance: string;
    updated_balance: string;
    createdAt: string;
    updatedAt: string;
    accountType: string
}

export interface SkuProducts {
    id: number | string
    sku: string;
    name: string;
    currency: {
        code: string;
        symbol: string;
        numericCode: string;
    };
    url: string;
    offerShortDesc: string | null;
    relatedProductOptions: {
        PROMO: boolean;
        DESIGNS: boolean;
    };
    minPrice: string;
    maxPrice: string;
    price: {
        cpg: string;
    };
    // discounts: any[];
    couponcodeDesc: string;
    images: {
        thumbnail: string;
        mobile: string;
        base: string;
        small: string;
    };
    createdAt: string;
    updatedAt: string;
    // campaigns: any | null;
    service_provider: string;
}
export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    quantity: {
        min: number | null;
        max: number | null;
    };
    price: {
        price: string;
        type: string;
        min: string;
        max: string;
        denominations: string[];
        currency: {
            code: string;
            symbol: string;
            numericCode: string;
        };
        cpg: string[];
        defaultPrice: number | null;
    };
    images: {
        thumbnail: string;
        mobile: string;
        base: string;
        small: string;
    };
    tnc: {
        link: string;
        content: string;
    };
    discounts: string[];
    brandName: string;
    createdAt: string;
    updatedAt: string;
}