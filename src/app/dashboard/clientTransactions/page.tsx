'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import ModalForm from '@/components/modalForm/page';
import Api from "@/services/api";
import { getVendorId } from '@/lib/utils';
import * as Yup from "yup";
import { RdIcon } from "@/components/shared/icons";


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


const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "service_type", headerName: "Service Type", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "credits", headerName: "Credits", width: 150 },
    { field: "vault_balance", headerName: "Vault Balance", width: 200 },
    { field: "transaction_id", headerName: "Transaction ID", width: 250 },
    { field: "vendor_id", headerName: "Vendor Id", width: 250 },
    { field: "vendor_transaction_id", headerName: "Vender Transaction ID", width: 250 },
    { field: "createdAt", headerName: "Created At", width: 250 },
    { field: "updatedAt", headerName: "Updated At", width: 250 },
];

const GetAllClientTransaction = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [vendors, setVendors] = useState<ClientTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [type, setType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [pagination, setPagination] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const fields = [
        {
            name: "type",
            label: "Type",
            type: "text",
            placeholder: "Type",
            validation: Yup.string().trim(),
        },
        {
            name: "status",
            label: "Status",
            type: "text",
            placeholder: "Enter Status",
            validation: Yup.string().trim(),
        },
    ];

    const initialValues = {
        status: '',
        type: '',
    };

    const handleSubmit = (values: Record<string, string>) => {
        setStatus(values.status);
        setType(values.type);
        setPage(1);
        handleCloseModal();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const vendor_id = getVendorId()

    const handleToBack = () => {
        router.push("/dashboard");
    };

    const getTransaction = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        try {
            // console.log(333, 'Enter in GetUpiTransaction Function')
            const { formattedUpiService, totaCount } = await Api.ClientTransaction.getAllClientTransaction(page, size, vendor_id, type, status);
            // console.log("FORMATE V....", formattedUpiService,)
            Notiflix.Loading.remove();
            setVendors(formattedUpiService);
            setPagination(totaCount);
            setLoading(false);
            // console.log("FORMATE VENDORS", formattedUpiService,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        getTransaction();
    }, [page, size, type, status]);


    const buttons = [
        {
            text: "Filter",
            onClick: handleOpenModal,
        },
        {
            text: "Clear",
            onClick: () => {
                setVendors([]);
                setPage(1);
                setStatus('');
                setType('');
            },
        },
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];


    return (
        <>
            <BreadCrumbTwo name="All  Transactions" buttons={buttons} />
            <TableComponent
                rows={vendors}
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

export default GetAllClientTransaction;
