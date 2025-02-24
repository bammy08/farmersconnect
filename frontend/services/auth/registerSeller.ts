import { api } from '@/lib/api';

export const registerSeller = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post('/auth/register-seller', {
    name,
    email,
    password,
  });
  return res.data;
};
