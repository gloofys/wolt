import { validateInputs } from '../utilities/validateInputs';

describe('validateInputs', () => {
    it('should return an error if venueSlug is empty', () => {
        const errors = validateInputs('', '100', '60.12345', '24.12345');
        expect(errors.venueSlugError).toBe('Venue Slug is required.');
    });

    it('should return an error if cartValue is empty', () => {
        const errors = validateInputs('validSlug', '', '60.12345', '24.12345');
        expect(errors.cartValueError).toBe('Cart value must be greater than 0.');
    });

    it('should return an error if cartValue is negative', () => {
        const errors = validateInputs('validSlug', '-1', '60.12345', '24.12345');
        expect(errors.cartValueError).toBe('Cart value must be greater than 0.');
    });


    it('should return an error if latitude is empty', () => {
        const errors = validateInputs('validSlug', '100', '', '24.12345');
        expect(errors.latitudeError).toBe('Latitude is required.');
    });

    it('should return an error if latitude is out of range', () => {
        const errors = validateInputs('validSlug', '100', '100', '24.12345'); // Out of range
        expect(errors.latitudeError).toBe('Latitude must be between -90 and 90.');
    });

    it('should return an error if latitude is not a valid number', () => {
        const errors = validateInputs('validSlug', '100', 'invalid', '24.12345');
        expect(errors.latitudeError).toBe('Latitude must be between -90 and 90.');
    });

    it('should return an error if longitude is empty', () => {
        const errors = validateInputs('validSlug', '100', '60.12345', '');
        expect(errors.longitudeError).toBe('Longitude is required.');
    });

    it('should return an error if longitude is out of range', () => {
        const errors = validateInputs('validSlug', '100', '60.12345', '200'); // Out of range
        expect(errors.longitudeError).toBe('Longitude must be between -180 and 180.');
    });

    it('should return an error if longitude is not a valid number', () => {
        const errors = validateInputs('validSlug', '100', '60.12345', 'invalid');
        expect(errors.longitudeError).toBe('Longitude must be between -180 and 180.');
    });

    it('should return no errors for valid inputs', () => {
        const errors = validateInputs('validSlug', '100', '60.12345', '24.12345');
        expect(errors.venueSlugError).toBe('');
        expect(errors.cartValueError).toBe('');
        expect(errors.latitudeError).toBe('');
        expect(errors.longitudeError).toBe('');
        expect(errors.generalError).toBe('');
    });
});