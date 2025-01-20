import React, { useState } from 'react';
import InputField from './InputField';
import PriceBreakdown from './PriceBreakdown';
import { fetchStaticData, fetchDynamicData } from '../utilities/api';
import { calculateSurcharge, calculateDeliveryFee, calculateTotalPrice } from '../utilities/calculations';

const DeliveryCalculator: React.FC = () => {
    const [venueSlug, setVenueSlug] = useState('');
    const [cartValue, setCartValue] = useState(0);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [results, setResults] = useState<{
        cartValue: number;
        smallOrderSurcharge: number;
        deliveryFee: number | null;
        deliveryDistance: number;
        totalPrice: number | null;
    } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        try {
            const [venueCoordinates, dynamicData] = await Promise.all([
                fetchStaticData(venueSlug),
                fetchDynamicData(venueSlug),
            ]);

            const [venueLongitude, venueLatitude] = venueCoordinates;
            const deliveryDistance =
                Math.sqrt(
                    Math.pow(Number(latitude) - venueLatitude, 2) +
                    Math.pow(Number(longitude) - venueLongitude, 2)
                ) * 111139;

            const surcharge = calculateSurcharge(cartValue * 100, dynamicData.order_minimum_no_surcharge);
            const deliveryFee = calculateDeliveryFee(
                dynamicData.delivery_pricing.base_price,
                deliveryDistance,
                dynamicData.delivery_pricing.distance_ranges
            );

            if (deliveryFee === null) {
                setError('Delivery is not possible for the given distance.');
                setResults(null);
                return;
            }

            const totalPrice = calculateTotalPrice(cartValue * 100, surcharge, deliveryFee);

            setResults({
                cartValue: cartValue * 100,
                smallOrderSurcharge: surcharge,
                deliveryFee,
                deliveryDistance: Math.round(deliveryDistance),
                totalPrice,
            });
            setError('');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Error fetching venue data. Please check the venue slug and try again.');
            setResults(null);
        }
    };

    return (
        <div>
            <InputField label="Venue Slug" value={venueSlug} onChange={setVenueSlug} testId="venueSlug" />
            <InputField label="Cart Value (€)" value={cartValue} onChange={(value) => setCartValue(Number(value))} type="number" testId="cartValue" />
            <InputField label="Latitude" value={latitude} onChange={setLatitude} testId="userLatitude" />
            <InputField label="Longitude" value={longitude} onChange={setLongitude} testId="userLongitude" />
            <button onClick={handleCalculate} data-test-id="calculate">Calculate</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results && results.deliveryFee !== null && (
                <PriceBreakdown
                    cartValue={results.cartValue}
                    smallOrderSurcharge={results.smallOrderSurcharge}
                    deliveryFee={results.deliveryFee}
                    deliveryDistance={results.deliveryDistance}
                    totalPrice={results.totalPrice!}
                />
            )}
        </div>
    );
};

export default DeliveryCalculator;
