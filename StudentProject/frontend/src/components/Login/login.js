import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../repository/Authentication/auth_service"; // Adjust path
import "./login.css"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await authService.login(username, password);

            if (data.access_token) {
                // You already store user inside authService.login
                // So retrieve user info from localStorage or from `data`
                const role = data.role;
                const userId = data.user_id;

                if (role === "ROLE_PROFESSOR") {
                    navigate(`/subject-allocations/${username}/subjects`);
                } else if (role === "ROLE_STUDENT") {
                    navigate(`/student/${username}/subjects`);
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="login-form-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group mt-2">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="btn login-btn">
                    Login
                </button>
            </form>
            </div>
        </div>
    );
}

export default Login;
