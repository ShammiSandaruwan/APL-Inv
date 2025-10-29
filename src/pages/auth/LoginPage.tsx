// src/pages/auth/LoginPage.tsx
import {
  Anchor,
  Button,
  Container,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\\S+@\\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        showErrorToast(error.message);
      } else {
        showSuccessToast('Logged in successfully!');
        // The router will handle redirection
      }
    } catch (error: any) {
      showErrorToast(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Stack align="center" justify="center" gap="md">
        <Image src={logo} alt="Company Logo" w={100} />
        <Title ta="center">Estate Asset Management</Title>
      </Stack>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="superadmin@example.com"
              {...form.getInputProps('email')}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps('password')}
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="lg">
            <Anchor component={Link} to="#" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
