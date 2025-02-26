import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../components/ErrorMessage';
jest.mock('../assets/styles/errorMessage.css', () => {});

describe('ErrorMessage', () => {
    it('should render the error message', () => {
        render(<ErrorMessage message="Test error message" />);
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should not render anything if message is empty', () => {
        render(<ErrorMessage message="" />);
        expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
    });
});