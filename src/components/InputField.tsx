import React, { forwardRef } from "react";
import "../assets/styles/input.css";
import ErrorMessage from "./ErrorMessage";

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: "text" | "number";
    testId: string;
    step?: string;
    min?: string | number;
    errorMessage?: string;
    classname?: string;
    clearError?: () => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, value, onChange, type = "text", testId, step, min, errorMessage, classname, clearError }, ref) => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (clearError) clearError();
            onChange(e.target.value);
        };

        return (
            <div className={`input-wrapper ${classname || ""}`}>
                <input
                    id={testId}
                    ref={ref}
                    type={type}
                    value={value}
                    onChange={handleInputChange}
                    data-test-id={testId}
                    step={step}
                    min={min}
                    className={`input-field ${errorMessage ? "input-error" : ""}`}
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? `${testId}-error` : undefined}
                />
                <label htmlFor={testId} className="input-label">
                    {label}
                </label>
                <ErrorMessage message={errorMessage || ""} id={`${testId}-error`} />
            </div>
        );
    }
);

export default InputField;
