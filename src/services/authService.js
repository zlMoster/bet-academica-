import { userCrud } from './crudService';
import { validateEmail } from '../components/utils/validators';

export const loginService = async (email, senha) => {
  // Fetch all users and perform a case-insensitive email match
  const { data } = await userCrud.getAll();
  const user = data.find(
    (u) => String(u.email).toLowerCase() === String(email).toLowerCase() && u.senha === senha
  );
  if (!user) throw new Error('Credenciais inválidas');
  return user;
};

export const registerService = async (userData) => {
  const emailError = validateEmail(userData.email);
  if (emailError) throw new Error(emailError);

  const { data: existing } = await userCrud.getAll({ email: userData.email });
  if (existing.length > 0) throw new Error('E-mail já cadastrado');

  // Get all users to find the next numeric ID
  const { data: allUsers } = await userCrud.getAll();
  const numericIds = allUsers
    .map(u => typeof u.id === 'number' ? u.id : parseInt(u.id, 10))
    .filter(id => !isNaN(id));
  const nextId = Math.max(...numericIds, 0) + 1;

  const { data } = await userCrud.create({
    ...userData,
    id: nextId,
    perfil: 'user',
    saldo: 1000
  });
  return data;
};
