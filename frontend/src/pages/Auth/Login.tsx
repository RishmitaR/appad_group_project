import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [userId, setUserId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const enteredUserId = userId.trim();

        // Check whether both fields are filled.
        if (enteredUserId === "" || password === "") {
            setErrorMessage("Please enter both User ID and password.");
            return;
        }

        setErrorMessage("");
        setIsLoading(true);

        try {
            const loginResponse = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userid: enteredUserId,
                    password: password,
                }),
            });

            const responseData = await loginResponse.json();

            // Show an error if the backend rejects the login.
            if (!loginResponse.ok) {
                setErrorMessage(
                    responseData.message ||
                    "Invalid User ID or password."
                );
                return;
            }

            // Store the logged-in user's ID.
            localStorage.setItem(
                "currentUser",
                responseData.userid || enteredUserId
            );

            // Go to the project management page.
            navigate("/projectmanagement");
        } catch (error) {
            console.error("Login request failed:", error);

            setErrorMessage(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>HaaS Login</h1>

                <p>Enter your account details to continue.</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="userId">User ID</label>

                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(event) =>
                                setUserId(event.target.value)
                            }
                            placeholder="Enter your User ID"
                            autoComplete="username"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>

                    {errorMessage !== "" && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;