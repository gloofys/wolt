import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from "jest-axe";
import DeliveryCalculator from '../components/DeliveryCalculator';
jest.mock('../assets/styles/input.css', () => {});
jest.mock('../assets/styles/priceBreakDown.css', () => {});
jest.mock('../assets/styles/button.css', () => {});
jest.mock('../assets/styles/deliveryCalculator.css', () => {});
expect.extend(toHaveNoViolations);

test('DeliveryCalculator is accessible', async () => {
    const { container } = render(<DeliveryCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});