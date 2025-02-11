'use client'
import apiClient from "@/services/apiClient";
import { getDateAndTime } from "@/lib/utils";

interface ClientService {
    id: number;
    name: string;
    service_provider: string;
    createdAt: string;
    updatedAt: string;
}


export const getAllClientService = async (page: number, size: number, service_provider: string) => {
    const res = await apiClient.get(`/gratification/get-all-services?page=${page}&size=${size}&service_provider=${service_provider}`, {
    });
    // console.log(res, "respp")
    const { data: { data: providerData, totaCount } } = res;
    // console.log('Response22----', { data: { data: providerData, totaCount } })

    const formattedService = providerData.map((dt: ClientService, i: number) => {
        const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || '');
        const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || '');

        return {
            id: (page - 1) * size + i + 1,
            name: dt?.name,
            service_provider: dt?.service_provider,
            createdAt: `${createdAtDate} ${createdAtTime}`,
            updatedAt: `${updatedAtDate} ${updatedAtTime}`,

        }
    });
    return { formattedService, totaCount };
};