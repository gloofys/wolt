import React from 'react';

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number';
    testId: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', testId }) => {
    return (
        <div>
            <label>
                {label}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? +e.target.value : e.target.value)}
                    data-test-id={testId}
                />
            </label>
        </div>
    );
};

export default InputField;
