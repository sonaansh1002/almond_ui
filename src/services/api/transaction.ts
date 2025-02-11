import apiClient from "@/services/apiClient";
import { exportExcel, getDateAndTime } from "@/lib/utils";


// Get all Transactions 
interface TransactionData {
  credits: string;
  service_type: string;
  vendorData?: {
    organization_name?: string;
  };
  type: string;
  status: string;
  transaction_id: string;
  vault_balance: string;
  vendor_id: string;
  msisdn: string;
  vendor_transaction_id: string;
  createdAt: string;
  updatedAt: string;
}

interface GetAllTransactionsResponse {
  data: {
    data: TransactionData[];
    totaCount: number;
    success: boolean;
  };
}

export const getAllTransactions = async (page: number, size: number, status?: string) => {
  try {
    const response: GetAllTransactionsResponse = await apiClient.post(
      `/gratification/get-all-transactions?page=${page}&size=${size}`,
      { status }
    );

    const {
      data: { data: vendorsData, totaCount: totalCount, success },
    } = response;

    if (!success) {
      throw new Error("Failed to fetch transactions");
    }

    const result = vendorsData.map((dt, i) => {
      let updatedServiceType: string;
      switch (true) {
        case dt?.service_type?.toUpperCase().startsWith("QC"):
          updatedServiceType = "Quicksilver";
          break;
        case dt?.service_type?.toLowerCase() === "vouchers":
          updatedServiceType = "Almonds Vouchers";
          break;
        default:
          updatedServiceType = dt?.service_type;
      }

      const { date: createdAtDate, time: createdAtTime } = getDateAndTime(dt.createdAt || '');
      const { date: updatedAtDate, time: updatedAtTime } = getDateAndTime(dt.updatedAt || '');

      return {
        id: (page - 1) * size + i + 1,
        credits: dt.credits,
        merchant_account: updatedServiceType,
        service_type: updatedServiceType,
        organization_name: dt.vendorData?.organization_name || "",
        type: dt.type,
        status: dt.status,
        transaction_id: dt.transaction_id,
        vault_balance: dt.vault_balance,
        vendor_id: dt.vendor_id,
        msisdn: dt.msisdn,
        vendor_transaction_id: dt.vendor_transaction_id,
        createdAt: `${createdAtDate} ${createdAtTime}`,
        updatedAt: `${updatedAtDate} ${updatedAtTime}`,
      };
    });

    return { data: result, totalCount };
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    throw error;
  }
};

// Export Transactions Function..!!
export const exportTransactions = async (status: string) => {
  try {
    const response = await apiClient.post(
      "/gratification/export-transactions",
      { status },
      { responseType: "blob" } // Expecting file download
    );
    exportExcel(response.data)
  } catch (error) {
    console.error("Error exporting transactions:", error);
    throw error; // Propagate error for handling in the calling function
  }
};

