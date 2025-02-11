'use client'
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useAddProductCatalogue from "@/services/api/allCatalogue/addProduct";
import { getToken } from "@/lib/utils";
import BreadCrumbTwo from "@/components/Common/breadCrumbTwo";
import DynamicProductForm from "@/components/shared/productForm";
import { Button } from "@/components/ui/button";
import Api from "@/services/api";
import { useSearchParams } from 'next/navigation';
import Notiflix from 'notiflix';


interface Product {
    id: number;
    _id: string;
    name?: string;
}
interface ProductType {
    product_id: string;
    mrp: string;
    discount: string;
    cost: string;
    price_points: string;
    stock: string;
    min_qty_per_order: string;
    max_qty_per_order: string;
    isDuration: boolean;
    duration_start: string;
    duration_end: string;
}

const Add_Product = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const router = useRouter();
    const { addProductCatalogue } = useAddProductCatalogue();
    const searchParams = useSearchParams();

    const catalogueId = searchParams.get('catalogueId');
    const vendorId = searchParams.get('vendorId');


    const [page, setPage] = useState<number>(1);
    console.log(setPage, "page..11")
    const [size, setSize] = useState<number>(10000);
    console.log(setSize, "page..22")
    const [pagination, setPagination] = useState<number>(0);
    console.log(pagination, "page..33")

    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
    console.log("CAT----", categories)

    const getVendors = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetVendor Function')
            const { formattedProducts, count } = await Api.AddCatProduct.getAllProducts(page, size,);
            console.log(formattedProducts, "product")
            const options = formattedProducts.map((vendor: Product) => ({
                value: vendor._id,
                label: vendor.name,

            }));
            setCategories(options);
            setPagination(count)

            console.log("FORMATE VENDORS", formattedProducts,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            // setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        getVendors();
    }, [page, size]);


    const [products, setProducts] = useState([
        {
            product_id: "",
            mrp: "",
            discount: "",
            cost: "",
            price_points: "",
            stock: "",
            min_qty_per_order: "",
            max_qty_per_order: "",
            isDuration: true, // ✅ Set default as boolean
            duration_start: "",
            duration_end: "",
        },
    ]);
    // const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [submittedForms, setSubmittedForms] = useState<boolean[]>(products.map(() => false)); console.log(products, "product")

    const formFields = [
        {
            name: "product_id",
            label: "Product",
            type: "select",
            placeholder: "Select Product",
            options: categories,
            validation: Yup.string().trim().required("Product is required"),
        },

        {
            name: "mrp",
            label: "MRP",
            type: "number",
            placeholder: "Enter MRP",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("MRP is required"),
        },
        {
            name: "discount",
            label: "Discount",
            type: "number",
            placeholder: "Enter Discount",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("Discount is required"),
        },
        {
            name: "cost",
            label: "Cost",
            type: "number",
            placeholder: "Enter Cost",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("Cost is required"),
        },
        {
            name: "price_points",
            label: "Price Points",
            type: "number",
            placeholder: "Enter Price Points",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("Price Points is required"),
        },
        {
            name: "stock",
            label: "Stock",
            type: "text",
            placeholder: "Enter Stock",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("Stock is required"),
        },
        {
            name: "min_qty_per_order",
            label: "Min Qty per Order",
            type: "text",
            placeholder: "Enter Min Qty per Order",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("Min Qty Per Order is required"),
        },
        {
            name: "max_qty_per_order",
            label: "Max Qty per Order",
            type: "number",
            placeholder: "Enter Max Qty per Order",
            validation: Yup.string().trim()
                .matches(/^\d*$/, "Only numeric values are allowed")
                .required("MRP is required"),
        },

        {
            name: "isDuration",
            label: "Is Duration",
            type: "text",
            validation: Yup.boolean(),
        },
        {
            name: "duration_start",
            label: "Duration Start",
            type: "datetime-local",
            validation: Yup.string().trim().required("Duration Start is required"),
        },
        {
            name: "duration_end",
            label: "Duration End",
            type: "datetime-local",
            validation: Yup.string().trim().required("Duration End is required"),
        },
    ];

    const handleSubmit = (values: Record<string, unknown>[]) => {
        console.log('VALUES--', values)
        const requestData = {
            projects_catalogue_id: catalogueId as string,
            vendor_id: vendorId as string,
            products: values.map((product) => ({
                ...product,
                isDuration: product.isDuration ? true : false, // Use boolean values directly
            })),
        };

        console.log('Request-Data', requestData)

        const token = getToken();
        if (token) {
            addProductCatalogue(requestData); // Pass the object directly without stringifying
        }
    };


    const handleToBack = () => {
        router.push("/dashboard/catalogue");
    };

    const addProductRow = () => {
        setProducts([
            ...products,
            {
                product_id: "",
                mrp: "",
                discount: "",
                cost: "",
                price_points: "",
                stock: "",
                min_qty_per_order: "",
                max_qty_per_order: "",
                isDuration: true,
                duration_start: "",
                duration_end: "",
            },
        ]);
    };

    const removeProductRow = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const buttons = [
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />,
        },
    ];


    const handleFormSubmit = (index: number, values: ProductType) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index] = values;
            return updatedProducts;
        });

        setSubmittedForms((prev) => {
            const updated = [...prev];
            updated[index] = true; // Mark the form as submitted
            return updated;
        });
    };

    const allFormsSubmitted = submittedForms.every((status) => status);
    return (
        <>
            <BreadCrumbTwo name="Add Product" buttons={buttons} />

            {products.map((product, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                    <DynamicProductForm
                        fields={formFields}
                        initialValues={product}
                        // onSubmit={(values) => {
                        //     setProducts((prevProducts) => {
                        //         const updatedProducts = [...prevProducts];
                        //         updatedProducts[index] = values;
                        //         return updatedProducts;
                        //     });
                        // }}
                        onSubmit={(values) => handleFormSubmit(index, values)}
                        submitButtonText="Add Product"  // Custom button text

                    />
                    <div className="flex justify-end m-5"> <Button onClick={() => removeProductRow(index)} size={"add"} variant={"secondary"}>-</Button></div>
                </div>
            ))}
            <div className="flex flex-col">
                <div className="flex justify-end m-5">
                    <Button onClick={addProductRow} size={"add"} variant={"secondary"}>+</Button>
                </div>
                <div className="flex justify-center m-5">
                    <Button
                        onClick={() => handleSubmit(products)}
                        className="text-white w-1/2"
                        variant={"secondary"}
                        disabled={!allFormsSubmitted} // Disable until all forms are submitted
                    >
                        {allFormsSubmitted ? "Submit All Products" : "Submission"}
                    </Button>
                    {/* <Button onClick={() => { handleSubmit(products) }} className="text-white w-1/2" variant={"secondary"}>Submit All Products</Button> */}
                </div>
            </div>

        </>
    );
};

export default Add_Product;



