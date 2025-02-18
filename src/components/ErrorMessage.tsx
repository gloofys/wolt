import React from 'react';
import '../assets/styles/errorMessage.css'

interface ErrorMessageProps {
    message: string;
    id?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, id }) => {
    if (!message) return null;

    return (
        <p
            id={id}
            className={`error-message-comp ${message ? "visible" : ""}`}
            aria-live="polite"
            role="alert"
            aria-hidden={!message}
        >
            {message}
        </p>
    );
};

export default ErrorMessage;
