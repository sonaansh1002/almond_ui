'use client'
import apiClient from "@/services/apiClient";


export interface AllPortalUser {
    id: number;
    createdAt: string;
    email: string;
    password: string;
    role_id: string;
    _id: string;
    vendor_id: [{
        organization_name: string;
    }]
}

interface RegisterPortalResponse {
    data: AllPortalUser[];
    count: number;
}


export const getAllPotalUser = async (page: number, size: number) => {

    const res: RegisterPortalResponse = await apiClient.post(`/portal/list/user?page=${page}&limit=${size}`, {});
    // const res = await apiClient.post(`/portal/list/user`, {});

    console.log("PORTAL_USER_RESPONSE---!!!!", res.data)
    // const catalogueData = await res?.data
    const count = await res?.count
    console.log(count, "count")

    const formattedCatalogue = res.data.map((product: AllPortalUser, i: number) => ({
        id: (page - 1) * size + i + 1,
        // id: i + 1,
        email: product.email,
        _id: product._id,
        project_id: product.vendor_id.map((details) => details.organization_name).join(' | ') // Extract all the project_ids from the array of objwct
    }));

    return { formattedCatalogue, count };
};

