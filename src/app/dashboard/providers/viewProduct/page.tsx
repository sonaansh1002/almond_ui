'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from '@/services/api';
import { Button } from '@/components/ui/button';
import { RdIcon } from '@/components/shared/icons';

const ViewSkuProducts = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const accountType = searchParams.get('accountType') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [pagination, setPagination] = useState(0);

    const getProducts = async (page: number, size: number) => {
        console.log("Service Provider:", accountType); // Debug log

        if (!accountType) {
            Notiflix.Notify.failure("No service provider selected!");
            router.push('/dashboard/providers'); // Redirect if service_provider is invalid
            return;
        }


        Notiflix.Loading.standard();
        try {
            const response = await Api.Providers.getSkuProductList(accountType, page, size);
            console.log("API Response:", response); // Debug log
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

    // Move handleSku outside of the columns definition
    const handleSku = async (sku: string) => {
        console.log(1232222222, sku)
        try {
            const productData = await Api.Providers.getDetailsBySku(accountType, sku, products); // Notice we pass products here
            if (productData) {
                // router.push(`/dashboard/providers/viewProduct?accountType=${service_provider}`);
                // router.push(`/dashboard/providers/viewProduct?accountType=${accountType}/viewSku?sku=${sku}`)
                router.push(`/dashboard/providers/viewSku?accountType=${accountType}&sku=${sku}`);
            }
        } catch (error) {
            console.error("Error fetching SKU product:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        {
            field: "view",
            headerName: "View",
            width: 150,
            renderCell: (params) => (
                <Button onClick={() => handleSku(params.row.sku)} className='bg-transparent p-0 hover:bg-transparent'>
                    <RdIcon iconName='open-eye' iconclasses={["text-orange-700", "text-[50px]", 'mt-1']} />
                </Button>
            ),
        },
        { field: "sku", headerName: "SKU", width: 250 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "minPrice", headerName: "Min Price", width: 150 },
        { field: "maxPrice", headerName: "Max Price", width: 150 },
        { field: "createdAt", headerName: "Created At", width: 200 },
        { field: "updatedAt", headerName: "Updated At", width: 200 },
    ];

    useEffect(() => {
        if (accountType) {
            getProducts(page, size); // Ensure accountType is used in the API call
        } else {
            // router.push('/dashboard/providers/viewProduct/viewSku')
            Notiflix.Notify.failure("No account type provided!");
        }
    }, [accountType, page, size]);

    useEffect(() => {
        const accountType = searchParams.get('accountType');
        const sku = searchParams.get('sku');

        if (accountType && sku) {
            // Do something with accountType and sku, like fetching the product data
            router.push(`/dashboard/providers/viewProduct/viewSku`)
        }
    }, [searchParams]);

    const handleBack = async () => {
        router.push('/dashboard/providers')
    }
    const buttons = [
        {
            text: "Back",
            onClick: handleBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];
    return (
        <>
            <BreadCrumbTwo name={accountType} buttons={buttons} />
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

export default ViewSkuProducts;


