import React from 'react';
import '../assets/styles/priceBreakDown.css'
import {PriceBreakdownProps} from "../utilities/types";

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
            <h2 id="price-breakdown-title">Price Breakdown</h2>
            <dl>
                <div>
                    <dt>Cart Value:</dt>
                    <dd data-raw-value={cartValue}>{formatCurrency(cartValue)}</dd>
                </div>
                <div>
                    <dt>Small Order Surcharge:</dt>
                    <dd data-raw-value={smallOrderSurcharge}>{formatCurrency(smallOrderSurcharge)}</dd>
                </div>
                <div>
                    <dt>Delivery Fee:</dt>
                    <dd data-raw-value={deliveryFee}>{formatCurrency(deliveryFee)}</dd>
                </div>
                <div>
                    <dt>Delivery Distance:</dt>
                    <dd data-raw-value={deliveryDistance}>{formatDistance(deliveryDistance)}</dd>
                </div>
                <div>
                    <dt>
                        <strong>Total Price:</strong>
                    </dt>
                    <dd data-raw-value={totalPrice}>
                        <strong>{formatCurrency(totalPrice)}</strong>
                    </dd>
                </div>
            </dl>
        </div>
    );

};

export default PriceBreakdown;
