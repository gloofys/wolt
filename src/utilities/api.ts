import axios from 'axios';
import {DeliverySpecs} from "./types";
import {validateCoordinates} from "./validateInputs";

const BASE_URL = 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues';

export const fetchStaticData = async (venueSlug: string): Promise<[number, number]> => {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/static`);
    const location = response.data?.venue_raw?.location;
    return validateCoordinates(location);
};


export const fetchDynamicData = async (venueSlug: string): Promise<DeliverySpecs> => {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/dynamic`);
    return response.data.venue_raw.delivery_specs;
};

