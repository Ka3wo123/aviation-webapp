export type FlightId = {
    $oid: string, 
}

export default interface FlightSubmission {
    email: string,  
    flightId: string,  
    airline: string,
    departureAirport: string,
    arrivalAirport: string,
    flightDate: string,
    departureTerminal: string,
    departureGate: string,
    arrivalTerminal: string,
    arrivalGate: string
}