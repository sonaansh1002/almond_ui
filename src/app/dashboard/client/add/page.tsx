'use client'
import React from "react";
import DynamicForm from "@/components/shared/form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useVendorRegistration from '@/services/api/vendor';  // Import the custom hook
import { getToken } from "@/lib/utils";
import BreadCrumbTwo from '@/components/Common/breadCrumbTwo';

const Client_Registration = () => {
    const router = useRouter();
    const { registerVendor } = useVendorRegistration();  // Using the custom hook

    const formFields = [
        {
            name: "contact_person_name",
            label: "Contact Person Name",
            type: "text",
            placeholder: "Enter Contact Person Name",
            validation: Yup.string()
                .trim()
                .matches(/^[^0-9]*$/, "Name cannot contain Numbers").required('Name is required')
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            validation: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        },
        {
            name: "business_contact_number",
            label: "Business Contact Number",
            type: "number",
            placeholder: "Type Business Contact Number  ",
            validation: Yup.string().trim().min(10, 'number should be 10 digit').max(10, 'NUmber should be 10 ').required("Business Contact Number is required"),
        },
        {
            name: "organization_name",
            label: "Organization Name",
            type: "text",
            placeholder: "Enter Organization Name",
            validation: Yup.string().trim().required("Organization Name is required")
                .matches(/^[^0-9]*$/, "Organization Name cannot contain Numbers").required('Organization Name is required')

        },
        {
            name: "phone_number",
            label: "Phone Number",
            type: "number",
            placeholder: "Enter Phone Number",
            validation: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Phone Number must be a valid 10-digit number starting with 6, 7, 8, or 9')
                // .matches(/^\d{10}$/, "Must be exactly 10 digits")
                .required("This field is required")
            ,
        },
        {
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "Enter your email",
            validation: Yup.string().trim().email("Invalid email").required("Email is required"),
        },
        {
            name: "organization_pan_number",
            label: "Organization Pan Number",
            type: "text",
            placeholder: "Enter Organization Pan Number",
            validation: Yup.string().trim().required("Organization Pan Number is required"),
        }, {
            name: "technical_contact_number",
            label: "Technical Contact Number",
            type: "number",
            placeholder: "Enter Technical Contact Number",
            validation: Yup.string().trim().required("Technical Contact Number is required").matches(/^[6-9]\d{9}$/, 'Mobile Number must be a valid 10-digit number starting with 6, 7, 8, or 9')

        },
        {
            name: "website_link",
            label: "Website Link",
            // type: "text",
            type: "url",
            placeholder: "Enter Website Link",
            // validation: Yup.string().trim().required("Website Link is required").matches(/^[^0-9]*$/, "Website Link cannot contain Numbers").required('Website Link is required')
            validation: Yup.string().trim().required('Website Link is required')
        },

        // Add more fields as needed
    ];

    const initialValues = {
        email: "",
        password: "",
        contact_person_name: '',
        website_link: '',
        technical_contact_number: '',
        organization_pan_number: '',
        phone_number: '',
        organization_name: '',
        business_contact_number: '',
    };

    const handleSubmit = (values: Record<string, string>) => {
        const requestData = {
            contact_person_name: values.contact_person_name,
            organization_name: values.organization_name,
            organization_pan_number: values.organization_pan_number,
            website_link: values.website_link,
            phone_number: values.phone_number ? values.phone_number.toString() : "",
            technical_contact_number: values.technical_contact_number ? values.technical_contact_number.toString() : "",
            business_contact_number: values.business_contact_number ? values.business_contact_number.toString() : "",
            email: values.email,
            password: values.password,
        };

        // Call the registerVendor function from the custom hook
        const token = getToken();
        if (token) {
            registerVendor(requestData); // Pass request data and token to the service
        }
    };

    const handleToBack = () => {
        router.push("/dashboard/client");
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
            <BreadCrumbTwo name="Client Registration Form" buttons={buttons} />
            <DynamicForm fields={formFields} initialValues={initialValues} onSubmit={handleSubmit} />
        </>
    );
};

export default Client_Registration;
