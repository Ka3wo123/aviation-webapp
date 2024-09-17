import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get("http://localhost:8082/api/user/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
                
            );
            setUsers(response.data);
        }
        
        fetch();
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
