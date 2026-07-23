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
            </form>
        </div>
    )
}

export default Login;

