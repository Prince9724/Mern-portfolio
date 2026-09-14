import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { admin, isAuthenticated, loading, initialCheckDone } = useSelector(
    (state) => state.auth
  );
  const hasChecked = useRef(false);

  useEffect(() => {
    // Sirf ek baar check karo
    if (!hasChecked.current && !isAuthenticated && !initialCheckDone) {
      hasChecked.current = true;
      
      // Agar token hai toh verify karo
      const token = localStorage.getItem('adminToken');
      if (token) {
        dispatch(getMe());
      }
    }
  }, [dispatch, isAuthenticated, initialCheckDone]);

  return { admin, isAuthenticated, loading };
};