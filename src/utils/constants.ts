// Rôles utilisateurs
export const ROLES = {
  ADMIN: "ADMIN",
  MERCHANT: "MERCHANT",
  CLIENT: "CLIENT",
};

// Statuts paiements
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
  MOBILE_MONEY: "MOBILE_MONEY",
};

// Statuts notifications
export const NOTIFICATION_STATUS = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
};

// Types de notifications
export const NOTIFICATION_CHANNELS = {
  EMAIL: "EMAIL",
  SMS: "SMS",
};

// Types de logs (Audit)
export const AUDIT_ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  NOTIFICATION_SENT: "NOTIFICATION_SENT",
};
