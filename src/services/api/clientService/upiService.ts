'use client'
import apiClient from "@/services/apiClient";
// import Notiflix from "notiflix";
import { getDateAndTime } from "@/lib/utils";



interface UpiTransaction {
    id: number;
    journey_id: {
        type: string;
        data: number[];
    };
    service_type: string;
    type: string;
    vendor_id: string;
    status: string;
    credits: string;
    msisdn: string;
    vault_balance: number;
    is_credit_used: string;
    transaction_id: string;
    vendor_transaction_id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResponseData {
    _id: string;
    vendor_id: {
        _id: string;
        contact_person_name: string;
        organization_name: string;
        organization_pan_number: string;
        website_link: string;
        phone_number: string;
        technical_contact_number: string;
        business_contact_number: string;
        email: string;
        password: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        webhook_url_benepik: string;
    };
    service_id: {
        _id: string;
        name: string;
        service_provider: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export const getVendorServiceList = async (vendor_id: string | undefined) => {
    try {
        const res = await apiClient.get(`/admin/vendor-service-lists?vendor_id=${vendor_id}`);
        const providerData = res?.data;

        if (!providerData || providerData.length === 0) {
            console.warn('No data returned from vendor-service-lists API.');
            return { formattedUpiService: [] };
        }

        // Format the API response
        const formattedUpiService = providerData.map((dt: ResponseData) => {
            const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || '');
            const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || '');

            return {
                vendor_id: {
                    _id: vendor_id,
                    contact_person_name: dt?.vendor_id?.contact_person_name,
                    organization_name: dt?.vendor_id?.organization_name,
                    organization_pan_number: dt?.vendor_id?.organization_pan_number,
                    website_link: dt?.vendor_id?.website_link,
                    phone_number: dt?.vendor_id?.phone_number,
                    technical_contact_number: dt?.vendor_id?.technical_contact_number,
                    business_contact_number: dt?.vendor_id?.business_contact_number,
                    email: dt?.vendor_id?.email,
                    password: dt?.vendor_id?.password,
                    createdAt: `${createdAtDate} ${createdAtTime}`,
                    updatedAt: `${updatedAtDate} ${updatedAtTime}`,
                    webhook_url_benepik: '',

                },
                service_id: {
                    _id: '',
                    name: dt?.service_id?.service_provider,
                    service_provider: dt?.service_id?.name,
                    createdAt: `${createdAtDate} ${createdAtTime}`,
                    updatedAt: `${updatedAtDate} ${updatedAtTime}`,
                },
                createdAt: `${createdAtDate} ${createdAtTime}`,
                updatedAt: `${updatedAtDate} ${updatedAtTime}`,
            };
        });

        return { formattedUpiService };
    } catch (error) {
        console.error("Error fetching vendor service list:", error);
        return { formattedUpiService: [] };
    }
};

export const getAllUpiTransaction = async (
    page: number,
    size: number,
    type: string,
    vendor_id: string | null
) => {
    console.log(1234433, type);

    const payload = {
        type,
        vendor_id,
    };

    const res = await apiClient.post(
        `/gratification/get-all-services-by-type?page=${page}&size=${size}`,
        payload
    );

    const {
        data: { data: providerData, totaCount },
    } = res;

    const formattedUpiService = providerData.map((dt: UpiTransaction, i: number) => {
        const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || "");
        const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || "");

        return {
            id: (page - 1) * size + i + 1,
            service_type: dt.service_type,
            type: dt.type,
            vendor_id, // Vendor ID remains dynamic
            status: dt.status,
            credits: dt.credits,
            msisdn: dt.msisdn,
            vault_balance: dt.vault_balance,
            is_credit_used: dt.is_credit_used,
            transaction_id: dt.transaction_id,
            vendor_transaction_id: dt.vendor_transaction_id,
            createdAt: `${createdAtDate} ${createdAtTime}`,
            updatedAt: `${updatedAtDate} ${updatedAtTime}`,
            check_balance: false,
        };
    });

    return { formattedUpiService, totaCount };
};
