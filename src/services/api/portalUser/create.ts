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
    role: string;
    _id: string;

}

export const getAllRole = async () => {
    const res = await apiClient.post(`/portal/list/role`,);
    console.log('RESPONSE---', res)
    // const { data: { vendorsData } } = res;
    const formattedVendors = res.data.map((vendor: Vendor, i: number) => {
        return {
            id: i + 1,
            role: vendor.role,
            _id: vendor._id,
        }
    });
    return { formattedVendors };
};



const addUser = async (requestData: Record<string, string>) => {
    try {
        // Make the API request
        const response = await apiClient.post<{ message: string }>(
            "/portal/create/user",
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
const useAddUser = () => {
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
        const result = await addUser(requestData);

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

            router.push('/dashboard/portalUser');
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

    return { addUser: register };
};

export default useAddUser;





