export interface StateChangeEvent {
  type: 'SHOW_USER_FORM' | 'SHOW_GRID' | 'SHOW_ERROR';
  message?: string;
}