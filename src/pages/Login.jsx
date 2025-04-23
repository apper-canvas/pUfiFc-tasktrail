import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';

const Login = () => {
  useEffect(() => {
    document.title = 'Login - TaskTrail';
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-2">
          Sign in to access your tasks
        </p>
      </div>
      
      <AuthContainer mode="login" />
      
      <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;