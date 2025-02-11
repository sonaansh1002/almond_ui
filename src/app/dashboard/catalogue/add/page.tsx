'use client'
import React from "react";
import DynamicForm from "@/components/shared/form";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useAddCatalogue from "@/services/api/allCatalogue/add";
import { getToken, getUserId } from "@/lib/utils";
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import Api from "@/services/api";
import Notiflix from 'notiflix';



interface AddCat {
    id: number;
    business_contact_number: string;
    contact_person_name: string;
    email: string;
    organization_name: string;
    organization_pan_number: string;
    phone_number: string;
    technical_contact_number: string;
    website_link: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
}

// const user_id = getUserId()
const user_id: string | null = getUserId();

const Add_Catalogue = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const router = useRouter();
    const { addCatalogue } = useAddCatalogue();
    const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);

    // const userId = localStorage.getItem('data')
    console.log(user_id, 9876)

    const getVendors = async (user_id: string | null) => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {
            // payload = { userId: data.payload.user_id }
            console.log(333, 'Enter in GetVendor Function')
            // const data = { payload: { userId: userId } };
            const { formattedVendors, } = await Api.Add.getAllVendors(user_id);
            console.log(formattedVendors, "vender")
            Notiflix.Loading.remove();
            // setVendors(formattedVendors);
            const options = formattedVendors.map((vendor: AddCat) => ({
                value: vendor._id,
                label: vendor.organization_name,
            }));
            setProjects(options);
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

    useEffect(() => {
        getVendors(user_id);
    }, []);




    const formFields = [
        {
            name: "catalogue_name",
            label: "Catalogue Name",
            type: "text",
            placeholder: "Enter Name  ",
            validation: Yup.string().trim().required("Name is required")
                .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
        },
        {
            name: "projects",
            label: "Projects",
            type: "select",
            placeholder: "Select a Project",
            options: projects, // Pass fetched options
            validation: Yup.string().required("Project is required"),
        },
    ];

    const initialValues = {
        catalogue_name: "",
        projects: "",
    };

    const handleSubmit = (values: Record<string, string>) => {
        const requestData = {
            catalogue_name: values.catalogue_name,
            vendor_id: values.projects,
        };

        const token = getToken();
        if (token) {
            addCatalogue(requestData);
        }
    };

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
            <BreadCrumbTwo name="Add Catalogue" buttons={buttons} />
            <DynamicForm fields={formFields} initialValues={initialValues} onSubmit={handleSubmit} />
        </>
    );
};

export default Add_Catalogue;
