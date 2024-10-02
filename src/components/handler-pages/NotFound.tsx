import { Link } from "react-router-dom";
import '../../styles/NotFoundPage.css';
import airplane from '../../assets/images/airplane-flywaway.png'

const NotFound = () => {

    return (
        <div className="not-found-container">
            <div className="message-container">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-message">Oops! The page you're looking for has flown away.</p>
                <p className="not-found-description">
                    It seems we can't find the page you're looking for. Maybe it took off on a flight.
                </p>
                <Link to="/" className="back-home-button">Back to Home</Link>
            </div>
            <div className="airplane-container">
                <img src={airplane} alt="Flyaway airplane" className="airplane-image" />
            </div>
        </div>
    );
};

export default NotFound;