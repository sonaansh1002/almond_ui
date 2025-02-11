'use client'
import apiClient from "@/services/apiClient";


export interface AllCatalogue {
    id: number;
    catalogue_name: string;
    slug: string;
    created_by: string;
    unique_name: string;
    _id: string;
    vendor_id: string;
    vendorDetails: [{
        organization_name: string;
    }]
}

export interface RegisterVendorResponse {
    data: AllCatalogue[];
    count: number;
}


export const getAllCatalogue = async (page: number, size: number) => {
    const res: RegisterVendorResponse = await apiClient.post(`/catalogue/list?page=${page}&size=${size}`, {});
    const catalogueData = await res?.data
    console.log('CATALOGUE DATA------', catalogueData)
    const count = await res?.count

    console.log('COUNT----', count)

    const formattedCatalogue = catalogueData.map((product: AllCatalogue, i: number) => ({
        id: (page - 1) * size + i + 1,
        catalogue_name: product.catalogue_name,
        slug: product.slug,
        created_by: product.created_by,
        unique_name: product.unique_name,
        vendor_id: product.vendor_id,
        _id: product._id,
        organization_name: product.vendorDetails.map((details) => details.organization_name).join(' | ') // Extract all the project_ids from the array of objwct


    }));

    return { formattedCatalogue, count };

};
