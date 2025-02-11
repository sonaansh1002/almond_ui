import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import DynamicModal from "../shared/modalForm";
import * as Yup from "yup";

interface ModalFormProps {
    fields: { name: string; label: string; type: string; validation?: Yup.AnySchema }[];
    initialValues: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
    modalTitle: string;
    isModalOpen: boolean;
    closeModal: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
    fields,
    initialValues,
    onSubmit,
    modalTitle,
    isModalOpen,
    closeModal,

}) => {
    return (
        <Dialog.Root open={isModalOpen} onOpenChange={closeModal} >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-10" />
                <Dialog.Content className=" fixed flex-col place-content-center top-1/2 left-1/2 w-[90%] max-w-sm transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-20">
                    <Dialog.Title className="text-md font-bold mb-4">{modalTitle}</Dialog.Title>
                    {/* <div className="max-h-auto"> */}
                    <DynamicModal fields={fields} initialValues={initialValues} onSubmit={onSubmit} />

                    {/* </div> */}
                    <Dialog.Close asChild>
                        <Button aria-label="Close" className="absolute top-4 right-4 h-7 w-7 bg-orange-500">
                            X
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ModalForm;

