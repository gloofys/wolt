import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';


configure({
    testIdAttribute: 'data-test-id', // Use `data-test-id` instead of the default `data-testid`
});