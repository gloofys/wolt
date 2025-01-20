import React from 'react';

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number';
    testId: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', testId }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // For number type inputs, validate decimal format
        if (type === 'number') {
            const regex = /^\d*\.?\d{0,2}$/; // Matches numbers with optional decimals (max 2 digits)
            if (!regex.test(inputValue)) {
                return; // Ignore invalid input
            }
            onChange(inputValue === '' ? '' : parseFloat(inputValue)); // Convert to number or empty string
        } else {
            onChange(inputValue); // For text, just pass the value
        }
    };

    return (
        <div>
            <label>
                {label}
                <input
                    type={type}
                    value={value}
                    onChange={handleInputChange}
                    data-test-id={testId}
                />
            </label>
        </div>
    );
};

export default InputField;
