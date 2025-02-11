"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Notiflix from "notiflix";
import Api from "@/services/api";
import TableComponent from "@/components/shared/dataGrid";
import { RdIcon } from "@/components/shared/icons";
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';

interface Transaction {
    id: number;
    credits: string;
    service_type: string;
    merchant_account: string;
    type: string;
    msisdn: string;
    status: string;
    transaction_id: string;
    organization_name: string;
    vault_balance: string;
    vendor_id: string;
    vendor_transaction_id: string;
    createdAt: string;
    updatedAt: string;
}

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "credits", headerName: "Amount", width: 200 },
    { field: "service_type", headerName: "Service Type", width: 250 },
    { field: "merchant_account", headerName: "Merchant Account", width: 250 },
    { field: "msisdn", headerName: "Msisdn", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "transaction_id", headerName: "Transaction Id", width: 250 },
    { field: "organization_name", headerName: "Organization Name", width: 250 },
    { field: "vault_balance", headerName: "Wallet Balance", width: 250 },
    { field: "vendor_id", headerName: "Vendor Id", width: 250 },
    {
        field: "vendor_transaction_id",
        headerName: "Vendor Transaction Id",
        width: 250,
    },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 },
];

const GetAllTransactions = () => {
    const Loader_Color = "rgba(241,230,230,0.985)";

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [isExporting, setIsExporting] = useState(false); // State to manage xport button disabled

    const getTransactions = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader
        try {
            const { data, totalCount } = await Api.Transactions.getAllTransactions(page, size, filterStatus);
            setTransactions(data);
            setPagination(totalCount);
        } catch (error) {
            Notiflix.Loading.remove();
            console.error("Error fetching transactions:", error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const handleExport = async () => {
        console.log(989898);
        console.log("Exporting transactions...");
        try {
            setIsExporting(true); // Disable button when clicked
            await Api.Transactions.exportTransactions("approved"); // Call the service function
            console.log("Export successful!");
        } catch (error) {
            console.error("Error exporting transactions:", error);
        } finally {
            setIsExporting(false); // Re-enable button after all the process..
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
    };
    useEffect(() => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        getTransactions();
    }, [page, size, filterStatus]);


    const buttons = [
        {
            component: (
                <select
                    value={filterStatus}
                    onChange={handleStatusChange}
                    className="border h-[40px] rounded-sm focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700"
                >
                    <option value="">Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                </select>
            ),
        },
        {
            text: isExporting ? "Exporting..." : "Export List",
            icon: (
                <RdIcon
                    iconName="download"
                    iconclasses={["text-white", "text-[32px]", "font-bold"]}
                />
            ),
            onClick: handleExport,
            className: `export-button ${isExporting ? "export-button-disabled" : "export-button-active"}`,
            disabled: isExporting,
        },
    ];


    return (
        <>
            <BreadCrumbTwo name="Transactions" buttons={buttons} />
            <TableComponent
                rows={transactions}
                columns={columns}
                rowCount={pagination}
                page={page}
                pageSize={size}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setSize(newSize)}
            />
        </>
    );
};

export default GetAllTransactions;
