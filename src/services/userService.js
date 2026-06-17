import { userCrud } from './crudService';

export const getUsers = () => userCrud.getAll();

export const getUserById = (id) => userCrud.getById(id);

export const createUser = async (data) => {
  if (data && (data.id === undefined || data.id === null)) {
    const { data: allUsers } = await userCrud.getAll();
    const numericIds = allUsers
      .map((u) => (typeof u.id === 'number' ? u.id : parseInt(u.id, 10)))
      .filter((id) => !isNaN(id));
    const nextId = Math.max(...numericIds, 0) + 1;
    data = { ...data, id: nextId };
  }
  return userCrud.create(data);
};

export const updateUser = (id, data) => userCrud.update(id, data);

export const deleteUser = (id) => userCrud.remove(id);

export const updateUserBalance = (id, saldo) => userCrud.update(id, { saldo });

export const getRanking = async () => {
  const { data } = await userCrud.getAll({ perfil: 'user' });
  const sorted = [...data].sort((a, b) => Number(b.saldo) - Number(a.saldo));
  return { data: sorted };
};

export const updateProfile = async (id, { nome, email }) => {
  const { data: existing } = await userCrud.getAll({ email });
  const duplicate = existing.find((u) => String(u.id) !== String(id));
  if (duplicate) throw new Error('E-mail já está em uso por outra conta.');
  return userCrud.update(id, { nome: nome.trim(), email: email.trim().toLowerCase() });
};

export const changePassword = async (id, senhaAtual, novaSenha) => {
  const { data: user } = await userCrud.getById(id);
  if (user.senha !== senhaAtual) throw new Error('Senha atual incorreta.');
  return userCrud.update(id, { senha: novaSenha });
};
