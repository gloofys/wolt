import React from 'react';

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number';
    testId: string;
    step?: string; // Allows setting step dynamically
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   value,
                                                   onChange,
                                                   type = 'text',
                                                   testId,
                                                   step = '1', // Default step is 1 if not provided
                                               }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (type === 'number') {
            const decimalPlaces = step.includes('.') ? step.split('.')[1].length : 0; // Determine precision from step
            const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`); // Match based on precision

            if (!regex.test(inputValue)) {
                return; // Ignore invalid input
            }

            onChange(inputValue === '' ? '' : parseFloat(inputValue));
        } else {
            onChange(inputValue); // For text, just pass the value
        }
    };

    return (
        <div>
            <label htmlFor={testId}>{label}</label>
            <input
                id={testId}
                type={type}
                step={step} // Use the provided step
                value={value === '' ? '' : value}
                onChange={handleInputChange}
                data-test-id={testId}
            />
        </div>
    );
};

export default InputField;
