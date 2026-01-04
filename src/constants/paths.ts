// HOME PAGE
export const homePath = '/';

// TICKETS PAGES
export const ticketsPath = '/tickets';
export const ticketDetailsPath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPath = (ticketId: string) => `/tickets/${ticketId}/edit`;

// AUTH PAGES/PATHS
export const signUpPath = '/sign-up';
export const signInPath = '/sign-in';
export const passwordForgotPath = '/forgot-password';
