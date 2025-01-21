export interface DistanceRange {
    min: number; // Minimum distance in meters
    max: number; // Maximum distance in meters (0 means no upper limit)
    a: number;   // Constant added to the fee
    b: number;   // Multiplier for distance-based fee
}

export interface DeliveryPricing {
    base_price: number; // Base delivery fee in cents
    distance_ranges: DistanceRange[]; // Array of distance ranges
}

export interface DeliverySpecs {
    order_minimum_no_surcharge: number; // Minimum cart value to avoid surcharge
    delivery_pricing: DeliveryPricing; // Pricing information
}