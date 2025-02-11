'use client';

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";


interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "checkbox" | "textarea" | 'date' | 'file' | 'url' | 'select' | 'custom' | string; // Allowing string for custom types
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: Yup.AnySchema;
    component?: React.ReactNode; // For custom components
}
type SelectOption = {
    value: string;
    label: string;
};
interface DynamicFormProps {
    fields: FormField[];
    initialValues: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
    onFileChange?: (values: React.ChangeEvent<HTMLInputElement>) => void;

}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, initialValues, onSubmit }) => {
    // Build Yup validation schema dynamically
    const validationSchema = Yup.object(
        fields.reduce((schema, field) => {
            if (field.validation) {
                schema[field.name] = field.validation;
            }
            return schema;
        }, {} as Record<string, Yup.AnySchema>)
    );
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-md lg:max-w-full">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                                >
                                    {field.label}
                                </label>
                                {field.type === "custom" && field.component ? (
                                    React.cloneElement(field.component as React.ReactElement, {
                                        // onChange: (selectedOption: any) => {
                                        //     setFieldValue(field.name, selectedOption.value); // Automatically handle Formik updates
                                        // },
                                        onChange: (selectedOption: SelectOption) => {
                                            setFieldValue(field.name, selectedOption.value);
                                        },

                                    })
                                ) : (
                                    <Field name={field.name}>
                                        {({
                                            field: formikField,
                                            meta,
                                        }: {
                                            field: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLElement>) => void; onBlur: () => void };
                                            meta: { error?: string; touched: boolean };
                                        }) =>
                                            field.type === "select" ? (
                                                <select
                                                    {...formikField}
                                                    id={field.name}
                                                    className={`p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 ${meta.touched && meta.error ? "border-red-600" : ""
                                                        }`}
                                                >
                                                    <option value="" disabled>
                                                        {field.placeholder || "Select an option"}
                                                    </option>
                                                    {field.options?.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.type === "file" ? (
                                                <input
                                                    id={field.name}
                                                    type="file"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setFieldValue(field.name, e.target.files[0]); // Set file object in Formik
                                                        }
                                                    }}
                                                    className={`p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 ${meta.touched && meta.error ? "border-red-600" : ""
                                                        }`}
                                                />
                                            ) : (
                                                <input
                                                    {...formikField}
                                                    id={field.name}
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    className={`p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 ${meta.touched && meta.error ? "border-red-600" : ""
                                                        }`}
                                                />
                                            )
                                        }
                                    </Field>
                                )}
                                <ErrorMessage
                                    name={field.name}
                                    component="span"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4 ">
                        <Button
                            type="submit"
                            className="px-6 py-2 text-white w-[50%] bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );

};

export default DynamicForm


