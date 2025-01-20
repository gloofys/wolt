import React from 'react';
import DeliveryCalculator from './components/DeliveryCalculator';

const App: React.FC = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1>Delivery Order Price Calculator</h1>
            <p>Enter the required details to calculate the total delivery cost.</p>
            <DeliveryCalculator />
        </div>
    );
};

export default App;
