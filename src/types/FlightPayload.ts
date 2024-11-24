export default interface FlightPayload {
    email: string, 
    flight: {
        airline: string,
        flightId: string,
        departureAirport: string,
        arrivalAirport: string,
        flightDate: string,
        departureTerminal: string,
        departureGate: string,
        arrivalTerminal: string,
        arrivalGate: string
    }   
}