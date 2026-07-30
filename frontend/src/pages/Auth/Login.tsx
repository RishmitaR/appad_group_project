import React, { useState } from "react";

function Login() {

    const [userId, setUserId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");


    const handleLogin = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (userId === "admin" && password === "12345") {

            setError("");

            console.log("Login Successful");

        } else {

            setError("Invalid User ID or Password");

        }

    };


    return (
        <div>

            <h1>HaaS Login Page</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>User Id</label>

                    <input 
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />

                </div>


                <div>
                    <label>Password</label>

                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>


                {error && <p>{error}</p>}


                <button type="submit">
                    Login
                </button>


                <p>
                    Don't have an account? 
                    <a href="/signup"> Sign Up</a>
                </p>

            </form>

        </div>
    );
}

export default Login;
