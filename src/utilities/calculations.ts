interface DistanceRange {
    min: number;
    max: number;
    a: number;
    b: number;
}

export const calculateSurcharge = (cartValue: number, minimumValue: number): number => {
    return cartValue < minimumValue ? minimumValue - cartValue : 0;
};

export const calculateDeliveryFee = (
    basePrice: number,
    distance: number,
    distanceRanges: DistanceRange[]
): number | null => {
    for (const range of distanceRanges) {
        if (distance >= range.min && (range.max === 0 || distance < range.max)) {
            const additionalFee = range.a + Math.round((range.b * distance) / 10);
            return basePrice + additionalFee;
        }
    }
    return null; // Delivery not possible
};

export const calculateTotalPrice = (cartValue: number, surcharge: number, deliveryFee: number): number => {
    return cartValue + surcharge + deliveryFee;
};
