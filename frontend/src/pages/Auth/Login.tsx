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

            if (!loginResponse.ok) {
                setErrorMessage(
                    responseData.message ||
                    "Invalid User ID or password."
                );
                return;
            }

            localStorage.setItem(
                "currentUser",
                responseData.userid || enteredUserId
            );

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

    const goToSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>HaaS Login Page</h1>

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
                            disabled={isLoading}
                        />
                    </div>

                    {errorMessage !== "" && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Login"}
                    </button>
                </form>

                <p className="signup-text">
                    Do not have an account?{" "}
                    <button
                        type="button"
                        className="signup-link"
                        onClick={goToSignup}
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
