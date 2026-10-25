import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { UserSwitcher } from './components/UserSwitcher';
import { AuthProvider, useAuth } from './context';

function MainApp() {
  const { user, isLoading } = useAuth();

  return (
    <>
      <Header />
      <main className="main-content">
        <UserSwitcher />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner-md" />
          </div>
        ) : user ? (
          <UserProfile />
        ) : (
          <AuthForm />
        )}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
