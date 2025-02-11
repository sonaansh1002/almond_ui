'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
// import { Product } from '@/services/api/Products/products'
import { GridRenderCellParams } from '@mui/x-data-grid';
import CommonButton from '@/components/Common/button';

interface FormattedUser {
    id: number;
    email: string;
    _id: string;
    project_id: string
}

const GetAllUsers = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [users, setUsers] = useState<FormattedUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);

    const router = useRouter()

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "email", headerName: "Email", width: 300 },
        {
            field: "_id", headerName: "Action", width: 250,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params;
                console.log(row, "row")
                return (
                    <div className='flex gap-5'>
                        {/* <div className="flex items-center ">
                            <CommonButton symbolIcon="+" buttonText='Create User' className='text-[12px]' onClick={() => handleToAddNewProduct()}></CommonButton>
                        </div> */}
                        <div className="flex items-center ">
                            <CommonButton symbolIcon="+" buttonText='Assign Project' className='text-[12px]' onClick={() => handleToAssignProject(row._id,)}></CommonButton>
                        </div>
                    </div >
                );
            },
        },
        { field: "project_id", headerName: "Projects", minWidth: 250, maxWidth: 700, width: 500 },

    ];

    const getUsers = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetVendor Function')
            const { formattedCatalogue, count } = await Api.PortalUser.getAllPotalUser(page, size);
            Notiflix.Loading.remove();
            console.log(formattedCatalogue, "cattt.................")
            setUsers(formattedCatalogue);
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

    const handleToAddNewProduct = () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        router.push(`/dashboard/portalUser/createUser`);
        Notiflix.Loading.remove();
    };

    const handleToAssignProject = (userId: string) => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        router.push(`/dashboard/portalUser/assignProject?userId=${userId}`);
        Notiflix.Loading.remove();
    };


    useEffect(() => {
        getUsers();
    }, [page, size,]);

    const buttons = [
        {
            text: "Create User",
            onClick: handleToAddNewProduct,
            icon: '+'
        }
    ];



    return (
        <>
            <BreadCrumbTwo name="Portal User" buttons={buttons} />
            <TableComponent
                rows={users}
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

export default GetAllUsers;