import React from 'react'
import { Button } from '../ui/button'
import { FeatureEnabled } from '@/components/featureEnabled/page';


interface buttonEvents {
    onClick: () => void;
    buttonText?: string | boolean;
    symbolIcon?: string | React.ReactNode;
    className?: string
    disabled?: string | boolean
}

export default function CommonButton({ onClick, symbolIcon, className, buttonText, disabled }: buttonEvents) {

    return (
        <>
            <FeatureEnabled featureFlag='ADD_BUTTON'>
                <Button onClick={onClick} className={`bg-orange-600 hover:bg-orange-700 gap-2 mt-[6px] mb-2  ${className || ''} ${disabled}`} ><span className='font-semibold'>{symbolIcon}</span> {buttonText}  </Button>
            </FeatureEnabled>
        </>
    )
}
