import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Invalid username or password');
            }

            const responseData = await response.json().catch(() => ({}));
            localStorage.setItem('currentUser', responseData.userid || userid);
            navigate('/projectmanagement');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>HaaS Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User Id </label>
                    <input
                        type="text"
                        value={userid}
                        onChange={(event) => setUserid(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </form>
        </div>
    );
}

export default Login;

