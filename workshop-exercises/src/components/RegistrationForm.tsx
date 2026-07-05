import React, { useState } from 'react';
import type { UserRole } from '../models/user';

interface RegistrationFormProps {
  onSubmit: (data: { name: string; email: string; password: string; role: UserRole }) => void | Promise<void>;
  isLoading?: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), password, role });
      setName('');
      setEmail('');
      setPassword('');
      setRole('viewer');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit registration');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-stack">
      <label>
        Full Name
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label>
        Role
        <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </label>

      {error ? <p role="alert">{error}</p> : null}

      <button className="btn btn--primary" type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
};