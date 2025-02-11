'use client'
import apiClient from "@/services/apiClient";
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';


interface Vendor {
    id: number;

    // createdAt: string;
    // updatedAt: string;
    projectDetails: [{
        organization_name: string;
        _id: string;
    }]

}

export const getAllVendors = async (userId: string | null) => {
    const res = await apiClient.post(`/portal/user/getProjects`, { userId });
    console.log('RESPONSE---', res)
    // const { data: { vendorsData } } = res;
    // console.log(vendorsData, "datatta")
    const formattedVendors = res.data.map((vendor: Vendor, i: number) => {
        return {
            id: i + 1,
            organization_name: vendor.projectDetails[0].organization_name,
            _id: vendor.projectDetails[0]._id,
        }
    });
    return { formattedVendors };
};



const addProductService = async (requestData: Record<string, string>) => {
    try {
        // Make the API request
        const response = await apiClient.post<{ message: string }>(
            "/catalogue/create",
            requestData,
        );
        console.log('12345..', response)

        Notiflix.Loading.remove();
        return { success: true, message: response.data.message };
    } catch (error: unknown) {
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
const useAddCatalogue = () => {
    const router = useRouter();

    const register = useCallback(async (requestData: Record<string, string>) => {
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
        const result = await addProductService(requestData);

        if (result.success) {
            // Success notification..!
            Swal.fire({
                title: 'Success',
                text: result.message,
                icon: 'success',
            }).then(() => {
                // Reload the page after success
                window.location.reload();
            });

            router.push('/dashboard/catalogue');
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

    return { addCatalogue: register }; // Return the register function to use in our components for api integration..!
};

export default useAddCatalogue;





