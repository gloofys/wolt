import React, { useState } from 'react';


interface GetLocationButtonProps {
    setLatitude: (latitude: string) => void;
    setLongitude: (longitude: string) => void;
    setLocationError: (error: string) => void;
}

const GetLocationButton: React.FC<GetLocationButtonProps> = ({ setLatitude, setLongitude, setLocationError }) => {
    const [isLoading, setIsLoading] = useState(false)

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
                setLocationError('');
                setIsLoading(false);
                console.log('User location retrieved:', { latitude, longitude });
            },
            (error) => {
                setIsLoading(false);
                console.error('Error retrieving location:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(
                            "It looks like you've blocked location sharing. Please turn on location sharing in your browser's settings."
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
        <button
            onClick={getLocation}
            data-test-id="getLocation"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-busy={isLoading}
            className="get-location-button"
            aria-label="Retrieve current location for delivery"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="location-icon"
                width="16"
                height="16"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.333 7.333h-1.082a.333.333 0 0 1-.328-.28 6.011 6.011 0 0 0-4.976-4.976.333.333 0 0 1-.28-.328V.667a.667.667 0 0 0-1.334 0v1.082c0 .163-.119.302-.28.328a6.011 6.011 0 0 0-4.976 4.976.333.333 0 0 1-.328.28H.667a.667.667 0 0 0 0 1.334h1.082c.163 0 .302.119.328.28a6.011 6.011 0 0 0 4.976 4.976c.161.025.28.165.28.328v1.082a.667.667 0 1 0 1.334 0v-1.082c0-.163.119-.303.28-.328a6.012 6.012 0 0 0 4.976-4.976.333.333 0 0 1 .328-.28h1.082a.667.667 0 1 0 0-1.334ZM8 12.667a4.667 4.667 0 1 1 0-9.334 4.667 4.667 0 0 1 0 9.334Zm0-2a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"
                />
            </svg>
            {isLoading ? 'Getting Location...' : 'Use My Location'}
        </button>
    );
};

export default GetLocationButton;
