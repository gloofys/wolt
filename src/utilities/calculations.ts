

export const calculateSurcharge = (cartValue: number, minimumValue: number): number => {
    return cartValue < minimumValue ? minimumValue - cartValue : 0;
};

export const calculateDeliveryFee = (
    basePrice: number,
    distance: number,
    distanceRanges: Array<{ min: number; max: number; a: number; b: number }>
): number | null => {
    console.log(`Starting delivery fee calculation:`);
    console.log(`Base Price: ${basePrice}, Distance: ${distance} meters`);

    for (const range of distanceRanges) {
        console.log(`Processing range:`, range);

        if (distance >= range.min && (range.max === 0 || distance < range.max)) {
            // Distance falls into this range
            if (range.max === 0) {
                // Delivery is not possible for distances equal to or beyond `range.min` when `max === 0`
                console.log(`Delivery not possible for distance: ${distance}`);
                return null;
            }

            // Calculate the fee for this range
            const additionalFee = range.a + Math.round((range.b * distance) / 10);
            const totalFee = basePrice + additionalFee;

            console.log(`Distance: ${distance} meters falls within range (${range.min}-${range.max === 0 ? '∞' : range.max} meters)`);
            console.log(`Additional Fee: a=${range.a}, b=${range.b}, Calculated Fee=${additionalFee}`);
            console.log(`Total Fee (including base price): ${totalFee}`);

            return totalFee;
        }
    }

    // If no range matches, return null (unlikely due to provided assumptions)
    console.log(`No matching range found for distance: ${distance}`);
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