import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AviationUser } from "../../types/AviationUser";
import '../../styles/Form.css';
import { Modal, Button } from 'react-bootstrap';

const RegistrationForm: React.FC = () => {
    const [newUser, setNewUser] = useState<AviationUser>({
        name: "",
        surname: "",
        email: "",
        password: "",
        phoneNumber: undefined,
        age: undefined,
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8082/api/user', newUser);
            localStorage.setItem('accessToken', response.data.access_token);
            console.log('Registration successful:', response.data);
            setNewUser({ name: "", surname: "", email: "", password: "", phoneNumber: undefined, age: undefined }); // Reset the form
        } catch (err: any) {
            if (err.response && err.response.status === 409) { // Assuming 409 Conflict is returned for existing email
                setErrorMessage('Email already in use. Please use a different email.');
                setShowModal(true); // Show the error modal
            } else {
                console.error(err);
            }
        }
        console.log("Registering user:", newUser);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessage(''); // Reset the error message
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Surname</label>
                    <input
                        type="text"
                        name="surname"
                        value={newUser.surname}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone (optional)</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={newUser.phoneNumber || ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Age (optional)</label>
                    <input
                        type="number"
                        name="age"
                        value={newUser.age || ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>

            {/* Modal for error message */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RegistrationForm;
