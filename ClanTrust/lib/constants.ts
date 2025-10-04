export const clans = [
  { label: 'Akasolya', value: 'akasolya' },
  { label: 'Essiga', value: 'essiga' },
  { label: 'Omutuba', value: 'omutuba' },
  { label: 'Olunyiriri', value: 'olunyiriri' },
  { label: 'Oluggya', value: 'oluggya' },
  { label: 'Enju', value: 'enju' }
] as const;

export type ClanValue = (typeof clans)[number]['value'];

export const roles = ['admin', 'client', 'paralegal', 'notary'] as const;
