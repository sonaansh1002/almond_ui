'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import ModalForm from '@/components/modalForm/page';
import Api from "@/services/api";
import * as Yup from "yup";
import { RdIcon } from "@/components/shared/icons";
import { useRouter } from 'next/navigation';


interface ClientService {
    id: number;
    name: string;
    service_provider: string;
    createdAt: string;
    updatedAt: string;
}


const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 70 },
    {
        field: "name",
        headerName: "Name",
        width: 150,
    },
    {
        field: "service_provider",
        headerName: "Provider",
        width: 150,
    },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 250,
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        width: 250,
    },

];

const GetAllClientService = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [vendors, setVendors] = useState<ClientService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [service_provider, setService_provider] = useState<string>('');

    const [pagination, setPagination] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const fields = [
        {
            name: "service_provider",
            label: "Provider",
            type: "text",
            placeholder: "Provider",
            validation: Yup.string().trim(),
        },

    ];

    const initialValues = {
        service_provider: '',
    };

    const handleSubmit = (values: Record<string, string>) => {
        setService_provider(values.service_provider);
        setPage(1);
        handleCloseModal();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const getService = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        try {
            // console.log(333, 'Enter in GetUpiTransaction Function')
            const { formattedService, totaCount } = await Api.ClientService.getAllClientService(page, size, service_provider);
            // console.log("FORMATE V....", formattedUpiService,)
            Notiflix.Loading.remove();
            setVendors(formattedService);
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
        getService();
    }, [page, size, service_provider]);

    const handleToBack = () => {
        router.push("/dashboard");
    };

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
                setService_provider('');
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
            <BreadCrumbTwo name="All Service" buttons={buttons} />
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

export default GetAllClientService;
