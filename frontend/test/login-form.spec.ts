import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Login Form', () => {
  beforeEach(() => {
    const loginHtml = readFileSync(
      resolve(__dirname, '../views/login.hbs'),
      'utf8',
    );
    document.body.innerHTML = loginHtml;
  });

  describe('Structure', () => {
    test('renders the login form with all elements', () => {
      expect(
        screen.getByRole('heading', { name: /login/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /login/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute(
        'href',
        '/',
      );
    });

    test('fields should have required attributes', () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Interactions', () => {
    test('allows user to fill the form', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, '123456Test*');

      expect(emailInput).toHaveValue('admin@example.com');
      expect(passwordInput).toHaveValue('123456Test*');
    });

    test('navigates to home when clicking on "Register"', () => {
      const registerLink = screen.getByRole('link', { name: /register/i });
      expect(registerLink).toHaveAttribute('href', '/');
    });
  });
});
