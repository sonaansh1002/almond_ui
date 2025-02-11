'use client'
import apiClient from "@/services/apiClient";
// import Notiflix from "notiflix";
import { exportExcel } from "@/lib/utils";




export const exportProductFile = async (
    params: Record<string, unknown>,
    filename: string
): Promise<void> => {
    try {
        const response = await apiClient.get(`/admin/export-products`, {
            params,
            responseType: "blob",
        });

        exportExcel(response.data);
        console.log("File export initiated:", filename);
    } catch (error) {
        console.error("Error exporting file:", error);
        throw error; // Re-throw the error for upstream handling
    }
};
