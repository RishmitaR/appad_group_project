function Signup() {
  return (
    <div>
      <h1>HaaS Sign Up Page</h1>

      <form>
        <div>
          <label>User ID</label>
          <input type="text" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" />
        </div>

        <div>
          <label>Password</label>
          <input type="password" />
        </div>

        <div>
          <label>Confirm Password</label>
          <input type="password" />
        </div>

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;