'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
import { AllProductCatalogue } from '@/services/api/allCatalogue/view'
import { RdIcon } from '@/components/shared/icons';
import { useSearchParams } from 'next/navigation';

interface Cat {
    name: string;
    brand_name: string;
    sku: string;
    qc_sku: string;
    specification: string;
    main_image: string;
    short_description: string;
    long_description: string;
    mrp: number;
    discount: number;
    cost: number;
    price_points: number;
    stock: string;
    min_qty_per_order: string;
    max_qty_per_order: string;
    isDuration: string;
    duration_start: string;
    duration_end: string;
}


const GetAllProduct = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [products, setProducts] = useState<AllProductCatalogue[]>([]);
    console.log(products, "alll")

    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [catalogueName, setCatalogueName] = useState<string>('');
    const [organizationName, setOrganizationName] = useState<string>('');


    const searchParams = useSearchParams();
    const catalogueId = searchParams.get('_id');
    const router = useRouter()

    const columns: GridColDef[] = [
        { field: "sno", headerName: "S.No", width: 50 },
        { field: "name", headerName: " Name", width: 150 },
        { field: "brand_name", headerName: "Brand Name", width: 150 },
        { field: "sku", headerName: "APC", width: 150 },
        { field: "qc_sku", headerName: "Sku", width: 150 },
        { field: "specification", headerName: "Specification", width: 150 },
        { field: "main_image", headerName: "Image", width: 150 },
        { field: "short_description", headerName: "Short Description", width: 300 },
        { field: "long_description", headerName: "Long Description", width: 300 },
        { field: "discount", headerName: "Discount", width: 150 },
        { field: "cost", headerName: "Cost", width: 150 },
        { field: "price_points", headerName: "price points", width: 150 },
        { field: "mrp", headerName: "MRP", width: 150 },
        // { field: "stock", headerName: "Stock", width: 150 },
        // { field: "min_qty_per_order", headerName: "Min qty per order", width: 150 },
        // { field: "max_qty_per_order", headerName: "Max qty per order", width: 150 },
        // { field: "isDuration", headerName: "IsDuration", width: 150 },
        // { field: "duration_start", headerName: "Duration start", width: 150 },
        // { field: "duration_end", headerName: "Duration end", width: 150 },
        // { field: "sno", headerName: "S", width: 50 },
    ];


    const getProducts = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader
        try {
            if (!catalogueId) {
                console.error("Catalogue ID not found in query params.");
                return;
            }

            const { formattedProductCatalogue, count } = await Api.View.getAllProductCatalogue(catalogueId);
            console.log("FORMATE PRODUCTS", formattedProductCatalogue);
            console.log("PRODUCT DETAILS", formattedProductCatalogue?.[0]?.productDetails);

            if (formattedProductCatalogue?.[0]) {
                setCatalogueName(formattedProductCatalogue[0].catalogue_name || 'N/A');
                setOrganizationName(formattedProductCatalogue[0].organization_name || 'N/A');
            }


            // Map product details and add `id` from the catalogue
            const productRows = formattedProductCatalogue?.[0]?.productDetails?.map((vendor: Cat, i: number) => ({
                id: `${formattedProductCatalogue?.[0]?._id}-${i}`, // Combine catalogue ID with an index for uniqueness
                sno: i + 1,
                name: vendor.name,
                brand_name: vendor.brand_name,
                sku: vendor.sku,
                qc_sku: vendor.qc_sku,
                specification: vendor.specification,
                main_image: vendor.main_image,
                short_description: vendor.short_description,
                long_description: vendor.long_description,
                mrp: vendor.mrp,
                discount: vendor.discount,
                cost: vendor.cost,
                price_points: vendor.price_points,
                catalogue_name: formattedProductCatalogue?.[0]?.catalogue_name, // Corrected access
                organization_name: formattedProductCatalogue?.[0]?.organization_name,
                // stock: vendor.stock,
                // min_qty_per_order: vendor.min_qty_per_order,
                // max_qty_per_order: vendor.max_qty_per_order,
                // isDuration: vendor.isDuration,
                // duration_start: vendor.duration_start,
                // duration_end: vendor.duration_end,
            }));

            console.log("Processed Rows", productRows);

            Notiflix.Loading.remove();
            setProducts(productRows || []); // Set the processed rows
            setPagination(count);
            setLoading(false);
        } catch (error) {
            Notiflix.Loading.remove();
            console.error(error);
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        if (catalogueId) {
            getProducts();
        }
    }, [catalogueId]);

    const handleToBack = () => {
        router.push("/dashboard/catalogue");
    };

    const buttons = [
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];

    return (
        <>
            <BreadCrumbTwo name="Product Catalogue" buttons={buttons} />
            <span className="flex justify-center items-center bg-white px-2 mb-2 py-1 shadow-md rounded-[5px]">
                <div className="flex gap-2">
                    <h1 className="text-gray-600 sm:text-sm md:text-sm lg:text-md font-semibold p-1">Organization Name -</h1>
                    <h2 className="text-gray-400 sm:text-sm md:text-sm lg:text-md font-semibold p-1">{organizationName}</h2>
                </div>
                <div className="flex gap-2">
                    <h1 className="text-gray-600 sm:text-sm md:text-sm lg:text-md font-semibold p-1">Catalogue Name -</h1>
                    <h2 className="text-gray-400 sm:text-sm md:text-sm lg:text-md font-semibold p-1">{catalogueName}</h2>
                </div>
            </span>
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
}

export default GetAllProduct;


