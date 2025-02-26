import React from 'react';
import { render, screen } from '@testing-library/react';
import InputField from '../components/InputField';
jest.mock('../assets/styles/input.css', () => {});
jest.mock('../assets/styles/errorMessage.css', () => {});

describe('InputField Component', () => {
    it('should render the label and input field', () => {
        render(
            <InputField
                label="Cart Value"
                value=""
                onChange={jest.fn()}
                type="number"
                testId="cartValue"
                step="0.01"
            />
        );
        expect(screen.getByLabelText('Cart Value')).toBeInTheDocument();
        expect(screen.getByTestId('cartValue')).toBeInTheDocument();
    });

});
