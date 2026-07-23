function Login() {
    return (
        <div>
            <h1>HaaS Login Page</h1>
            <form>
                <div>
                    <label>User Id </label>
                    <input type="text" />
                </div>
                <div>
                    <label>Password </label>

                    <input type="password" />

                </div>
                <button type="submit">Login</button>

                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </form>
        </div>
    )
}

export default Login;

