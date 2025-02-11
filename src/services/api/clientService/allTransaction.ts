'use client'
import apiClient from "@/services/apiClient";
import { getDateAndTime } from "@/lib/utils";

interface ClientTransaction {
    id: number;
    service_type: string;
    type: string;
    vendor_id: string;
    status: string;
    credits: string;
    vault_balance: number;
    transaction_id: string;
    vendor_transaction_id: string;
    createdAt: string;
    updatedAt: string;
}


export const getAllClientTransaction = async (page: number, size: number, vendor_id: string | null, type: string, status: string) => {
    const res = await apiClient.get(`/gratification/vendor-transactions?vendor_id=${vendor_id}&page=${page}&size=${size}&type=${type}&status=${status}`, {
    });
    console.log(res, "respp")
    const { data: { data: providerData, totaCount } } = res;
    console.log('Response22----', { data: { data: providerData, totaCount } })

    const formattedUpiService = providerData.map((dt: ClientTransaction, i: number) => {
        const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || '');
        const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || '');

        return {
            id: (page - 1) * size + i + 1,
            service_type: dt.service_type,
            type: dt.type,
            status: dt.status,
            credits: dt.credits,
            vault_balance: dt.vault_balance,
            vendor_id: dt.vendor_id,
            transaction_id: dt.transaction_id,
            vendor_transaction_id: dt.vendor_transaction_id,
            createdAt: `${createdAtDate} ${createdAtTime}`,
            updatedAt: `${updatedAtDate} ${updatedAtTime}`,
            check_balance: false,
        }
    });
    return { formattedUpiService, totaCount };

};