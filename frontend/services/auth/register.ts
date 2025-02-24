import { api } from '@/lib/api';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};
