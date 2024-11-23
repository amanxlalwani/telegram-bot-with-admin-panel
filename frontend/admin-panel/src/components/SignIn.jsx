import axios from 'axios';
import React, { useState } from 'react';

function SignIn({ onSignIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const BACKEND_URL="http://localhost:3000"
    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/signin`, {adminUsername: username,adminPassword: password });

            if (response.status==200) {
                localStorage.setItem("token",response.data.token);
                onSignIn(); // Update the authenticated state in the parent
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
