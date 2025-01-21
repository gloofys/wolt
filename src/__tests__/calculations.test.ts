import { calculateSurcharge } from '../utilities/calculations';
import { calculateDeliveryFee } from '../utilities/calculations';
import { calculateTotalPrice } from '../utilities/calculations';
import { calculateHaversineDistance } from '../utilities/calculations';

// Mock distance ranges for testing
const mockDistanceRanges = [
    { min: 0, max: 500, a: 0, b: 0 },
    { min: 500, max: 1000, a: 100, b: 1 },
    { min: 1000, max: 0, a: 0, b: 0 }, // max = 0 means delivery is not possible
];

describe('calculateSurcharge', () => {
    it('should return 0 if cart value is equal to the minimum value', () => {
        expect(calculateSurcharge(1000, 1000)).toBe(0);
    });

    it('should return 0 if cart value is greater than the minimum value', () => {
        expect(calculateSurcharge(1200, 1000)).toBe(0);
    });

    it('should return the difference if cart value is less than the minimum value', () => {
        expect(calculateSurcharge(800, 1000)).toBe(200);
    });
});

describe('calculateDeliveryFee', () => {
    it('should return the correct fee for a distance within a valid range', () => {
        // Base price: 199, Distance: 600
        // Range (500-1000): a=100, b=1
        // Fee = Base + a + (b * distance / 10) => 199 + 100 + 60 = 299
        expect(calculateDeliveryFee(199, 600, mockDistanceRanges)).toBe(359);

    });

    it('should return null if distance exceeds the maximum range', () => {
        // Distance: 1500 exceeds the last range (max = 0)
        expect(calculateDeliveryFee(199, 1500, mockDistanceRanges)).toBeNull();
    });

    it('should return the base price if distance is within the first range', () => {
        // Base price: 199, Distance: 400 falls in range (0-500), no additional fees
        expect(calculateDeliveryFee(199, 400, mockDistanceRanges)).toBe(199);
    });

    it('should handle distance exactly at max boundary for a valid range', () => {
        // Distance: 1000 falls at the boundary of the last range (1000-max=0)
        expect(calculateDeliveryFee(199, 1000, mockDistanceRanges)).toBeNull();
    });

    it('should return null if distanceRanges is empty', () => {
        expect(calculateDeliveryFee(199, 600, [])).toBeNull();
    });

    it('should calculate the correct fee for a range with a specific "a" and "b" value', () => {
        // Base price: 199, Distance: 700
        // Range (500-1000): a=100, b=1
        // Fee = Base + a + (b * distance / 10) => 199 + 100 + 70 = 269
        expect(calculateDeliveryFee(199, 700, mockDistanceRanges)).toBe(369);
    });
});

describe('calculateTotalPrice', () => {
    it('should calculate the total price correctly', () => {
        expect(calculateTotalPrice(1000, 200, 299)).toBe(1499);
    });

    it('should handle cases where surcharge or delivery fee is 0', () => {
        expect(calculateTotalPrice(1000, 0, 299)).toBe(1299);
        expect(calculateTotalPrice(1000, 200, 0)).toBe(1200);
    });

    it('should handle cases where all inputs are 0', () => {
        expect(calculateTotalPrice(0, 0, 0)).toBe(0);
    });
});

describe('calculateHaversineDistance', () => {
    it('should return 0 if both coordinates are the same', () => {
        expect(calculateHaversineDistance(60.17, 24.93, 60.17, 24.93)).toBe(0);
    });

    it('should calculate the correct distance between two known points', () => {
        // Example coordinates: Helsinki to a nearby point
        const distance = calculateHaversineDistance(60.17, 24.93, 60.18, 24.94);
        expect(Math.round(distance)).toBe(1242); // Example known distance
    });

    it('should handle cases with negative coordinates', () => {
        // Coordinates: Buenos Aires (-34.6037, -58.3816) to New York (40.7128, -74.0060)
        const distance = calculateHaversineDistance(-34.61, -58.31, 40.71, -74.11);
        expect(Math.round(distance)).toBeCloseTo(8529966, -2); // Approximate distance in meters
    });

    it('should handle large distances accurately', () => {
        // Coordinates: North Pole to South Pole
        const distance = calculateHaversineDistance(90, 0, -90, 0);
        expect(Math.round(distance)).toBe(20015087); // Approximate Earth's meridional circumference
    });
});
