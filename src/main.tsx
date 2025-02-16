import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DeliveryCalculator from "./components/DeliveryCalculator";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DeliveryCalculator />
    </React.StrictMode>
);