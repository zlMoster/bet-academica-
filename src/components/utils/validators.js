const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const parsePositiveNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num;
};

export const validateEventDate = (dateStr, { allowPast = false } = {}) => {
  if (!dateStr || !dateStr.trim()) return 'Data é obrigatória.';
  if (!DATE_REGEX.test(dateStr)) return 'Formato inválido. Use o seletor de data.';

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Data inválida. Verifique dia, mês e ano.';
  }

  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return 'A data do evento não pode ser no passado.';
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  if (date > maxDate) return 'A data não pode ultrapassar 2 anos no futuro.';

  return null;
};

export const validateOdd = (value, { required = true, allowZero = false, label = 'Odd' } = {}) => {
  const num = parsePositiveNumber(value);

  if (num === null) {
    return required ? `${label} é obrigatória.` : null;
  }

  if (num < 0) return `${label} não pode ser negativa.`;
  if (allowZero && num === 0) return null;
  if (num < 1.01) return `${label} deve ser no mínimo 1.01.`;
  if (num > 999.99) return `${label} não pode ultrapassar 999.99.`;

  return null;
};

export const validateEventForm = (formData, { isEditing = false } = {}) => {
  const errors = {};

  const nome = formData.nome?.trim();
  if (!nome || nome.length < 3) {
    errors.nome = 'Nome do evento deve ter pelo menos 3 caracteres.';
  }
  if (nome && nome.length > 120) {
    errors.nome = 'Nome muito longo (máx. 120 caracteres).';
  }

  const dateError = validateEventDate(formData.data, { allowPast: isEditing });
  if (dateError) errors.data = dateError;

  const oddCasaError = validateOdd(formData.odd_casa, { label: 'Odd Casa' });
  if (oddCasaError) errors.odd_casa = oddCasaError;

  const oddVisitanteError = validateOdd(formData.odd_visitante, { label: 'Odd Visitante' });
  if (oddVisitanteError) errors.odd_visitante = oddVisitanteError;

  const empateRaw = formData.odd_empate;
  const empateNum = parsePositiveNumber(empateRaw);
  const isFootball = formData.esporte === 'Futebol';

  if (empateNum === null && empateRaw !== '' && empateRaw !== '0') {
    errors.odd_empate = 'Odd de empate inválida.';
  } else if (empateNum !== null && empateNum < 0) {
    errors.odd_empate = 'Odd de empate não pode ser negativa.';
  } else if (empateNum !== null && empateNum > 0 && empateNum < 1.01) {
    errors.odd_empate = 'Odd de empate deve ser 0 ou no mínimo 1.01.';
  } else if (empateNum !== null && empateNum > 999.99) {
    errors.odd_empate = 'Odd de empate não pode ultrapassar 999.99.';
  } else if (isFootball && (empateNum === null || empateNum === 0)) {
    errors.odd_empate = 'Futebol exige odd de empate (mín. 1.01).';
  }

  return errors;
};

export const validateBetAmount = (value, maxSaldo) => {
  const num = parsePositiveNumber(value);

  if (num === null) return 'Informe um valor válido para a aposta.';
  if (num <= 0) return 'O valor da aposta deve ser maior que zero.';
  if (!Number.isInteger(num)) return 'Use apenas valores inteiros (sem centavos).';
  if (num > maxSaldo) return 'Saldo insuficiente para esta aposta.';
  if (num > 100000) return 'Valor máximo por aposta: R$ 100.000.';

  return null;
};

export const validateBalance = (value) => {
  const num = parsePositiveNumber(value);

  if (num === null) return 'Informe um saldo válido.';
  if (num < 0) return 'Saldo não pode ser negativo.';
  if (num > 9999999) return 'Saldo máximo permitido: R$ 9.999.999.';

  return null;
};

export const validateEmail = (email) => {
  if (!email?.trim()) return 'E-mail é obrigatório.';
  const cleaned = email.trim().toLowerCase();
  if (cleaned.includes(' ')) return 'E-mail não pode conter espaços.';
  if (!cleaned.includes('@') || !cleaned.endsWith('.com')) {
    return 'E-mail deve conter @ e terminar em .com.';
  }

  const [localPart, domainPart] = cleaned.split('@');
  if (!localPart || !domainPart) return 'E-mail inválido.';
  if (localPart.length > 64) return 'E-mail inválido.';
  if (domainPart.length > 255) return 'E-mail inválido.';

  const localRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localRegex.test(localPart)) return 'E-mail inválido.';

  const domainRegex = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.com$/;
  if (!domainRegex.test(domainPart)) return 'E-mail inválido.';

  if (domainPart.startsWith('.') || domainPart.endsWith('.') || domainPart.includes('..')) {
    return 'E-mail inválido.';
  }

  return null;
};

export const validateProfileForm = ({ nome, email }) => {
  const errors = {};
  const name = nome?.trim();
  if (!name || name.length < 2) errors.nome = 'Nome deve ter pelo menos 2 caracteres.';
  if (name && name.length > 80) errors.nome = 'Nome muito longo (máx. 80).';
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  return errors;
};

export const validatePasswordChange = (senhaAtual, novaSenha, confirmarSenha) => {
  const errors = {};
  if (!senhaAtual) errors.senhaAtual = 'Informe a senha atual.';
  if (!novaSenha || novaSenha.length < 3) errors.novaSenha = 'Nova senha deve ter pelo menos 3 caracteres.';
  if (novaSenha !== confirmarSenha) errors.confirmarSenha = 'As senhas não coincidem.';
  if (senhaAtual && novaSenha && senhaAtual === novaSenha) {
    errors.novaSenha = 'A nova senha deve ser diferente da atual.';
  }
  return errors;
};

export const validateWithdraw = (value, maxSaldo) => {
  const num = parsePositiveNumber(value);
  if (num === null) return 'Informe um valor válido.';
  if (num <= 0) return 'O valor deve ser maior que zero.';
  if (!Number.isInteger(num)) return 'Use apenas valores inteiros.';
  if (num > maxSaldo) return 'Saldo insuficiente para este saque.';
  if (num < 10) return 'Saque mínimo fictício: R$ 10.';
  if (num > 50000) return 'Saque máximo fictício por operação: R$ 50.000.';
  return null;
};

export const validateDeposit = (value) => {
  const num = parsePositiveNumber(value);
  if (num === null) return 'Informe um valor válido.';
  if (num <= 0) return 'O valor deve ser maior que zero.';
  if (!Number.isInteger(num)) return 'Use apenas valores inteiros.';
  if (num > 50000) return 'Depósito máximo fictício por operação: R$ 50.000.';
  return null;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
