'use client'
import apiClient from "@/services/apiClient";
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';

export interface Product {
    id: number;
    _id: string;
    name: string;
}
const Loader_Color = 'rgba(241,230,230,0.985)'

// Get All Products 
export const getAllProducts = async (page: number, size: number,) => {
    const res = await apiClient.get(`/admin/products-list?page=${page}&size=${size}`);

    console.log("PRODUCT_RESPONSE", res)
    const productsData = await res?.data?.products
    const count = await res?.data?.count
    console.log("PRODUCT_RESPONSE...!!!!--", productsData)

    console.log('resposne', res?.data?.products)
    const formattedProducts = productsData.map((product: Product, i: number) => ({
        id: (page - 1) * size + i + 1,
        _id: product._id,
        name: product.name,

    }));

    return { formattedProducts, count };

};



const addProductService = async (requestData: Record<string, unknown>) => {
    try {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();

        // Destructure the incoming requestData
        const { catalogueId, vendorId, products, ...rest } = requestData;
        console.log("console-Products", products)

        // Ensure products is an array of objects, not a string
        let formattedProducts = products;
        if (typeof products === 'string') {
            formattedProducts = JSON.parse(products); // Parse if it's a stringified JSON
        }

        // Prepare the payload in the required format
        const payload = {
            vendor_id: vendorId,  // Vendor ID
            projects_catalogue_id: catalogueId,  // Catalogue ID
            products: formattedProducts,  // Ensure products is an array of objects
            ...rest,  // Spread any other data
        };

        // Make the API request with the payload
        const response = await apiClient.post<{ message: string }>(
            "/catalogue/projectProductcreate",
            payload,
        );
        console.log('12345..', response, 'PAYLOAD--',);

        Notiflix.Loading.remove();
        return { success: true, message: response.data.message };
    } catch (error: unknown) {
        Notiflix.Loading.remove();
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
                // window.location.reload();
            });

        return { success: false, message: errorMessage };
    } finally {
        Notiflix.Loading.remove();
    }
};

// Custom hook for vendor registration

const useAddProductCatalogue = () => {
    const router = useRouter();

    const register = useCallback(async (requestData: Record<string, unknown>) => {
        console.log('REQUEST-DATA', requestData)
        const token = getToken();
        if (!token) {
            // Handle case where token is missing
            Swal.fire({
                title: 'Error',
                text: 'Authentication token is missing.',
                icon: 'error',
            });
            return;
        }

        // Call the API service
        const result = await addProductService(requestData);

        if (result.success) {
            // Success notification
            Swal.fire({
                title: 'Success',
                text: result.message,
                icon: 'success',
            }).then(() => {
                // Reload the page after success
                // window.location.reload();
            });

            router.push('/dashboard/catalogue');
            Notiflix.Loading.remove();
        } else {
            // Error notification
            Swal.fire({
                title: 'Error',
                text: result.message,
                icon: 'error',
            });
        }
    }, [router]);




    return { addProductCatalogue: register };
};

export default useAddProductCatalogue;

