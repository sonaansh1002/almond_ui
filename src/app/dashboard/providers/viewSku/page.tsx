'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from '@/services/api';
import { RdIcon } from '@/components/shared/icons';
import { Product } from '@/services/api/Providers/interfaces'



const ViewSkuDetails = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const accountType = searchParams.get('accountType') || '';
    const sku = searchParams.get('sku') || '';
    // const [isExporting, setIsExporting] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [pagination, setPagination] = useState(0);

    const getSkuProducts = async (page: number, size: number) => {
        console.log("Service Provider:", accountType); // Debug log

        if (!accountType) {
            Notiflix.Notify.failure("No service provider selected!");
            router.push('/dashboard/providers'); // Redirect if service_provider is invalid
            return;
        }

        if (!sku) {
            Notiflix.Notify.failure("No sku selected!");
            router.push('/dashboard/providers'); // Redirect if sku is invalid
            return;
        }

        Notiflix.Loading.standard();
        try {
            const response = await Api.Providers.getProductDataBysku(accountType, sku, page, size);
            console.log("API Response12345:", response); // Debug log
            if (response) {
                const { formattedProducts, count } = response;
                setProducts(formattedProducts || []);
                setPagination(count || 0);
            } else {
                setProducts([]);
                setPagination(0);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
            setPagination(0);
        } finally {
            Notiflix.Loading.remove();
            setLoading(false);
        }
    };
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "sku", headerName: "SKU", width: 250 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "description", headerName: "Description", width: 150 },
        // { field: "price", headerName: "Price", width: 150 },
        { field: "type", headerName: "Type", width: 150 },
        { field: "min", headerName: "Min Price", width: 150 },
        { field: "max", headerName: "Max Price", width: 150 },
        { field: "denominations", headerName: "Denominations", width: 150 },
        { field: "thumbnail", headerName: "Thumbnail Image", width: 150 },
        { field: "mobile", headerName: "Mobile Image", width: 150 },
        { field: "base", headerName: "Base Image", width: 150 },
        { field: "small", headerName: "Small Image", width: 150 },
        { field: "link", headerName: "T&C Link", width: 150 },
        { field: "content", headerName: "T&C Content", width: 150 },
        { field: "discounts", headerName: "Discount", width: 150 },
        { field: "brandName", headerName: "Brand Name", width: 150 },
        { field: "createdAt", headerName: "Created At", width: 200 },
        { field: "updatedAt", headerName: "Updated At", width: 200 },
    ];


    const handleExport = async () => {
        try {
            console.log("HANDLE EXPORT");
            const params: Record<string, unknown> = {};
            const filename = "Sku-Product-List.csv";
            // Ensure sku and accountType (service_provider) are passed explicitly
            await Api.ProvidersExport.exportSkuFile(params, sku || "", accountType || "", filename);
            Notiflix.Notify.success('File export successful')
        } catch {
            Notiflix.Notify.failure('Failed to Export File')
            // console.error("Error during export:", error);
        }
    };

    useEffect(() => {
        if (sku && accountType) {
            getSkuProducts(page, size); // Ensure accountType is used in the API call
        } else {
            Notiflix.Notify.failure("No account type provided!");
        }
    }, [accountType, page, size]);

    const handleBack = async () => {
        router.push(`/dashboard/providers/viewProduct?accountType=${accountType}`)
    }
    const buttons = [
        {
            text: "Export",
            onClick: () => handleExport(),
            icon: <RdIcon iconName="download" />,
        },
        {
            text: "Back",
            onClick: handleBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];

    return (
        <>
            <BreadCrumbTwo name="Sku Details" buttons={buttons} />
            <TableComponent
                rows={products}
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

export default ViewSkuDetails;


