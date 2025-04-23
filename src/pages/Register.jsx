import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';

const Register = () => {
  useEffect(() => {
    document.title = 'Sign Up - TaskTrail';
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-2">
          Join TaskTrail to organize your tasks effectively
        </p>
      </div>
      
      <AuthContainer mode="signup" />
      
      <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;