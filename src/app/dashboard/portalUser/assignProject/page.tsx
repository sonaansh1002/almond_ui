"use client"

import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import BreadCrumbTwo from "@/components/Common/breadCrumbTwo";
import { RdIcon } from "@/components/shared/icons";
import Api from "@/services/api";
import useAssignProject from "@/services/api/portalUser/assign";
import { Button } from "@/components/ui/button";

// interface AssignProjectPayload {
//     userId: string;
//     projects: { project_id: string }[];
// }

const Assign_Project = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);
    const { assignProject } = useAssignProject();

    const getProjects = async () => {
        Notiflix.Loading.standard();
        try {
            const { formattedVendors } = await Api.AssignProject.getAllProject(1, 1000);
            const options = formattedVendors.map((vendor: { _id: string; organization_name: string }) => ({
                value: vendor._id,
                label: vendor.organization_name,
            }));
            setProjects(options);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    const formik = useFormik({
        initialValues: {
            selectedProjects: [],
        },
        validationSchema: Yup.object({
            selectedProjects: Yup.array()
                .min(1, "At least one project must be selected")
                .required("This field is required"),
        }),
        // onSubmit: async (values) => {
        //     if (!userId) {
        //         Notiflix.Report.failure("Error", "User ID is missing.", "Close");
        //         return;
        //     }

        //     const requestData = {
        //         userId,
        //         // projects: values.selectedProjects.map((project: { value: string }) => project.value).join(","),
        //     };


        //     await assignProject(requestData);
        // },
        // onSubmit: async (values) => {
        //     if (!userId) {
        //         Notiflix.Report.failure("Error", "User ID is missing.", "Close");
        //         return;
        //     }

        //     const requestData = {
        //         userId,
        //         projects: values.selectedProjects.map((project: { value: string }) => ({
        //             project_id: project.value,
        //         })),
        //     };

        //     await assignProject(requestData);
        // },
        onSubmit: async (values) => {
            if (!userId) {
                Notiflix.Report.failure("Error", "User ID is missing.", "Close");
                return;
            }

            const requestData = {
                userId,
                projects: values.selectedProjects.map((project: { value: string }) => ({
                    project_id: project.value,
                })),
            };

            await assignProject(requestData); // The updated `assignProject` accepts this structure
        }

    });

    const handleToBack = () => {
        router.push("/dashboard/portalUser");
    };

    const buttons = [
        {
            text: "Back",
            onClick: handleToBack,
            icon: <RdIcon iconName="backPage" />,
        },
    ];

    return (
        <>
            <BreadCrumbTwo name="Assign Project" buttons={buttons} />
            <div className="flex justify-center mt-20">
                <form onSubmit={formik.handleSubmit} className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-slate-300 shadow-md lg:w-1/2 w-full">

                    <div>
                        <label
                            className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                        >
                            Select Project
                        </label>
                        <MultiSelect
                            // name="selectedProjects"
                            options={projects}
                            value={formik.values.selectedProjects}
                            onChange={(selected: string) => formik.setFieldValue("selectedProjects", selected)}
                            labelledBy="Select Projects"
                        />
                        {formik.touched.selectedProjects && formik.errors.selectedProjects && (
                            <div style={{ color: "red" }}>{formik.errors.selectedProjects}</div>
                        )}
                    </div>
                    <div className="flex justify-center mt-4 ">
                        <Button
                            type="submit"
                            className="px-6 py-2 text-white w-[50%] bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"

                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default Assign_Project;

