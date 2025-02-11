'use client'
import apiClient from "@/services/apiClient";
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';
import { exportExcel } from "@/lib/utils";


export interface Product {
    id: number;
    // sub_category_id: string;
    qc_cat_id: string;
    name?: string;
    brand_name?: string;
    qc_sku?: string;
    specification?: string;
    main_image: string | null;
    long_description: string;
    short_description: string;
    mrp: string;
    discount: string;
    amount: string;
    cost: string;
    maxPrice: string;
    minPrice: string;
    price_type: string;
    type: string;
    // gst: string;
    // brand_code: string;
    sku?: string;
    sku_account?: string;
    validity?: string;
    status?: string

}

export interface Vendor {
    id: number;
    name: string;
    _id: string;
}

export interface Providers {
    id: number;
    service_provider: string;
}

// Get All Products 
export const getAllProducts = async (page: number, size: number, sku: string, qc_sku: string, specification: string, name: string, brand_name: string, sku_account: string) => {
    const res = await apiClient.get(`/admin/products-list?page=${page}&size=${size}&sku=${sku}&qc_sku=${qc_sku}&specification=${specification}&name=${name}&brand_name=${brand_name}&sku_account=${sku_account}`);

    console.log("PRODUCT_RESPONSE", res)
    const productsData = await res?.data?.products
    const count = await res?.data?.count
    console.log("PRODUCT_RESPONSE...", productsData)

    console.log('resposne', res?.data?.products)
    const formattedProducts = productsData.map((product: Product, i: number) => ({
        id: (page - 1) * size + i + 1,
        // sub_category_id: product.sub_category_id,
        qc_cat_id: product.qc_cat_id,
        name: product.name,
        brand_name: product.brand_name,
        qc_sku: product.qc_sku,
        specification: product.specification,
        main_image: product.main_image,
        short_description: product.short_description,
        long_description: product.long_description,
        mrp: product.mrp,
        discount: product.discount,
        amount: product.amount,
        cost: product.cost,
        maxPrice: product.maxPrice,
        minPrice: product.minPrice,
        price_type: product.price_type,
        type: product.type,
        // gst: product.gst,
        // brand_code: product.brand_code,
        sku: product.sku,
        sku_account: product.sku_account,
        validity: product.validity,
        status: product.status
    }));

    return { formattedProducts, count };

};

// The API call and logic to handle add new product by making custom hook

const addProductService = async (formData: FormData) => {
    try {
        // const response = await apiClient.post('/admin/create-rewards-products', formData, {
        const response = await apiClient.post('/admin/create-rewards-products', formData, {

            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        Notiflix.Loading.remove();
        return { success: true, message: response?.data?.message };
    } catch (error) {
        let errorMessage = 'An unknown error occurred. Please try again.';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
        }
        Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#333333',
        })
            .then(() => {
                window.location.reload();
            });

        return { success: false, message: errorMessage };
    } finally {
        Notiflix.Loading.remove();
    }
};

// Custom hook for vendor registration..!
const useAddProduct = () => {
    const router = useRouter();

    // const register = useCallback(async (requestData: Record<string, string>) => {
    const register = useCallback(async (formData: FormData) => {

        const token = getToken();
        if (!token) {
            // Handle case where token is missing..!
            Swal.fire({
                title: 'Error',
                text: 'Authentication token is missing.',
                icon: 'error',
            });
            return;
        }

        // Call the API service
        const result = await addProductService(formData);

        if (result.success) {
            // Success notification..!
            Swal.fire({
                title: 'Success',
                text: result.message,
                icon: 'success',
            });

            router.push('/dashboard/product');
            Notiflix.Loading.remove();
        } else {
            // Error notification..!
            Swal.fire({
                title: 'Error',
                text: result.message,
                icon: 'error',
            });
        }
    }, [router]);

    return { addProduct: register }; // Return the register function to use in our components for api integration..!
};

export default useAddProduct;


// Export Product Function
export const exportProductFile = async (
    // params: Record<string, unknown>,
    filename: string
): Promise<void> => {
    try {
        const response = await apiClient.get(`/admin/export-products`, {
            responseType: "blob",
        });
        exportExcel(response.data)
        console.log(filename)
    } catch (error) {
        console.error("Error exporting file:", error);
        throw error;
    }
};


export const getAllSubcat = async () => {
    const res = await apiClient.get(`/catalogue/category/list`);
    console.log('RESPONSE---!!!---', res)
    // const { data: { vendorsData } } = res;
    // console.log(vendorsData, "datatta")
    const formattedVendors = res?.data?.map((vendor: Vendor, i: number) => {
        return {
            id: i + 1,
            name: vendor?.name,
            _id: vendor?._id,
        }
    });
    return { formattedVendors };
};

export const getAllSkuService = async (page: number, size: number) => {
    // const res = await apiClient.get(`/gratification/get-all-services`);
    const res = await apiClient.get(`/gratification/get-all-services?page=${page}&size=${size}`);
    console.log('SKU-RESPONSE---!!!---', res)
    const { data: { data: skuData, totaCount } } = res;
    // const { data: { data: providerData, totaCount } } = res;

    const formattedProvider = skuData.map((dt: Providers) => {
        return {
            // id: (page - 1) * size + i + 1,
            service_provider: dt.service_provider,
        }
    });
    return { formattedProvider, totaCount };
};
