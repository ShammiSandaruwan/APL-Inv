// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import logo from '../../assets/logo.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showErrorToast(error.message);
    } else {
      showSuccessToast('Logged in successfully!');
      // The user will be redirected to the dashboard by the router logic
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gin">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <img src={logo} alt="Company Logo" className="w-32 mx-auto" />
        <h1 className="text-2xl font-bold text-center text-mine-shaft">
          Estate Asset Management
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
