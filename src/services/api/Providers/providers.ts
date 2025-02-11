'use client'
import apiClient from "@/services/apiClient";
import Notiflix from "notiflix";
import { getDateAndTime } from "@/lib/utils";
import { Providers } from "./interfaces";
import { SkuProducts } from "./interfaces";
import { Product } from "./interfaces";

// Get All Providers
export const getAllProviders = async (page: number, size: number) => {
    const res = await apiClient.get(`/gratification/get-all-services?page=${page}&size=${size}`);
    const { data: { data: providerData, totaCount } } = res;
    // console.log('Response22', { data: { data: providerData, totaCount } })

    const formattedProvider = providerData.map((dt: Providers, i: number) => {
        const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || '');
        const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || '');

        return {
            id: (page - 1) * size + i + 1,
            service_provider: dt?.service_provider,
            name: dt.name,
            createdAt: `${createdAtDate} ${createdAtTime}`,
            updatedAt: `${updatedAtDate} ${updatedAtTime}`,
            check_balance: false,
        }
    });
    return { formattedProvider, totaCount };

};

// EXPORT CHECK BALANCE FUNCTION
export const getCheckBalance = async (id: number, vendors: Providers[]) => {
    Notiflix.Loading.standard();
    const selectedVendor = vendors.find((vendor) => vendor.id === id);
    if (!selectedVendor) {
        Notiflix.Notify.failure("Provider not found!");
        Notiflix.Loading.remove();
        return null;
    }
    const accountType = selectedVendor.service_provider;
    try {
        // WE are passing the accountType in payload
        const res = await apiClient.post(`/admin/balance/`, { accountType });
        const { balance } = res.data[0];
        Notiflix.Notify.success('Balance fetched successfully!');
        return balance;
    } catch (error) {
        console.error('Failed to fetch balance:', error);
        Notiflix.Notify.failure('Failed to fetch balance!');
        return null;
    } finally {
        Notiflix.Loading.remove();
    }
};

// GET SKU PRODUCT -> Passing service provider to get particular service provider details click - PAGE VIEW PRODUCT
export const getDetailsByServiceProvider = async (service_provider: string, vendors: Providers[]) => {
    Notiflix.Loading.standard();
    const selectedVendor = vendors.find((vendor) => vendor.service_provider === service_provider);
    if (!selectedVendor) {
        console.error("Provider not found:", { service_provider, vendors });
        Notiflix.Notify.failure("Provider not found!");
        Notiflix.Loading.remove();
        return null;
    }
    const accountType = selectedVendor.service_provider;
    try {
        const payload = { accountType }; // or { service_provider: accountType } if needed
        const res = await apiClient.post(`/rewards/qwickcilver/getProductByCategoryId`, payload);
        Notiflix.Notify.success("Product details are fetched successfully !");
        return res;
    } catch {
        Notiflix.Notify.failure("Failed to fetch Provider!");
        return null;
    } finally {
        Notiflix.Loading.remove();
    }
};

// Fetching sku on the behalf of AccountType akka service provider - PAGE VIEW PRODUCT
export const getSkuProductList = async (accountType: string, page: number, size: number) => {
    try {
        const res = await apiClient.post(`/rewards/qwickcilver/getProductByCategoryId?page=${page}&size=${size}`, {
            accountType: accountType,
        });
        if (res) {
            const products = res.data.products || [];
            // Ensure that each product has a unique id (use sku here)
            const formattedProducts = products.map((product: SkuProducts, i: number) => ({
                ...product,
                id: (page - 1) * size + i + 1
            }));

            return {
                formattedProducts,
                count: res.data.productsCount || 0,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return null;
    }
};

// Fetching product details by particular sku click - PAGE VIEW SKU
export const getDetailsBySku = async (accountType: string, skuType: string, vendors: SkuProducts[]) => {
    Notiflix.Loading.standard();
    const selectedVendor = vendors.find((vendor) => vendor.sku === skuType);
    if (!selectedVendor) {
        console.error("sku not found:", { skuType, vendors });
        Notiflix.Notify.failure("sku not found!");
        Notiflix.Loading.remove();
        return null;
    }
    try {
        const payload = { sku: selectedVendor.sku, accountType }; // Construct the payload
        const res = await apiClient.post(`/rewards/qwickcilver/getProductBySku`, payload);
        Notiflix.Notify.success("Sku details fetched successfully!");
        return res;
    } catch {
        Notiflix.Notify.failure("Failed to fetch sku setails!");
        return null;
    } finally {
        Notiflix.Loading.remove();
    }
};

// Fetching sku on the behalf of AccountType akka service provider and SKU
export const getProductDataBysku = async (
    accountType: string,
    sku: string,
    page: number,
    size: number
): Promise<{ formattedProducts: Product[]; count: number } | null> => {
    console.log("Account Type in Payload:", sku); // Debug log

    try {
        const res = await apiClient.post(`/rewards/qwickcilver/getProductBySku?page=${page}&size=${size}`, {
            sku,
            accountType,
        });
        if (res && res.data) {
            const rawData = res.data;
            // Ensure the data is wrapped in an array to normalize the structure
            const productsData = Array.isArray(rawData) ? rawData : [rawData];
            const formattedProducts: Product[] = productsData.map((product, i) => ({
                id: (page - 1) * size + i + 1,
                sku: product.sku,
                name: product.name,
                description: product.description,
                shortDescription: product.shortDescription,
                disableCart: product.disableCart,
                purchaserLimit: product.purchaserLimit,
                purchaserDescription: product.purchaserDescription,
                offerShortDesc: product.offerShortDesc,
                relatedProductOptions: product.relatedProductOptions,
                url: product.url,
                quantity: product.quantity,
                // price: {
                price: product.price.price,
                type: product.price.type,
                min: product.price.min,
                max: product.price.max,
                denominations: product.price.denominations,
                cpg: product.price.cpg,
                currency: product.price.currency,
                defaultPrice: product.price.defaultPrice,
                // },

                images: product.images,
                thumbnail: product.images.thumbnail,
                mobile: product.images.mobile,
                base: product.images.base,
                small: product.images.small,
                tnc: product.tnc,
                link: product.tnc.link,
                content: product.tnc.content,

                discounts: product.discounts || [],
                brandName: product.brandName,
                etaMessage: product.etaMessage || "",
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            }));

            return {
                formattedProducts,
                count: 1, // Since it's a single product, the count is 1
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return null;
    }
};





