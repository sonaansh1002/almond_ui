'use client';

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "checkbox" | "textarea" | string;
    placeholder?: string;
    validation?: Yup.AnySchema;
}

interface DynamicFormProps {
    fields: FormField[];
    initialValues: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
}

const DynamicModal: React.FC<DynamicFormProps> = ({ fields, initialValues, onSubmit }) => {
    // Custom validation logic
    const validate = (values: Record<string, string>) => {
        const isAnyFieldFilled = fields.some((field) => String(values[field.name] || "").trim() !== "");
        if (!isAnyFieldFilled) {
            return { _error: "At least one field must be filled." };
        }
        return {};
    };

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
        <Formik initialValues={initialValues} validationSchema={validationSchema} validate={validate} onSubmit={onSubmit}>
            {({ isSubmitting, errors }) => (
                <Form className="p-4 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-md lg:max-w-full ">

                    {/* Two-column grid layout */}
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4  max-h-[340px] overflow-y-auto custom-scrollbar">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col ">
                                <label htmlFor={field.name} className="mb-2 ml-1 text-sm font-semibold text-gray-600 hover:text-orange-600">
                                    {field.label}
                                </label>
                                <Field
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className="p-2 mx-1 mb-1 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500 "
                                    as={field.type === "textarea" ? "textarea" : field.type === "checkbox" ? "input" : "input"}
                                    inputMode={field.type === "number" ? "numeric" : undefined}
                                    pattern={field.type === "number" ? "[0-9]*" : undefined}
                                    maxLength={field.type === "number" ? 20 : undefined}
                                />
                                <ErrorMessage name={field.name} component="span" className="mt-1 text-sm text-red-600" />
                            </div>
                        ))}
                    </div>

                    {/* Display error message for empty form validation */}
                    {errors._error && <div className="mt-2 text-sm text-red-600 text-center">{errors._error}</div>}

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
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

export default DynamicModal;


