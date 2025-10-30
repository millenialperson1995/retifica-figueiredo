// Form validation utilities

export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, "")
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, "")
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(1))) return false

  return true
}

export function validateCPFOrCNPJ(value: string): boolean {
  const cleaned = value.replace(/[^\d]/g, "")
  if (cleaned.length === 11) return validateCPF(cleaned)
  if (cleaned.length === 14) return validateCNPJ(cleaned)
  return false
}

export function formatCPFOrCNPJ(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "")
  if (cleaned.length <= 11) {
    // CPF format: 123.456.789-01
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else if (cleaned.length <= 14) {
    // CNPJ format: 12.345.678/0001-91
    return cleaned
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }
  return value
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, "")
  // For Brazilian numbers: 9-digit mobile (9XXXXXXXX) or 8-digit fixed (XXXXXXXX) plus DDD (2 digits)
  // With DDD: should be either 10 digits (fixed) or 11 digits (mobile with '9')
  if (cleaned.length === 11) {
    // Must have '9' as 5th digit for mobile phones (after DDD)
    return cleaned.charAt(2) === '9'
  } else if (cleaned.length === 10) {
    // Fixed line (no '9' after DDD)
    return cleaned.charAt(2) !== '9'
  }
  return false
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePlate(plate: string): boolean {
  // Brazilian plate format: ABC-1234 or ABC1D23 (Mercosul)
  const oldFormat = /^[A-Z]{3}-?\d{4}$/i
  const mercosulFormat = /^[A-Z]{3}\d[A-Z]\d{2}$/i
  return oldFormat.test(plate) || mercosulFormat.test(plate)
}

export function formatCPF(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "")
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  return value
}

export function formatCNPJ(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "")
  return cleaned
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function formatPhone(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "")
  if (cleaned.length <= 2) {
    return cleaned
  } else if (cleaned.length <= 6) {
    return cleaned.replace(/(\d{2})(\d{0,4})/, "($1) $2")
  } else if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  } else if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
  }
  return cleaned.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

export function formatPlate(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7)
}
