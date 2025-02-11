

'use client';

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";


interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "checkbox" | "textarea" | 'date' | 'file' | 'url' | string; // Allowing string for custom types
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: Yup.AnySchema;
}


interface DynamicFormProps<T> {
    fields: FormField[];
    initialValues: T;
    onSubmit: (values: T) => void;
    submitButtonText?: string;  // <-- Add this line
}


const DynamicProductForm = <T extends Record<string, unknown>>({

    fields,
    initialValues,
    onSubmit,
    submitButtonText = 'Submit'  // <-- Add this line
}: DynamicFormProps<T>) => {
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
            {({ isSubmitting }) => (
                <Form className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-slate-300 shadow-md lg:max-w-full ">
                    <div className="grid sm:grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                                >
                                    {field.label}
                                </label>
                                <Field name={field.name}>
                                    {({
                                        field: formikField,
                                        meta,
                                    }: {
                                        field: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; onBlur: () => void };
                                        meta: { error?: string; touched: boolean };
                                    }) =>
                                        field.type === "select" ? (
                                            <select
                                                {...formikField}
                                                id={field.name}
                                                className={`p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:ring-orange-500 ${meta.touched && meta.error ? "border-red-600" : ""}`}
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
                                        ) : (
                                            <input
                                                {...formikField}
                                                id={field.name}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                className={`p-3 border-2 rounded-md text-sm h-11 lg:w-[180px] xl:w-[206px] sm:lg:w-[160px] md:lg:w-[170px] focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500 ${meta.touched && meta.error ? "border-red-600" : ""}`}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (field.type === "number" && /^\d{0,10}$/.test(value)) {
                                                        formikField.onChange(e);
                                                    } else if (field.type !== "number") {
                                                        formikField.onChange(e);
                                                    }
                                                }}
                                            />
                                        )
                                    }
                                </Field>

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
                            {/* {isSubmitting ? "Submitting..." : "Submit"} */}
                            {isSubmitting ? `Submitting ${submitButtonText}...` : submitButtonText || 'Submit'}    </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default DynamicProductForm;

