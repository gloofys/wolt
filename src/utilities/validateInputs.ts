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
    } else if (!/^[-+]?\d+(\.\d+)?$/.test(latitude.toString()) || Number(latitude) < -90 || Number(latitude) > 90) {
        errors.latitudeError = 'Latitude must be between -90 and 90.';
    }

    // Longitude validation
    if (longitude === '') {
        errors.longitudeError = 'Longitude is required.';
    } else if (!/^[-+]?\d+(\.\d+)?$/.test(longitude.toString()) || Number(longitude) < -180 || Number(longitude) > 180) {
        errors.longitudeError = 'Longitude must be between -180 and 180.';
    }

    return errors;
};
export const validateCoordinates = (location: any): [number, number] => {
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
        throw new Error("Delivery is not available for this venue. Please try selecting a different venue.");
    }
    return location.coordinates;
};