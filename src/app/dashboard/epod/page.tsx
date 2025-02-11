"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import Notiflix from 'notiflix';
import * as Yup from "yup";
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
import ModalForm from '@/components/modalForm/page';
import * as xlsx from "xlsx"
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';


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

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "product_id", headerName: "Product Id", width: 150 },
    { field: "awb_number", headerName: "Awb Number", width: 250 },
    {
        field: "pod",
        headerName: "POD Url",
        width: 150,
        renderCell: (params) => {
            const url = params.value as string;
            return url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                >
                    Open POD
                </a>
            ) : (
                <span>-</span>
            );
        },
    },
    { field: "shipment_id", headerName: "Shipment Id", width: 340 },
    { field: "customer_name", headerName: "Customer Name", width: 170 },
    { field: "customer_mobile", headerName: "Customer Mobile", width: 150 },
    { field: "client_name", headerName: "Client Name", width: 200 },
    { field: "order_date", headerName: "Order Date", width: 250 },
    { field: "client_email", headerName: "Client Email", width: 200 },
    { field: "product_sku", headerName: "Product Sku", width: 250 },
    { field: "transaction_id", headerName: "Transaction Id", width: 250 },
    { field: "vendor_transaction_id", headerName: "Vendor Transaction Id", width: 250 },
    { field: "delivery_partner", headerName: "Delivery Partner", width: 250 },
    { field: "delivery_status", headerName: "Delivery Status", width: 250 },
    { field: "last_updated_at", headerName: " Last Updated", width: 250 },
];

const GetEpods = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)';
    const [epods, setEpods] = useState<Epod[]>([]);
    // console.log(epods, "daattttttttrt")
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [delivery_partner, setDeliveryPartner] = useState<string>('');
    const [awb_number, setAwb_number] = useState<string>('')
    const [searchString, setSearchString] = useState<string>('');
    const [download, setDownload] = useState<boolean>(false);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getEpods = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        try {
            console.log(333, 'Enter in GetEpod Function')
            const { formattedEpods, Count } = await Api.Epod.getEpod(page, size, delivery_partner, searchString, download, awb_number);
            Notiflix.Loading.remove();
            setEpods(formattedEpods);
            setPagination(Count);
            setLoading(false);
            // console.log("FORMATE Epod", Count,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const fields = [
        {
            name: "awb_number",
            label: "Awb Number",
            type: "number",
            placeholder: "AWB Number",
            validation: Yup.string().trim(),
        },
        {
            name: "delivery_partner",
            label: "Delivery Partner",
            type: "text",
            placeholder: "Enter Delivery Partner",
            validation: Yup.string().trim(),
        },
        {
            name: "searchString",
            label: "Vendor Transaction Id",
            type: "text",
            placeholder: "Vendor Transaction Id",
            validation: Yup.string().trim(),
        },

    ];

    const initialValues = {
        delivery_partner: '',
        searchString: '',
        awb_number: ''
    };

    const handleSubmit = (values: Record<string, string>) => {
        setDeliveryPartner(values.delivery_partner);
        setSearchString(values.searchString);
        setAwb_number(values.awb_number);
        setPage(1);
        handleCloseModal();
    };

    const handleExport = () => {
        const worksheet = xlsx.utils.json_to_sheet(epods);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "EPOD.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownload(true);
    };



    useEffect(() => {
        getEpods();
    }, [page, size, delivery_partner, searchString, download, awb_number]);

    useEffect(() => {
        if (searchString) {
            setIsModalOpen(false);
        }
    }, [searchString]);


    const buttons = [
        {
            text: "Filter",
            onClick: handleOpenModal,
        },
        {
            text: "Export",
            onClick: () => handleExport(),
        },
        {
            text: "Clear",
            onClick: () => {
                setEpods([]);
                setPage(1);
                setDeliveryPartner('');
                setSearchString('');
                setAwb_number('');
                setDownload(false);
            },
        },


    ];

    return (
        <>
            <BreadCrumbTwo name="EPOD" buttons={buttons} />
            <TableComponent
                rows={epods}
                columns={columns}
                rowCount={pagination}
                page={page}
                pageSize={size}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setSize(newSize)}
                loading={loading}
            />
            <ModalForm
                fields={fields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                modalTitle="Submit Your Details"
                isModalOpen={isModalOpen}
                closeModal={handleCloseModal}
            />

        </>
    );
};

export default GetEpods;
