import React from 'react';

interface ErrorMessageProps {
    message: string;
    id?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, id }) => {
    if (!message) return null;

    return (
        <p
            id={id} // Optional ID for accessibility
            style={{
                color: 'rgba(249, 58, 37, 1)',
                fontSize: '0.85rem',
                marginTop: '0',
                marginBottom: '0',
                lineHeight: '1.2',
                maxWidth: '100%',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                minHeight: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                visibility: message ? 'visible' : 'hidden',
                opacity: message ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',


            }}
            aria-live="polite"
            role="alert"
            aria-hidden={!message}
        >
            {message}
        </p>
    );
};

export default ErrorMessage;
