import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, password }),
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(responseData.detail || 'Signup failed');
            }

            setSuccessMessage('Account created successfully. Redirecting to login...');
            setUserid('');
            setPassword('');

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Signup failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create Account</h1>
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
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </button>

                <p>
                    Already have an account? <a href="/">Login</a>
                </p>
            </form>
        </div>
    );
}

export default Signup;
