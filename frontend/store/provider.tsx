'use client';

import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { loadUserFromStorage } from './slices/authSlice';

function InitAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (loading) return null; // ✅ Prevent flashing while loading auth state

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuth>{children}</InitAuth> {/* ✅ Load auth before rendering */}
    </Provider>
  );
}
