export type AppMessage = {
  id: string;
  severity: 'success' | 'info' | 'warn' | 'error';
  content: string;
  closable: boolean;
};

export type AddMessageInput = Omit<AppMessage, 'id' | 'closable'> & {
  closable?: boolean;
};
