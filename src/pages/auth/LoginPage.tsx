// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import logo from '../../assets/logo.png';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Image,
  Stack,
} from '@mantine/core';

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
    <Container size={420} my={40}>
      <Stack align="center" spacing="md">
        <Image src={logo} alt="Company Logo" width={80} />
        <Title align="center">
          Estate Asset Management
        </Title>
      </Stack>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              radius="md"
              name="email"
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              radius="md"
              name="password"
            />
            <Button type="submit" loading={isLoading} fullWidth mt="xl" radius="md">
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
