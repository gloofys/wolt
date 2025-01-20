import React from 'react';

interface PriceBreakdownProps {
    cartValue: number;
    smallOrderSurcharge: number;
    deliveryFee: number;
    deliveryDistance: number;
    totalPrice: number;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
                                                           cartValue,
                                                           smallOrderSurcharge,
                                                           deliveryFee,
                                                           deliveryDistance,
                                                           totalPrice,
                                                       }) => {
    const formatCurrency = (value: number) => `${(value / 100).toFixed(2)} EUR`;
    const formatDistance = (value: number) => `${value} m`;

    return (
        <div>
            <h2>Price Breakdown</h2>
            <p>Cart Value: <span data-raw-value={cartValue}>{formatCurrency(cartValue)}</span></p>
            <p>Small Order Surcharge: <span data-raw-value={smallOrderSurcharge}>{formatCurrency(smallOrderSurcharge)}</span></p>
            <p>Delivery Fee: <span data-raw-value={deliveryFee}>{formatCurrency(deliveryFee)}</span></p>
            <p>Delivery Distance: <span data-raw-value={deliveryDistance}>{formatDistance(deliveryDistance)}</span></p>
            <p><strong>Total Price: <span data-raw-value={totalPrice}>{formatCurrency(totalPrice)}</span></strong></p>
        </div>
    );
};

export default PriceBreakdown;
