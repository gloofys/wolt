import React, { useState,useEffect } from 'react';
import InputField from './InputField';
import PriceBreakdown from './PriceBreakdown';
import GetLocationButton from './GetLocationButton';
import { fetchStaticData, fetchDynamicData } from '../utilities/api';
import { calculateSurcharge, calculateDeliveryFee, calculateTotalPrice, calculateHaversineDistance } from '../utilities/calculations';
import { DeliverySpecs } from '../utilities/types';

const DeliveryCalculator: React.FC = () => {
    const [venueSlug, setVenueSlug] = useState('');
    const [cartValue, setCartValue] = useState<string | number>('');
    const [latitude, setLatitude] = useState<string | number>('');
    const [longitude, setLongitude] = useState<string | number>('');
    const [locationError, setLocationError] = useState('');
    const [results, setResults] = useState<{
        cartValue: number;
        smallOrderSurcharge: number;
        deliveryFee: number | null;
        deliveryDistance: number;
        totalPrice: number | null;
    } | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        if (!venueSlug || cartValue === '' || latitude === '' || longitude === '') {
            setError('All fields are required. Please provide valid inputs.');
            return;
        }

        try {
            const [venueCoordinates, dynamicData]: [[number, number], DeliverySpecs] = await Promise.all([
                fetchStaticData(venueSlug),
                fetchDynamicData(venueSlug),
            ]);

            const [venueLongitude, venueLatitude] = venueCoordinates;
            const deliveryDistance = calculateHaversineDistance(
                Number(latitude),
                Number(longitude),
                venueLatitude,
                venueLongitude
            );

            console.log('Delivery Distance Calculation:', {
                latitude: Number(latitude),
                venueLatitude,
                longitude: Number(longitude),
                venueLongitude,
                deliveryDistance,
            });

            const surcharge = calculateSurcharge(Number(cartValue) * 100, dynamicData.order_minimum_no_surcharge);
            const deliveryFee = calculateDeliveryFee(
                dynamicData.delivery_pricing.base_price,
                deliveryDistance,
                dynamicData.delivery_pricing.distance_ranges
            );

            if (deliveryFee === null) {
                setError(
                    `The delivery distance (${Math.round(deliveryDistance)} meters) is too far for this venue. Please try a closer venue.`
                );
                setResults(null);
                return;
            }

            const totalPrice = calculateTotalPrice(Number(cartValue) * 100, surcharge, deliveryFee);

            setResults({
                cartValue: Number(cartValue) * 100,
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
    useEffect(() => {
        if (results) {
            console.log('Calculation Results:', results);
        }
    }, [results]); // This will run whenever `results` is updated

    return (
        <div>
            <InputField label="Venue Slug"
                        value={venueSlug}
                        onChange={setVenueSlug}
                        testId="venueSlug"
            />
            <InputField
                label="Cart Value (€)"
                value={cartValue}
                onChange={(value) => setCartValue(value === '' ? '' : Number(value))}
                type="number"
                testId="cartValue"
                step="0.01"
            />

            {/* Get Location Button */}
            <GetLocationButton setLatitude={setLatitude}
                               setLongitude={setLongitude}
                               setLocationError={setLocationError}
            />
            {locationError && <p style={{ color: 'red' }}>{locationError}</p>}

            {/* Fallback for Manual Latitude and Longitude */}
            <p>If location access is denied, please manually input your latitude and longitude below:</p>
            <InputField label="Latitude"
                        value={latitude}
                        onChange={setLatitude}
                        type="number"
                        testId="userLatitude"
                        step="0.000001"
            />
            <InputField label="Longitude"
                        value={longitude}
                        onChange={setLongitude}
                        type="number"
                        testId="userLongitude"
                        step="0.000001"
            />

            {/* Calculate Button */}
            <button onClick={handleCalculate}
                    data-test-id="calculate">Calculate</button>

            {/* Error Message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Results Display */}
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
