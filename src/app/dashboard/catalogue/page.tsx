'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
import { GridRenderCellParams } from '@mui/x-data-grid';
import CommonButton from '@/components/Common/button';
import { Button } from '@/components/ui/button';
import { RdIcon } from '@/components/shared/icons';


export interface AllCatalogue {
    id: number;
    catalogue_name: string;
    slug: string;
    created_by: string;
    unique_name: string;
    _id: string;
    vendor_id: string;
    organization_name: string;
}

const GetAllCatalogue = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    // const [products, setProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<AllCatalogue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);

    const router = useRouter()

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "catalogue_name", headerName: "Catalogue Name", width: 150 },
        { field: "slug", headerName: "Slug", width: 150 },
        { field: "created_by", headerName: "Created By", width: 150 },
        { field: "unique_name", headerName: "Unique Name", width: 150 },
        { field: "vendor_id", headerName: "Vendor Id", width: 150 },
        { field: "organization_name", headerName: "Projects", width: 150 },

        {
            field: "_id", headerName: "Action", width: 200,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params; // Access the entire row data like name / service_provider
                console.log(row, "row")
                return (
                    <div className='flex gap-5 justify-center '>
                        <div className="flex items-center ">
                            <CommonButton symbolIcon="+" buttonText='Products' className='' onClick={() => handleToAddNewProduct(row._id, row.vendor_id)}></CommonButton>
                        </div>
                        <div className="flex items-center ">
                            <Button size={"add"} variant={"secondary"} onClick={() => handleView(row._id)} className='bg-transparent p-0 hover:bg-transparent' >
                                <RdIcon iconName='open-eye' iconclasses={["text-orange-700"]} />
                            </Button>
                        </div>
                    </div >
                );
            },
        },
    ];

    const getProducts = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetVendor Function')
            const { formattedCatalogue, count } = await Api.AllCatalogue.getAllCatalogue(page, size);
            Notiflix.Loading.remove();
            setProducts(formattedCatalogue);
            setPagination(count);
            setLoading(false);
            console.log("FORMATE PRODUCTS", formattedCatalogue,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99897, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleView = (_id: string) => {
        Notiflix.Loading.init({ svgColor: Loader_Color })
        Notiflix.Loading.standard();
        router.push(`/dashboard/catalogue/view?_id=${_id}`);
        Notiflix.Loading.remove()
    };

    const handleToAddNewProduct = (catalogueId: string, vendorId: string) => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        router.push(`/dashboard/catalogue/productAdd?catalogueId=${catalogueId}&vendorId=${vendorId}`);
        Notiflix.Loading.remove();
    };


    const handleToAddNewCat = () => {
        Notiflix.Loading.init({ svgColor: Loader_Color })
        Notiflix.Loading.standard();
        router.push("/dashboard/catalogue/add");
        Notiflix.Loading.remove()
    };

    useEffect(() => {
        getProducts();
    }, [page, size,]);



    const buttons = [
        {
            text: "Add",
            onClick: handleToAddNewCat,
            icon: '+'
        }
    ];

    return (
        <>
            <BreadCrumbTwo name="Catalogue" buttons={buttons} />
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

export default GetAllCatalogue;