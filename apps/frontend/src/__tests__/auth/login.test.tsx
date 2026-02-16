import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { LoginForm } from '@/app/components/auth/login-form';
import { TanstackQueryProvider } from '@/providers';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

const mockMutateAsync = vi.fn();
vi.mock('@/api/hooks/useLogin.hook', () => ({
  useLogin: ({ onSuccess }: any) => ({
    mutateAsync: mockMutateAsync.mockImplementation(async (data) => {
      if (data.email === 'test@example.com') {
        await onSuccess({
          accessToken: 'fake-token',
          account: { email: 'test@example.com', firstName: 'Tony', secondName: 'Soprano' },
        });
      }
    }),
    isPending: false,
  }),
}));

vi.mock('@/lib/cookies', () => ({ setSessionToken: vi.fn() }));

// is not working
test('Test', async () => {
  render(
    <TanstackQueryProvider>
      <LoginForm />
    </TanstackQueryProvider>,
  );

  const emailInput = screen.getByPlaceholderText(/tony.soprano@jrai.com/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitBtn = screen.getByRole('button', { name: /Sign in/i });

  // Trigger validation
  fireEvent.change(emailInput, { target: { value: 'tony.soprano@gmail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Qwerty-1' } });

  fireEvent.click(submitBtn);
  await waitFor(() => {
    expect(mockMutateAsync).toHaveBeenCalled();
  });
});
