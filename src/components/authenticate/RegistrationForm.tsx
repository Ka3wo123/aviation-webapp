import React, { useState, ChangeEvent, FormEvent } from "react";
import { AviationUser, Role } from "../../types/AviationUser";
import '../../styles/Form.css';
import { toast } from "react-toastify";
import UserService from "../../services/UserService";

const RegistrationForm: React.FC = () => {
    const [newUser, setNewUser] = useState<AviationUser>({
        name: "",
        surname: "",
        email: "",
        password: "",
        phoneNumber: undefined,
        age: undefined,
        role: Role.USER      
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        UserService.registerUser(newUser).subscribe({
            next: (response) => {
                if (response.status === 201) {                    
                    toast.success("User created - you can login");
                } else {
                    toast.error(response.data.message);
                }                
            },
            error: (err: any) => {
                const errorResponse = err.response?.data;
                if (errorResponse && errorResponse.message) {
                    toast.error(errorResponse.message);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        });
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
        </>
    );
};

export default RegistrationForm;
