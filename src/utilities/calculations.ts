export const calculateSurcharge = (cartValue: number, minimumValue: number): number => {
    return cartValue < minimumValue ? minimumValue - cartValue : 0;
};

export const calculateDeliveryFee = (
    basePrice: number,
    distance: number,
    distanceRanges: Array<{ min: number; max: number; a: number; b: number }>
): number | null => {

    for (const range of distanceRanges) {

        if (distance >= range.min && (range.max === 0 || distance < range.max)) {
            if (range.max === 0) {
                return null;
            }

            const additionalFee = range.a + Math.round((range.b * distance) / 10);
            return basePrice + additionalFee;
        }
    }

    return null;
};


export const calculateTotalPrice = (cartValue: number, surcharge: number, deliveryFee: number): number => {
    return cartValue + surcharge + deliveryFee;
};


export const calculateHaversineDistance = (
    userLat: number,
    userLng: number,
    venueLat: number,
    venueLng: number
): number => {
    const R = 6371000; // Radius of Earth in meters
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const lat1 = toRadians(userLat);
    const lat2 = toRadians(venueLat);
    const deltaLat = toRadians(venueLat - userLat);
    const deltaLng = toRadians(venueLng - userLng);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};