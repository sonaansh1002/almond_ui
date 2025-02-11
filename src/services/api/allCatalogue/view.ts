'use client'
import apiClient from "@/services/apiClient";


export interface AllProductCatalogue {
    id: number;
    _id: string;
    productds: {
        productDetails: {
            name: string;
            brand_name: string;
            sku: string;
            qc_sku: string;
            specification: string;
            main_image: string;
            short_description: string;
            long_description: string;
        }[];
        mrp: [number];
        discount: [number];
        cost: [number];
        price_points: [number];
        // stock: [string];
        // min_qty_per_order: [string];
        // max_qty_per_order: [string];
        // isDuration: [string];
        // duration_start: [string];
        // duration_end: [string];
    }[];
    projects_catalogue_id: {
        catalogue_name: string
    }[];
    vendor_id: {
        organization_name: string
    }[];
}
export const getAllProductCatalogue = async (catalogue_id: string) => {
    const res = await apiClient.post(`/catalogue/listCatalogueProducts`, { catalogue_id });

    console.log("PRODUCT_RESPONSE", res)
    const catalogueData = await res?.data
    console.log(catalogueData, "cate")
    const count = await res?.data?.count
    const formattedProductCatalogue = catalogueData.map((product: AllProductCatalogue, i: number) => {
        const productDetails = product.productds.map((productd) => {
            return {
                name: productd.productDetails[0]?.name || "N/A",
                brand_name: productd.productDetails[0]?.brand_name,
                sku: productd.productDetails[0]?.sku,
                qc_sku: productd.productDetails[0]?.qc_sku,
                specification: productd.productDetails[0]?.specification,
                main_image: productd.productDetails[0]?.main_image,
                short_description: productd.productDetails[0]?.short_description,
                long_description: productd.productDetails[0]?.long_description,
                mrp: productd?.mrp[0],
                discount: productd?.discount[0],
                cost: productd.cost[0],
                price_points: productd.price_points[0],
                // stock: productd?.stock[0],
                // min_qty_per_order: productd?.min_qty_per_order[0],
                // max_qty_per_order: productd?.max_qty_per_order[0],
                // isDuration: productd?.isDuration[0],
                // duration_start: productd?.duration_start[0],
                // duration_end: productd?.duration_end[0],
            };
        });

        return {
            id: i + 1,
            productDetails,
            _id: product._id,
            organization_name: product.vendor_id[0].organization_name,
            catalogue_name: product.projects_catalogue_id[0].catalogue_name
        };
    });

    return { formattedProductCatalogue, count };

};
