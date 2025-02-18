export const validateInputs = (
    venueSlug: string,
    cartValue: string | number,
    latitude: string | number,
    longitude: string | number
): {
    generalError: string;
    latitudeError: string;
    longitudeError: string;
    cartValueError: string;
    venueSlugError: string;
} => {
    const errors = {
        generalError: '',
        latitudeError: '',
        longitudeError: '',
        cartValueError: '',
        venueSlugError: '',
    };

    // Venue slug validation
    if (!venueSlug) {
        errors.venueSlugError = 'Venue Slug is required.';
    }

    // Cart value validation
    if (cartValue === '') {
        errors.cartValueError = 'Cart value is required.';
    }
    if (!cartValue || Number(cartValue) <= 0) {
        errors.cartValueError = 'Cart value must be greater than 0.';
    }

    // Latitude validation
    if (latitude === '') {
        errors.latitudeError = 'Latitude is required.';
    } else {
        const latitudeNumber = Number(latitude);
        if (isNaN(latitudeNumber) || latitudeNumber < -90 || latitudeNumber > 90) {
            errors.latitudeError = 'Latitude must be between -90 and 90.';
        }
    }

// Longitude validation
    if (longitude === '') {
        errors.longitudeError = 'Longitude is required.';
    } else {
        const longitudeNumber = Number(longitude);
        if (isNaN(longitudeNumber) || longitudeNumber < -180 || longitudeNumber > 180) {
            errors.longitudeError = 'Longitude must be between -180 and 180.';
        }
    }

    return errors;
};
interface Location {
    coordinates: [number, number];
}
export const validateCoordinates = (location: Location): [number, number] => {
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
        throw new Error("Delivery is not available for this venue. Please try selecting a different venue.");
    }
    return location.coordinates;
};