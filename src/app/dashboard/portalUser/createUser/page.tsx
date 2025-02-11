'use client'
import React from "react";
import DynamicForm from "@/components/shared/form";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useAddUser from "@/services/api/portalUser/create";
import { getToken, getUserId } from "@/lib/utils";
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';
import Api from "@/services/api";
import Notiflix from 'notiflix';


interface AddUser {
    id: number;
    _id: string;
    role: string;
}


const user_id: string | null = getUserId();

const Add_User = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const router = useRouter();
    const { addUser } = useAddUser();

    const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);

    console.log(user_id, 9876)

    const getVendors = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard();
        try {

            console.log(333, 'Enter in GetVendor Function')

            const { formattedVendors, } = await Api.CreateUser.getAllRole();
            console.log(formattedVendors, "vender")
            Notiflix.Loading.remove();

            const options = formattedVendors.map((vendor: AddUser) => ({
                value: vendor._id,
                label: vendor.role,
            }));
            setProjects(options);

            console.log("FORMATE VENDORS", formattedVendors,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        getVendors();
    }, []);


    const formFields = [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter Email  ",
            validation: Yup.string().trim().email("Invalid email").required("Email is required"),
        },
        {
            name: "role_id",
            label: "Role",
            type: "select",
            placeholder: "Select a Role",
            options: projects,
            validation: Yup.string().required("Role is required"),
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter Password",
            validation: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        },
    ];

    const initialValues = {
        email: "",
        role_id: "",
        password: ""
    };

    const handleSubmit = (values: Record<string, string>) => {
        const requestData = {
            email: values.email,
            password: values.password,
            role_id: values.role_id
        };

        const token = getToken();
        if (token) {
            addUser(requestData);
        }
    };

    const handleToBack = () => {
        router.push("/dashboard/portalUser");
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
            <BreadCrumbTwo name="Create User" buttons={buttons} />
            <DynamicForm fields={formFields} initialValues={initialValues} onSubmit={handleSubmit} />
        </>
    );
};

export default Add_User;
