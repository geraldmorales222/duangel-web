// src/lib/constants.ts

export const getAdminEmails = (): string[] => {
  const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  // Convertimos el string en Array y limpiamos espacios vacíos
  return emails.split(',').map(email => email.trim()).filter(email => email !== '');
};