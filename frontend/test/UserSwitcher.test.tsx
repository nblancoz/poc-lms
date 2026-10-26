import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UserSwitcher } from '../src/components/UserSwitcher';
import { AuthContext, type AuthContextType } from '../src/context/auth-context';

function renderWithAuth(ui: React.ReactElement, authOverrides: Partial<AuthContextType> = {}) {
  const defaultAuthValue: AuthContextType = {
    user: {
      id: 'user-carlos',
      email: 'student.enrolled@example.com',
      name: 'Alumno Matriculado',
    },
    token: 'valid-token',
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    quickLogin: jest.fn().mockResolvedValue(undefined),
    ...authOverrides,
  };

  return {
    ...render(<AuthContext.Provider value={defaultAuthValue}>{ui}</AuthContext.Provider>),
    authValue: defaultAuthValue,
  };
}

describe('UserSwitcher Component (1-click preset switching)', () => {
  it('renders both enrolled and unenrolled test user preset options', () => {
    renderWithAuth(<UserSwitcher />);

    expect(screen.getByText('Usuarios de prueba')).toBeInTheDocument();
    expect(screen.getByText('Alumno Matriculado')).toBeInTheDocument();
    expect(screen.getByText('student.enrolled@example.com')).toBeInTheDocument();
    expect(screen.getByText('Alumno Sin Acceso')).toBeInTheDocument();
    expect(screen.getByText('student.noaccess@example.com')).toBeInTheDocument();
  });

  it('indicates which user is currently active with aria-pressed and active class', () => {
    renderWithAuth(<UserSwitcher />, {
      user: {
        id: 'user-carlos',
        email: 'student.enrolled@example.com',
        name: 'Alumno Matriculado',
      },
    });

    const enrolledBtn = screen.getByRole('button', { name: /alumno matriculado/i });
    const noAccessBtn = screen.getByRole('button', { name: /alumno sin acceso/i });

    expect(enrolledBtn).toHaveAttribute('aria-pressed', 'true');
    expect(enrolledBtn).toHaveClass('active');

    expect(noAccessBtn).toHaveAttribute('aria-pressed', 'false');
    expect(noAccessBtn).not.toHaveClass('active');
  });

  it('calls quickLogin with "noaccess" when clicking on the unenrolled user button', async () => {
    const quickLoginMock = jest.fn().mockResolvedValue(undefined);
    renderWithAuth(<UserSwitcher />, { quickLogin: quickLoginMock });

    const noAccessBtn = screen.getByRole('button', { name: /alumno sin acceso/i });
    fireEvent.click(noAccessBtn);

    await waitFor(() => {
      expect(quickLoginMock).toHaveBeenCalledWith('noaccess');
    });
  });

  it('displays error alert when quickLogin fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const quickLoginMock = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    renderWithAuth(<UserSwitcher />, { quickLogin: quickLoginMock });

    const noAccessBtn = screen.getByRole('button', { name: /alumno sin acceso/i });
    fireEvent.click(noAccessBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});
