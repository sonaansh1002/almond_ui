
import apiClientOrder from "../apiClientOrder";
import { getDateAndTime } from '@/lib/utils';

interface Epod {
    id: number;
    product_id: string,
    awb_number: string,
    shipment_id: string,
    customer_name: string,
    customer_mobile: string
    client_name: string,
    client_email: string,
    product_sku: string,
    transaction_id: string,
    vendor_transaction_id: string,
    delivery_partner: string,
    delivery_status: string,
    pod: string,
    last_updated_at: string,
    order_date: string
}

export const getEpod = async (page: number, size: number, delivery_partner: string, searchString: string, download: boolean, awb_number: string) => {
    const res = await apiClientOrder.get(`/data/shipment?page=${page}&limit=${size}&delivery_partner=${delivery_partner}&searchString=${searchString}&download=${download}&awbNumber=${awb_number}`);
    console.log(res?.data?.Rows, "epodddd")
    const epodData = res?.data?.Rows
    const Count = res.data.Count

    console.log(Count, "count")
    const formattedEpods = epodData.map((epo: Epod, i: number) => {
        // const { date, time } = getDateAndTime(epo?.last_updated_at || '');
        const { date: lastUpdatedDate, time: lastUpdatedTime } = getDateAndTime(epo?.last_updated_at || '');
        const { date: orderDate, time: orderTime } = getDateAndTime(epo?.order_date || '');
        return {
            id: (page - 1) * size + i + 1,
            product_id: epo?.product_id,
            awb_number: epo?.awb_number,
            shipment_id: epo?.shipment_id,
            customer_name: epo?.customer_name,
            customer_mobile: epo?.customer_mobile,
            client_name: epo?.client_name,
            client_email: epo?.client_email,
            product_sku: epo?.product_sku,
            transaction_id: epo?.transaction_id,
            vendor_transaction_id: epo?.vendor_transaction_id,
            delivery_partner: epo?.delivery_partner,
            delivery_status: epo?.delivery_status,
            pod: epo?.pod,
            // last_updated_at: `${date} ${time}`,
            last_updated_at: `${lastUpdatedDate} ${lastUpdatedTime}`,
            order_date: `${orderDate} ${orderTime}`,
        };
    });


    return { formattedEpods, Count };
};
