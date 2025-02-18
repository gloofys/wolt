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

// const useFetchDynamicData = (venueSlug: string) => {
//     const [deliverySpecs, setDeliverySpecs] = useState<DeliverySpecs | null>(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//                 const response = await fetch(`${BASE_URL}/${venueSlug}/dynamic`);
//                 if (!response.ok) throw new Error("Could not fetch dynamic data");
//                 const data = await response.json();
//                 setDeliverySpecs(data.venue_raw.delivery_specs);
//         };
//             fetchData();
//         },[venueSlug]);
//     return {deliverySpecs};
//
// };
// export default useFetchDynamicData;



// Error handling when API call fails

// export const fetchStaticData = async (venueSlug: string): Promise<[number, number]> => {
//     try {
//         const response = await axios.get(`${BASE_URL}/${venueSlug}/static`);
//         return validateCoordinates(response.data.venue_raw.location);
//     } catch (error) {
//         throw new Error("Failed to fetch static data.");
//     }
// };
//
// export const fetchDynamicData = async (venueSlug: string): Promise<DeliverySpecs> => {
//     try {
//         const response = await axios.get(`${BASE_URL}/${venueSlug}/dynamic`);
//         return response.data.venue_raw.delivery_specs;
//     } catch (error) {
//         throw new Error("Failed to fetch dynamic data.");
//     }
// };