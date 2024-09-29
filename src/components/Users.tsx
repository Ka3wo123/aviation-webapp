import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { AviationUser } from '../types/AviationUser';

const Users = () => {
    const [users, setUsers] = useState<AviationUser[]>([]);

    useEffect(() => {
        const sub = UserService.getUsers().subscribe({
            next: (data) => {
                setUsers(data);
            },
            error: (err) => {
                console.log(err);
            }
        });

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return (
        <div>
            <ul>
                {users.map((u: any) => (
                    <li key={u.email}>
                        {u.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;
