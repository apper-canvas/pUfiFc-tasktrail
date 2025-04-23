import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { setupAuthUI } from '../../services/apperService';

const AuthContainer = ({ mode = 'login' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Setup authentication UI
    const authUI = setupAuthUI(
      '#auth-container',
      (user, account) => {
        // Handle successful authentication
        dispatch(setUser(user));
        navigate('/dashboard');
      },
      (error) => {
        console.error('Authentication error:', error);
      }
    );

    // Show the appropriate authentication form
    if (mode === 'login') {
      authUI?.showLogin('#auth-container');
    } else {
      authUI?.showSignup('#auth-container');
    }

    // Cleanup
    return () => {
      // No specific cleanup needed as the auth container will be removed from DOM
    };
  }, [dispatch, navigate, mode]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        id="auth-container"
        className="w-full max-w-md p-4 min-h-[400px] flex items-center justify-center"
      ></div>
    </div>
  );
};

export default AuthContainer;