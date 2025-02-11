'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FeatureEnabled } from '@/components/featureEnabled/page';

interface ButtonEvents {
    onClick?: () => void;
    name?: string;
    buttonText?: string;
    symbolIcon?: string | React.ReactNode;
    component?: React.ReactNode;
    buttons?: Array<{
        text?: string;
        icon?: string | React.ReactNode;
        onClick?: () => void;
        component?: React.ReactNode;
    }>;
}

export default function BreadCrumbTwo({
    name,
    buttons,
    component,
}: ButtonEvents) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <>
            <span className="flex justify-between items-center bg-white px-2 mb-2 py-1 shadow-md rounded-[5px]">
                <h1 className="text-gray-600 sm:text-sm md:text-md lg:text-lg font-semibold p-1">{name}</h1>
                <div className="flex gap-2">
                    {buttons?.map((button, index) => (
                        <FeatureEnabled key={index} featureFlag="ADD_BUTTON">
                            {button.component ? (
                                button.component
                            ) : (
                                <Button
                                    onClick={button.onClick || handleOpenModal}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {button.icon && <span className="mr-2">{button.icon}</span>}
                                    {button.text}
                                </Button>
                            )}
                        </FeatureEnabled>
                    ))}
                </div>
            </span>
            {isModalOpen && component && React.cloneElement(component as React.ReactElement, { closeModal: handleCloseModal })}
        </>
    );
}
