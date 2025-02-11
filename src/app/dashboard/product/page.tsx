'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";
import { RdIcon } from '@/components/shared/icons';
import ModalForm from '@/components/modalForm/page';
import * as Yup from "yup";
import { Product } from '@/services/api/Products/products'


const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    // { field: "sub_category_id", headerName: "Sub Catagory Id" },
    // { field: "qc_cat_id", headerName: "Qc Catagory Id", width: 250 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "brand_name", headerName: "Brand Name", width: 150 },
    { field: "qc_sku", headerName: "Product Sku", width: 150 },
    { field: "sku", headerName: "APC", width: 250 },
    { field: "sku_account", headerName: "Sku Account", width: 250 },
    { field: "specification", headerName: "Specification", width: 200 },
    { field: "main_image", headerName: "Main Image", width: 200 },
    // { field: "short_description", headerName: "Short Description", width: 250 },
    { field: "long_description", headerName: "Long Description", width: 250 },
    { field: "short_description", headerName: "Short Description", width: 250 },
    { field: "mrp", headerName: "Mrp", width: 250 },
    { field: "discount", headerName: "Discount", width: 250 },
    { field: "amount", headerName: "Amount", width: 250 },
    { field: "cost", headerName: "Cost", width: 250 },
    { field: "maxPrice", headerName: "Max Price", width: 250 },
    { field: "minPrice", headerName: "Min Price", width: 250 },
    { field: "price_type", headerName: "Price Type", width: 250 },
    { field: "type", headerName: "Type", width: 250 },
    // { field: "gst", headerName: "Gst", width: 250 },
    // { field: "brand_code", headerName: "Brand Code", width: 250 }
    { field: "validity", headerName: "Validity", width: 250 },
    { field: "status", headerName: "Status", width: 250 },

];

const GetAllProducts = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sku, setSku] = useState<string>('');
    const [qc_sku, setQc_Sku] = useState<string>('')
    // const [searchString, setSearchString] = useState<string>('');
    const [specification, setSpecification] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [brand_name, setBrand_name] = useState<string>('')
    const [validity, setValidity] = useState<string>('')
    const [sku_account, setSku_Account] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const router = useRouter()

    // Re-fetch Products when page or size changes
    const getProducts = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetVendor Function')
            const { formattedProducts, count } = await Api.Products.getAllProducts(page, size, sku, qc_sku, specification, name, brand_name, sku_account,);

            Notiflix.Loading.remove();
            setProducts(formattedProducts);
            setPagination(count);
            setLoading(false);
            console.log("FORMATE PRODUCTS", formattedProducts,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99897, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    const fields = [
        {
            name: "brand_name",
            label: "Brand Name",
            type: "text",
            placeholder: "Brand Name",
            validation: Yup.string().trim(),
        },
        {
            name: "sku",
            label: "Sku",
            type: "text",
            placeholder: "Enter Sku",
            validation: Yup.string().trim(),
        },
        {
            name: "specification",
            label: "Specification",
            type: "text",
            placeholder: "Specification",
            validation: Yup.string().trim(),
        },
        {
            name: "qc_sku",
            label: "Qc Sku",
            type: "text",
            placeholder: "Qc Sku",
            validation: Yup.string().trim(),
        }, {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "name",
            validation: Yup.string().trim(),
        }, {
            name: "sku_account",
            label: "Sku Account",
            type: "text",
            placeholder: "Sku Account",
            validation: Yup.string().trim(),
        }, {
            name: "validity",
            label: "validity",
            type: "text",
            placeholder: "Validity",
            validation: Yup.string().trim(),
        }, {
            name: "status",
            label: "Status",
            type: "text",
            placeholder: "Status",
            validation: Yup.string().trim(),
        },

    ];

    const initialValues = {
        sku: '',
        qc_sku: '',
        specification: '',
        brand_name: '',
        name: '',
        sku_account: '',
        validity: '',
        status: '',
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleToAddNewProduct = () => {
        Notiflix.Loading.init({ svgColor: Loader_Color })
        Notiflix.Loading.standard(); // Show loader  
        router.push("/dashboard/product/addProduct");
        Notiflix.Loading.remove()
    };
    const handleSubmit = (values: Record<string, string>) => {
        setSku(values.sku);
        setQc_Sku(values.qc_sku)
        setSpecification(values.specification);
        setBrand_name(values.brand_name);
        setName(values.name)
        setSku_Account(values.sku_account);
        setValidity(values.validity)
        setStatus(values.status)

        // setPage(1);
        handleCloseModal();
    };
    useEffect(() => {
        getProducts();
    }, [page, size, sku, qc_sku, specification, name, brand_name, sku_account]);


    useEffect(() => {
        if (specification) {
            setIsModalOpen(false);
        }
    }, [specification]);


    const handleExport = async () => {
        try {
            console.log("HANDLE EXPORT");
            const params: Record<string, unknown> = {};
            if (sku) params.sku = sku;
            if (qc_sku) params.sku = qc_sku;
            if (specification) params.specification = specification;
            if (brand_name) params.brand_name = brand_name;
            if (name) params.name = name;
            if (sku_account) params.sku_account = sku_account;
            if (validity) params.validity = validity;
            if (status) params.status = status;

            const filename = "Product-List.csv";
            await Api.ExportProduct.exportProductFile(params, filename)
            Notiflix.Notify.success('File export successful')
        } catch {
            Notiflix.Notify.failure('Failed to Export File')
            // console.error("Error during export:", error);
        }
    };
    const buttons = [
        {
            text: "Filter",
            // onClick: () => handleExport(),
            onClick: handleOpenModal,

            // icon: <RdIcon iconName="download" />,
        },
        {
            text: "Export",
            onClick: () => handleExport(),
            icon: <RdIcon iconName="download" />,
        },
        {
            text: "Add",
            onClick: handleToAddNewProduct,
            icon: '+'
        },

    ];

    return (
        <>
            <BreadCrumbTwo name="Products" buttons={buttons} />
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

export default GetAllProducts;









