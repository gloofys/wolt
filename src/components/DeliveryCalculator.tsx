import React, {useState, useEffect, useRef} from 'react';
import InputField from './InputField';
import GetLocationButton from './GetLocationButton';
import ErrorMessage from './ErrorMessage';
import { fetchStaticData, fetchDynamicData } from '../utilities/api';
import {
    calculateSurcharge,
    calculateDeliveryFee,
    calculateTotalPrice,
    calculateHaversineDistance,
} from '../utilities/calculations';
import { validateInputs } from '../utilities/validateInputs';
import { DeliverySpecs } from '../utilities/types';
import axios from 'axios';
import '../assets/styles/button.css'
import '../assets/styles/deliveryCalculator.css'
import PriceBreakdown from "./PriceBreakdown";
const DeliveryCalculator: React.FC = () => {
    const [venueSlug, setVenueSlug] = useState('');
    const [cartValue, setCartValue] = useState<string | number>('');
    const [latitude, setLatitude] = useState<string | number>('');
    const [longitude, setLongitude] = useState<string | number>('');
    const [locationError, setLocationError] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        generalError: '',
        latitudeError: '',
        longitudeError: '',
        cartValueError: '',
        venueSlugError: '',
    });
    const venueSlugRef = useRef<HTMLInputElement>(null);
    const cartValueRef = useRef<HTMLInputElement>(null);
    const longitudeRef = useRef<HTMLInputElement>(null);
    const latitudeRef = useRef<HTMLInputElement>(null);


    const [results, setResults] = useState<{
        cartValue: number;
        smallOrderSurcharge: number;
        deliveryFee: number | null;
        deliveryDistance: number;
        totalPrice: number | null;
    } | null>(null);
    const [error, setError] = useState('');
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const CENTS_MULTIPLIER = 100

    const handleCalculate = async () => {
        setValidationErrors({
            generalError: '',
            latitudeError: '',
            longitudeError: '',
            cartValueError: '',
            venueSlugError: '',
        });

        const errors = validateInputs(venueSlug, cartValue, latitude, longitude);
        setValidationErrors(errors);

        if (Object.values(errors).some((error) => error)) {
            return;
        }

        try {
            const [venueCoordinates, dynamicData]: [[number, number], DeliverySpecs] = await Promise.all([
                fetchStaticData(venueSlug),
                fetchDynamicData(venueSlug),
            ]);

            const distanceRanges = dynamicData?.delivery_pricing?.distance_ranges;

            if (
                !distanceRanges ||
                distanceRanges.length === 0 ||
                distanceRanges.every(range => range.min === 0 && range.max === 0)
            ) {
                setError("The selected venue does not support delivery.");
                setResults(null);
                return;
            }

            const [venueLongitude, venueLatitude] = venueCoordinates;
            const deliveryDistance = calculateHaversineDistance(
                Number(latitude),
                Number(longitude),
                venueLatitude,
                venueLongitude
            );

            const surcharge = calculateSurcharge(Number(cartValue) * CENTS_MULTIPLIER, dynamicData.order_minimum_no_surcharge);
            const deliveryFee = calculateDeliveryFee(
                dynamicData.delivery_pricing.base_price,
                deliveryDistance,
                dynamicData.delivery_pricing.distance_ranges
            );

            if (deliveryFee === null) {
                setError(
                    `The delivery distance (${Math.round(deliveryDistance)}m) is too far for this venue. Please try a closer venue.`
                );
                setResults(null);
                return;
            }

            const totalPrice = calculateTotalPrice(Number(cartValue) * CENTS_MULTIPLIER, surcharge, deliveryFee);

            setResults({
                cartValue: Number(cartValue) * CENTS_MULTIPLIER,
                smallOrderSurcharge: surcharge,
                deliveryFee,
                deliveryDistance: Math.round(deliveryDistance),
                totalPrice,
            });
            setError('');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMessage =
                    err.response?.status === 404
                        ? "Error fetching venue data. Please check the venue slug and try again."
                        : err.message || "An error occurred while fetching data.";
                setValidationErrors((prev) => ({ ...prev, venueSlugError: errorMessage }));
            } else {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            }

            setResults(null);
            console.error("Error during calculation:", err);
        }
    };




    useEffect(() => {
        setResults(null);
        setError('');
    }, [venueSlug, cartValue, latitude, longitude]);

    useEffect(() => {
        if(results){
            setLocationError('');

            if (results && resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [results]);


    return (
        <div className="delivery-calculator">
            <header>
                <h1>Delivery Order Price Calculator</h1>
            </header>
            <form className="form" aria-labelledby="delivery-caluclator-venue-and-cart-value">
                <InputField label="Venue slug"
                            value={venueSlug}
                            onChange={(value) => {
                                setVenueSlug(value.toString());
                                setError('');
                                setValidationErrors((prev) => ({...prev, venueSlugError: ""})); // Clear the error
                            }}
                            testId="venueSlug"
                            errorMessage={validationErrors.venueSlugError}
                            ref={venueSlugRef}
                            aria-label="Venue slug field"
                />

                <InputField
                    label="Cart value (€)"
                    value={cartValue}
                    onChange={(value) => {
                        setCartValue(value);
                        setValidationErrors((prev) => ({...prev, cartValueError: ""}));
                    }}
                    type="number"
                    ref={cartValueRef}
                    testId="cartValue"
                    step="0.01"
                    min="0"
                    errorMessage={validationErrors.cartValueError}
                    classname="custom-class"
                    aria-label="Cart Value Field"
                />

            </form>


            <div className="location-section">
                <div className="location-button-group">
                    <GetLocationButton
                        setLatitude={(value) => {
                            setLatitude(value);
                            setValidationErrors((prev) => ({...prev, latitudeError: ""}));
                        }}
                        setLongitude={(value) => {
                            setLongitude(value);
                            setValidationErrors((prev) => ({...prev, longitudeError: ""}));
                        }}
                        setLocationError={setLocationError}


                    />
                    <span className="helper-text">or enter your coordinates manually below</span>
                    <ErrorMessage message={locationError}/>
                </div>

                <form className="form" aria-labelledby="delivery-calculator-latitude-longitude">
                    <InputField
                        label="User latitude"
                        value={latitude}
                        onChange={(value) => {
                            setLatitude(value);
                            setValidationErrors((prev) => ({...prev, latitudeError: ""}));
                            setLocationError("");
                        }}
                        type="text"
                        testId="userLatitude"
                        ref={latitudeRef}
                        aria-label="Latitude field"
                        errorMessage={validationErrors.latitudeError}
                        aria-describedby="latitude-error"
                    />

                    <InputField
                        label="User longitude"
                        value={longitude}
                        onChange={(value) => {
                            setLongitude(value);
                            setValidationErrors((prev) => ({...prev, longitudeError: ""}));
                            setLocationError("");
                        }}
                        type="text"
                        ref={longitudeRef}
                        testId="userLongitude"
                        aria-label="Longitude field"
                        errorMessage={validationErrors.longitudeError}
                        aria-describedby="longitude-error"
                    />

                </form>
            </div>
            <div className="button-container">
                <button onClick={handleCalculate} className="calculate-button">
                    Calculate
                </button>
                <ErrorMessage message={validationErrors.generalError || error}/>
            </div>

            <div
                ref={resultsRef}
                aria-live="polite"
                aria-atomic="true"
                className={`results-container ${results ? '' : 'hidden-results'}`}
            >
                {results ? (
                    <PriceBreakdown
                        cartValue={results.cartValue}
                        smallOrderSurcharge={results.smallOrderSurcharge}
                        deliveryFee={results.deliveryFee ?? 0}
                        deliveryDistance={results.deliveryDistance}
                        totalPrice={results.totalPrice ?? 0}
                    />
                ) : (
                    <span>Results will be displayed here after a successful calculation.</span>
                )}
            </div>
        </div>
    );
};

export default DeliveryCalculator;
