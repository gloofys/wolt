export interface DistanceRange {
    min: number;
    max: number;
    a: number;
    b: number;
}

export interface DeliveryPricing {
    base_price: number;
    distance_ranges: DistanceRange[];
}

export interface DeliverySpecs {
    order_minimum_no_surcharge: number;
    delivery_pricing: DeliveryPricing;
}

export interface PriceBreakdownProps {
    cartValue: number;
    smallOrderSurcharge: number;
    deliveryFee: number;
    deliveryDistance: number;
    totalPrice: number;
}
