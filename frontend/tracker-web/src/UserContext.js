import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const response = await axios.get(`${BASE_URL}/api/users/me/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
