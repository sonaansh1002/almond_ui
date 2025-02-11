'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
// import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
import { getVendorId } from '@/lib/utils';
import { convertText } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { RdIcon } from "@/components/shared/icons";


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


const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "service_type", headerName: "Service Type" },
    { field: "type", headerName: "Type", width: 250 },
    { field: "vendor_id", headerName: "Client ID", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "credits", headerName: "Credits", width: 150 },
    { field: "vault_balance", headerName: "Vault Balance", width: 200 },
    { field: "is_credit_used", headerName: "Is Credit Used", width: 200 },
    { field: "transaction_id", headerName: "Transaction ID", width: 250 },
    { field: "vendor_transaction_id", headerName: " Client  Transaction ID", width: 250 },
    { field: "createdAt", headerName: "Created At", width: 250 },
    { field: "updatedAt", headerName: "Updated At", width: 250 },

];

const GetAllUpiTransaction = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [vendors, setVendors] = useState<UpiTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    console.log(pagination, "paggg")

    const router = useRouter();
    const { serviceName } = useParams() as { serviceName?: string }; // Use useParams for dynamic routing
    // console.log("SERVICE-NAME", serviceName)
    const formattedServiceName = convertText(serviceName ?? '');
    console.log(121212, formattedServiceName)

    const vendor_id = getVendorId()
    // Re-fetch vendors when page or size changes
    const getVendors = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetUpiTransaction Function')
            const { formattedUpiService, totaCount } = await Api.UpiTransaction.getAllUpiTransaction(page, size, serviceName || "default", vendor_id);
            console.log("FORMATE V....", formattedUpiService,)
            Notiflix.Loading.remove();
            setVendors(formattedUpiService);
            setPagination(totaCount);
            setLoading(false);
            console.log("FORMATE VENDORS", formattedUpiService,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleToBack = () => {
        router.push("/dashboard");
    };

    useEffect(() => {
        getVendors();
    }, [page, size]);

    const buttons = [
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];

    return (
        <>
            <BreadCrumbTwo name={`${formattedServiceName}-Transactions`} buttons={buttons} />
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
        </>
    );
};

export default GetAllUpiTransaction;
