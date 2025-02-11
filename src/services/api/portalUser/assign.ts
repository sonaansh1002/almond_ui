'use client'
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';
import apiClient from '@/services/apiClient';

interface Vendor {
    id: number;
    organization_name: string;
    _id: string;
}


export const getAllProject = async (page: number, size: number) => {
    const res = await apiClient.get(`/gratification/get-all-vendors?page=${page}&size=${size}`);
    const { data: { data: vendorsData, totaCount } } = res;


    console.log(vendorsData, "datatta")
    const formattedVendors = vendorsData.map((vendor: Vendor, i: number) => {

        return {
            id: (page - 1) * size + i + 1,
            organization_name: vendor.organization_name,
            _id: vendor._id
        }

    });

    return { formattedVendors, totaCount };
};

interface Project {
    project_id: string;
}

interface AssignProjectRequestData {
    userId: string;
    projects: Project[];
}

const assignProject = async (requestData: AssignProjectRequestData) => {
    try {
        // Make the API request
        const response = await apiClient.post<{ message: string }>(
            "/portal/user/assignProject",
            requestData
        );
        console.log("API Response:", response);

        Notiflix.Loading.remove();
        return { success: true, message: response.data.message };
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred. Please try again.";
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
        }
        Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#333333",
        }).then(() => {
            window.location.reload();
        });

        return { success: false, message: errorMessage };
    } finally {
        Notiflix.Loading.remove();
    }
};

const useAssignProject = () => {
    const router = useRouter();

    const register = useCallback(async (requestData: AssignProjectRequestData) => {
        const token = getToken();
        if (!token) {
            // Handle case where token is missing
            Swal.fire({
                title: "Error",
                text: "Authentication token is missing.",
                icon: "error",
            });
            return;
        }

        // Call the API service
        const result = await assignProject(requestData);

        if (result.success) {
            // Success notification
            Swal.fire({
                title: "Success",
                text: result.message,
                icon: "success",
            });
            // Optional: Redirect or reload the page
            // router.push('/dashboard/portalUser');
            Notiflix.Loading.remove();
        } else {
            // Error notification
            Swal.fire({
                title: "Error",
                text: result.message,
                icon: "error",
            });
        }
    }, [router]);

    return { assignProject: register };
};

export default useAssignProject;


// const assignProject = async (requestData: Record<string, string>) => {
//     try {
//         // Make the API request
//         const response = await apiClient.post<{ message: string }>(
//             "/portal/user/assignProject",
//             requestData,
//         );
//         console.log('12345..', response)

//         Notiflix.Loading.remove();
//         return { success: true, message: response.data.message };
//     } catch (error: unknown) {
//         let errorMessage = 'An unknown error occurred. Please try again.';
//         if (axios.isAxiosError(error)) {
//             errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
//         }
//         Swal.fire({
//             title: 'Error',
//             text: errorMessage,
//             icon: 'error',
//             confirmButtonColor: '#333333',
//         })
//             .then(() => {
//                 window.location.reload();
//             });

//         return { success: false, message: errorMessage };
//     } finally {
//         Notiflix.Loading.remove();
//     }
// };

// // Custom hook for vendor registration..!
// const useAssignProject = () => {
//     const router = useRouter();

//     const register = useCallback(async (requestData: Record<string, string>) => {
//         const token = getToken();
//         if (!token) {
//             // Handle case where token is missing..!
//             Swal.fire({
//                 title: 'Error',
//                 text: 'Authentication token is missing.',
//                 icon: 'error',
//             });
//             return;
//         }

//         // Call the API service
//         const result = await assignProject(requestData);

//         if (result.success) {
//             // Success notification..!
//             Swal.fire({
//                 title: 'Success',
//                 text: result.message,
//                 icon: 'success',
//             })
//             // .
//             // then(() => {
//             //     // Reload the page after success
//             //     window.location.reload();
//             // });

//             // router.push('/dashboard/portalUser');
//             Notiflix.Loading.remove();
//         } else {
//             // Error notification..!
//             Swal.fire({
//                 title: 'Error',
//                 text: result.message,
//                 icon: 'error',
//             });
//         }
//     }, [router]);

//     return { assignProject: register };
// };

// export default useAssignProject;
