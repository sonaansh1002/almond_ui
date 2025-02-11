
'use client'
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/shared/dataGrid';
import { RdIcon } from '@/components/shared/icons';
import { GridColDef } from '@mui/x-data-grid';
import CommonButton from '@/components/Common/button';
import Api from '@/services/api'
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import { Button } from '@/components/ui/button';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


interface Vendor {
    id: number;
    service_provider: string;
    name: string;
    check_balance: string;
    updated_balance: string;
    createdAt: string;
    updatedAt: string;
    accountType: string
}

const GetAllProviders = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [visibleBalances, setVisibleBalances] = useState<Record<number, boolean>>({});
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState(false);
    const router = useRouter()

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "view",
            headerName: "View",
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params; // Access the entire row data like name / service_provider
                const isCouponCard = row.name === "coupon_card";

                return (
                    <div className="flex items-center ">
                        {/* Conditionally show the export button */}
                        {isCouponCard && (
                            <Button onClick={() => handleCheckSku(row.service_provider)} className='bg-transparent p-0 hover:bg-transparent' >
                                <RdIcon iconName='open-eye' iconclasses={["text-orange-700", "text-[50px]", 'mt-1']} />
                            </Button>

                        )}
                    </div>
                );
            },

        },
        { field: "service_provider", headerName: "Providers", width: 200 },
        { field: "name", headerName: "Service Type", width: 250 },
        {
            field: "check_balance",
            headerName: "Check Balance",
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params; // Access the entire row data like name / service_provider
                const serviceProviders = ['QC_BGC', 'QC_Almonds', 'QC_Atechnos', 'joyalukkas', 'QC_Flipkart', 'Hubble', 'SprintVerify'];
                const isServiceProvider = serviceProviders.includes(row.service_provider);
                console.log(isServiceProvider)
                return (
                    <div className="flex items-center ">
                        {isServiceProvider && (
                            <CommonButton symbolIcon={<RdIcon iconName='refresh' iconclasses={["text-white", "text-[32px]"]}
                            />} buttonText='Balance' onClick={() => handleCheckBalance(row.id)}></CommonButton>
                        )}
                    </div>
                );
            },
        },
        {
            field: "updated_balance",
            headerName: "Updated Balance",
            width: 250,
            renderCell: (params) => {
                const isVisible = visibleBalances[params.row.id];
                return isVisible ? params.row.updated_balance : null;
            },
        },

        {
            field: "product", headerName: "Product", width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params; // Access the entire row data like name / service_provider
                const isCouponCard = row.name === "coupon_card";

                return (
                    <div className="flex items-center ">
                        {/* Conditionally show the export button */}
                        {isCouponCard && (
                            <Button
                                onClick={() => handleExportCouponCard(row.service_provider)}

                                className=" bg-orange-600  mt-[10px]" size={'export'}
                                disabled={isExporting}
                            >
                                {isExporting ? <RdIcon iconName='download' iconclasses={["text-white text-[10px]"]} /> : <RdIcon iconName='download' iconclasses={["text-white text-[10px]"]} />}

                            </Button>

                        )}
                    </div>
                );
            },
        },

        { field: "createdAt", headerName: "Created At", width: 150 },
        { field: "updatedAt", headerName: "Updated At", width: 150 },
    ];

    const getServices = async () => {
        setLoading(true);
        try {
            const { formattedProvider, totaCount } = await Api.Providers.getAllProviders(page, size);
            setVendors(formattedProvider);
            setPagination(totaCount);
            console.log(totaCount, "TOTAL_COUNT")
            setLoading(false);
            console.log("FORMATE VENDORS", formattedProvider,)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getServices();
    }, [page, size]);



    const handleCheckBalance = async (id: number) => {
        const balance = await Api.Providers.getCheckBalance(id, vendors);
        if (balance !== null) {
            // Update the updated_balance column for the specific provider with updated balance 
            setVendors((prev) =>
                prev.map((dt) =>
                    dt.id === id
                        ? { ...dt, updated_balance: balance }
                        : dt
                )
            );
            setVisibleBalances((prev) => ({ ...prev, [id]: true }));
            // Hide the balance after 20 seconds
            setTimeout(() => {
                setVisibleBalances((prev) => ({ ...prev, [id]: false }));
            }, 20000);
        }
    };


    const handleCheckSku = async (service_provider: string) => {
        try {
            const productData = await Api.Providers.getDetailsByServiceProvider(service_provider, vendors);
            if (productData) {
                router.push(`/dashboard/providers/viewProduct?accountType=${service_provider}`);
            }
        } catch (error) {
            console.error("Error fetching SKU product:", error);
        }
    };




    const handleExportCouponCard = async (service_provider?: string) => {
        try {
            setIsExporting(true); // Disable button when clicked
            const params: Record<string, unknown> = {};
            if (service_provider) params.service_provider = service_provider;
            const filename = "Product-List.csv";
            await Api.ProvidersExport.exportFile(params, filename);
            console.log("File export successful");
        } catch (error) {
            console.error("Error during export:", error);
        } finally {
            setIsExporting(false); // Enable button after response
        }
    };


    const handleBack = async () => {
        router.push('/dashboard')
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
            <BreadCrumbTwo name="Providers" buttons={buttons} />
            <TableComponent<Vendor>
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

export default GetAllProviders;
