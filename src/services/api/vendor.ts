'use client'
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';
import apiClient from '@/services/apiClient';
import { getDateAndTime } from '@/lib/utils';

interface Vendor {
    id: number;
    business_contact_number: string;
    contact_person_name: string;
    email: string;
    organization_name: string;
    organization_pan_number: string;
    phone_number: string;
    technical_contact_number: string;
    website_link: string;
    createdAt: string;
    updatedAt: string;
}
interface RegisterVendorResponse {
    data: {
        vendor_id: string;
    };
    message: string;
}

// Get all Vendors Data..
export const getAllVendors = async (page: number, size: number) => {
    const res = await apiClient.get(`/gratification/get-all-vendors?page=${page}&size=${size}`);
    const { data: { data: vendorsData, totaCount } } = res;


    console.log(vendorsData, "datatta")
    const formattedVendors = vendorsData.map((vendor: Vendor, i: number) => {

        const { date: createdAtDate, time: createdAtTime } = getDateAndTime(vendor.createdAt || '');
        const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(vendor.updatedAt || '');

        return {
            id: (page - 1) * size + i + 1,
            business_contact_number: vendor.business_contact_number,
            contact_person_name: vendor.contact_person_name,
            email: vendor.email,
            organization_name: vendor.organization_name,
            organization_pan_number: vendor.organization_pan_number,
            phone_number: vendor.phone_number,
            technical_contact_number: vendor.technical_contact_number,
            website_link: vendor.website_link,
            // createdAt: new Date(vendor.createdAt).toLocaleString("en-IN"),
            // updatedAt: new Date(vendor.updatedAt).toLocaleString("en-IN"),
            // createdAt: new Intl.DateTimeFormat("en-IN", {
            //     dateStyle: "medium",
            //     timeStyle: "short",
            // }).format(new Date(vendor.createdAt)),
            // updatedAt: new Intl.DateTimeFormat("en-IN", {
            //     dateStyle: "medium",
            //     timeStyle: "short",
            // }).format(new Date(vendor.updatedAt)),

            createdAt: `${createdAtDate} ${createdAtTime}`,
            updatedAt: `${updatedAtDate} ${updatedAtTime}`,
        }

    });

    return { formattedVendors, totaCount };
};


// The API call and logic to handle vendor registration
const registerVendorService = async (requestData: Record<string, string>) => {
    try {
        const response: RegisterVendorResponse = await apiClient.post(`/gratification/create-vendors`, requestData);
        console.log('REsponse', response?.message)
        // If response is successful, save vendor_id and return the vendor ID
        const vendorId = response?.data?.vendor_id;
        localStorage.setItem('vendor_id', vendorId);
        Notiflix.Loading.remove();
        return { success: true, message: response?.message };

        // Different type of errors we can receive [Catch Errors]
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

        return { success: false, message: errorMessage }; // Return failure structure..!
    } finally {
        Notiflix.Loading.remove();
    }
};

// Custom hook for vendor registration..!
const useVendorRegistration = () => {
    const router = useRouter();

    const register = useCallback(async (requestData: Record<string, string>) => {
        const token = getToken();
        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'Authentication token is missing.',
                icon: 'error',
            });
            return;
        }

        // Call the API service
        const result = await registerVendorService(requestData);

        if (result.success) {
            Swal.fire({
                title: 'Success',
                text: result.message,
                icon: 'success',
            });

            router.push('/dashboard/client');
            Notiflix.Loading.remove();
        } else {
            Swal.fire({
                title: 'Error',
                text: result.message,
                icon: 'error',
            });
        }
    }, [router]);

    return { registerVendor: register }; // Return the register function to use in our components for api integration..!
};

export default useVendorRegistration;
