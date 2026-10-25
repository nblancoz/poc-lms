import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { UserSwitcher } from './components/UserSwitcher';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import { LearningDashboard } from './views/LearningDashboard';

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
        ) : !user ? (
          <AuthForm />
        ) : (
          <LearningDashboard key={user.id} />
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
