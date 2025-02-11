'use client'
import React from "react";
import DynamicForm from "@/components/shared/form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useAddProduct from '@/services/api/Products/products';
import { getToken } from "@/lib/utils";
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import { useEffect, useState } from "react";
import Api from "@/services/api";
import Notiflix from 'notiflix';
import { Vendor } from '@/services/api/Products/products'
import { Providers } from '@/services/api/Products/products'


const Add_Product = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const router = useRouter();
    const { addProduct } = useAddProduct();
    const [category_id, setCatId] = useState<{ value: string; label: string }[]>([]);
    const [sku, setSku] = useState<{ value: string; label: string }[]>([]);
    const [size, setSize] = useState<number>(10000);
    const [page, setPage] = useState<number>(1);

    console.log(setPage, "page..11")
    console.log(setSize, "page..22")

    const formFields = [
        {
            name: "category_id",
            label: "Category ",
            type: "select",
            placeholder: "Select a Category ",
            options: category_id, // Pass fetched options
            validation: Yup.string().required("Category is required"),
        },
        {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter Name  ",
            validation: Yup.string().trim().required("Name is required")
                .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')

        },
        {
            name: "brand_name",
            label: "Brand Name",
            type: "text",
            placeholder: "Enter Brand Name",
            validation: Yup.string().trim().required("Brand Name is required").matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')

        },
        {
            name: "product_sku",
            label: "Product Sku",
            type: "text",
            placeholder: "Enter Product Sku",
            validation: Yup.string().required("This Product Sku is required")
        },
        {
            name: "sku_account",
            label: "Sku",
            type: "select",
            placeholder: "Select a Sku",
            options: sku, // Pass fetched options
            validation: Yup.string().required("Sku is required"),

        },
        {
            name: "specification",
            label: "Specification",
            type: "select",
            placeholder: "Select Specification",
            options: [
                { value: "DIGITAL", label: "Digital" },
                { value: "PHYSICAL", label: "Physical" },
            ],
            validation: Yup.string()
                .trim()
                .required("Type is required")
                .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
        },

        {
            name: "main_image",
            label: "Image",
            type: "file",
            placeholder: "Upload Image",
            validation: Yup.string().trim().required("Image is required"),
        },
        {
            name: "long_description",
            label: "Description",
            type: "text",
            placeholder: "Enter Description",
            validation: Yup.string().trim().required("Description is required"),
        },
        {
            name: "mrp",
            label: "Mrp",
            type: "number",
            placeholder: "Enter Discount",
            validation: Yup.string().trim().required("Mrp is required"),
        },
        {
            name: "discount",
            label: "Discount",
            type: "number",
            placeholder: "Enter Discount",
            validation: Yup.string().trim().required("Discount is required"),
        },
        {
            name: "amount",
            label: "Amount",
            type: "number",
            placeholder: "Enter Amount",
            validation: Yup.string().trim().required("Amount is required"),
        },
        {
            name: "cost",
            label: "Cost",
            type: "number",
            placeholder: "Enter Cost",
            validation: Yup.string().trim().required("Cost is required"),
        },
        {
            name: "maxPrice",
            label: "Max Price",
            type: "number",
            placeholder: "Enter Max Price",
            validation: Yup.string().trim().required("Max Price is required"),
        },
        {
            name: "minPrice",
            label: "Min Price",
            type: "number",
            placeholder: "Enter Min Price",
            validation: Yup.string().trim().required("Min Price is required"),
        },
        {
            name: "price_type",
            label: "Price Type",
            type: "select",
            placeholder: "Enter Price Type",
            options: [
                { value: "SLAB", label: "Slab" },
                { value: "RANGE", label: "Range" },
            ],
            validation: Yup.string()
                .trim()
                .required("Type is required")
                .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
        },

        {
            name: "gst",
            label: "Gst",
            type: "text",
            placeholder: "Enter Gst",
            validation: Yup.string().trim().required("GST is required"),
        },
        {
            name: "brand_code",
            label: "Brand Code",
            type: "text",
            placeholder: "Enter Brand Code Link",
            validation: Yup.string().trim().required("Brand Code is required"),
        },

    ];

    const initialValues = {
        category_id: '',
        name: "",
        brand_name: "",
        product_sku: "",
        specification: "",
        main_image: "",
        long_description: "",
        mrp: '',
        discount: '',
        amount: '',
        cost: '',
        maxPrice: '',
        minPrice: '',
        price_type: "",
        gst: '',
        brand_code: "",
        sku_account: ""
    };


    const handleSubmit = (values: Record<string, string>) => {
        const formData = new FormData();

        // Append fields to FormData
        formData.append('category_id', values.category_id);
        formData.append('name', values.name);
        formData.append('brand_name', values.brand_name);
        formData.append('product_sku', values.product_sku);
        formData.append('specification', values.specification);
        formData.append('long_description', values.long_description);
        formData.append('mrp', values.mrp);
        formData.append('discount', values.discount);
        formData.append('amount', values.amount);
        formData.append('cost', values.cost);
        formData.append('maxPrice', values.maxPrice);
        formData.append('minPrice', values.minPrice);
        formData.append('price_type', values.price_type);
        formData.append('gst', values.gst);
        formData.append('brand_code', values.brand_code);
        formData.append('sku_account', values.sku_account);

        // Append file if it exists
        if (values.main_image) {
            formData.append('main_image', values.main_image); // Ensure `main_image` is a File object
        }

        // Call the addProduct service
        const token = getToken();
        if (token) {
            addProduct(formData); // Pass FormData object to the service
        }
    };



    const handleToBack = () => {
        router.push("/dashboard/product");
    };

    // add new code to get subcat--

    const getSubCat = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {
            console.log(333, 'Enter in GetVendor Function')
            const { formattedVendors, } = await Api.Products.getAllSubcat();
            console.log(formattedVendors, "vender")
            Notiflix.Loading.remove();
            const options = formattedVendors.map((vendor: Vendor) => ({
                value: vendor._id,
                label: vendor.name,
            }));
            setCatId(options);
            // setPagination(totaCount);
            console.log("FORMATE VENDORS", formattedVendors,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            // setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    const getSkuService = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {
            console.log(333, 'Enter in GetVendor Function')
            const { formattedProvider } = await Api.Products.getAllSkuService(page, size);
            console.log(formattedProvider, "vender")
            Notiflix.Loading.remove();
            const options = formattedProvider.map((vendor: Providers) => ({
                // value: vendor._id,
                label: vendor.service_provider,
            }));
            setSku(options);
            // setPagination(totaCount);
            console.log("FORMATE VENDORS", formattedProvider,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            // setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        getSubCat();
        getSkuService();
    }, []);


    const buttons = [
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />
        },
    ];

    return (
        <>
            <BreadCrumbTwo name="Add Product" buttons={buttons} />
            <DynamicForm
                fields={formFields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default Add_Product;


