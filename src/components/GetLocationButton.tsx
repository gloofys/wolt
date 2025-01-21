import React, { useState } from 'react';

interface GetLocationButtonProps {
    setLatitude: (latitude: string) => void;
    setLongitude: (longitude: string) => void;
    setLocationError: (error: string) => void; // New prop for error handling
}

const GetLocationButton: React.FC<GetLocationButtonProps> = ({ setLatitude, setLongitude, setLocationError }) => {
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
                setLocationError(''); // Clear previous errors
                setIsLoading(false);
                console.log('User location retrieved:', { latitude, longitude });
            },
            (error) => {
                setIsLoading(false);
                console.error('Error retrieving location:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(
                            'Permission denied. Please enable location access in your browser or system settings. Alternatively, you can manually enter your latitude and longitude in the provided fields.'
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Position unavailable. Please try again later.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out. Please try again.');
                        break;
                    default:
                        setLocationError('An unknown error occurred while retrieving your location.');
                }
            }
        );
    };

    return (
        <button onClick={getLocation}
                data-test-id="getLocation"
                disabled={isLoading}
                aria-busy={isLoading}
                aria-disabled={!isLoading}>

            {isLoading ? 'Getting Location...' : 'Get Location'}
        </button>
    );
};

export default GetLocationButton;
