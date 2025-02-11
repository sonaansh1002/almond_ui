
'use client'
import apiClient from "@/services/apiClient";
// import Notiflix from "notiflix";
import { exportExcel } from "@/lib/utils";




// Export Product Function
export const exportFile = async (
    params: Record<string, unknown>,
    filename: string
): Promise<void> => {
    try {
        const response = await apiClient.post(`/rewards/export-file`, params, {
            responseType: "blob",
        });
        exportExcel(response.data)
        console.log(filename)
    } catch (error) {
        console.error("Error exporting file:", error);
        throw error;
    }
};

//Export Sku-Account Type Product Function
export const exportSkuFile = async (
    params: Record<string, unknown>,
    sku: string,
    service_provider: string,
    filename: string
): Promise<void> => {
    try {
        // Combine params with sku and service_provider
        const requestBody = {
            ...params,
            sku,
            service_provider,
        };

        const response = await apiClient.post(`/rewards/export-file`, requestBody, {
            responseType: "blob",
        });
        exportExcel(response.data);
        console.log("Exported Filename:", filename);
    } catch (error) {
        console.error("Error exporting file:", error);
        throw error;
    }
};
