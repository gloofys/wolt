import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryCalculator from '../components/DeliveryCalculator';
import { fetchStaticData, fetchDynamicData } from '../utilities/api';
jest.mock('../assets/styles/input.css', () => {});
jest.mock('../assets/styles/deliveryCalculator.css', () => {});
jest.mock('../assets/styles/priceBreakDown.css', () => {});
jest.mock('../assets/styles/button.css', () => {});
jest.mock('../assets/styles/errorMessage.css', () => {});
jest.mock('../utilities/api', () => ({
    fetchStaticData: jest.fn(),
    fetchDynamicData: jest.fn(),
}));

jest.mock('../utilities/calculations', () => ({
    calculateHaversineDistance: jest.fn(),
    calculateSurcharge: jest.fn(() => 0),
    calculateDeliveryFee: jest.fn(() => 500),
    calculateTotalPrice: jest.fn(() => 1500),
}));

describe('DeliveryCalculator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with input fields', () => {
        render(<DeliveryCalculator />);
        expect(screen.getByLabelText(/Venue Slug/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Cart Value/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Latitude/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Longitude/i)).toBeInTheDocument();
        expect(screen.getByText(/Calculate/i)).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', () => {
        render(<DeliveryCalculator />);
        fireEvent.click(screen.getByText(/Calculate/i));
        expect(screen.getByText(/Venue Slug is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Cart value must be greater than 0/i)).toBeInTheDocument();
        expect(screen.getByText(/Latitude is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Longitude is required/i)).toBeInTheDocument();
    });



});

it('handles invalid distance ranges (all ranges are zero)', async () => {
    const mockStaticData = [24.92813512, 60.17012143];
    const mockDynamicData = {
        delivery_pricing: {
            base_price: 100,
            distance_ranges: [{ min: 0, max: 0, a: 0, b: 0 }],
        },
        order_minimum_no_surcharge: 1000,
    };

    (fetchStaticData as jest.Mock).mockResolvedValue(mockStaticData);
    (fetchDynamicData as jest.Mock).mockResolvedValue(mockDynamicData);

    render(<DeliveryCalculator />);

    fireEvent.change(screen.getByLabelText(/Venue Slug/i), { target: { value: 'test-venue' } });
    fireEvent.change(screen.getByLabelText(/Cart Value/i), { target: { value: 24 } });
    fireEvent.change(screen.getByLabelText(/Latitude/i), { target: { value: 60.1695 } });
    fireEvent.change(screen.getByLabelText(/Longitude/i), { target: { value: 24.9354 } });

    fireEvent.click(screen.getByText(/Calculate/i));

    await waitFor(() => {
        expect(screen.getByText("The selected venue does not support delivery.")).toBeInTheDocument();
    });
});

