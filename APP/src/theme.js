export const colors = {
  bg: '#F6F3FA',
  surface: '#FFFFFF',
  ink: '#1F1633',
  muted: '#7A7090',
  line: '#E6DFF0',
  primary: '#5B2A86',
  primarySoft: '#EBDDF7',
  accent: '#C6F135',
  danger: '#D64545',
  ok: '#2E9E6B',
};

export const statusColors = {
  pendente: '#E8A317',
  preparo: '#3B82F6',
  pronto: '#2E9E6B',
  entregue: '#7A7090',
};

export const STATUS = ['pendente', 'preparo', 'pronto', 'entregue'];

export const brl = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
