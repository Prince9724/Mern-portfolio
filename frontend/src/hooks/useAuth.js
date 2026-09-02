import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { admin, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, loading]);

  return { admin, isAuthenticated, loading };
};