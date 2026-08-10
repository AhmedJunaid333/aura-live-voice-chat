import React, { useState, useEffect } from 'react';

// Toast Notification Interface
export interface ToastMessage {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  timestamp: string;
  module?: string;
}

// Admin Audit Error Log Interface
export interface AdminErrorLog {
  id: string;
  timestamp: string;
  userId?: string;
  module: string;
  endpoint?: string;
  error: string;
  stackTrace?: string;
  deviceInfo: string;
  networkStatus: 'ONLINE' | 'OFFLINE';
}

// Global In-Memory Stores
type ToastListener = (toasts: ToastMessage[]) => void;
type ErrorLogListener = (logs: AdminErrorLog[]) => void;

let activeToasts: ToastMessage[] = [];
let adminErrorLogs: AdminErrorLog[] = [];

const toastListeners: Set<ToastListener> = new Set();
const errorLogListeners: Set<ErrorLogListener> = new Set();

export const notifyToastListeners = () => {
  toastListeners.forEach(fn => fn([...activeToasts]));
};

export const notifyErrorLogListeners = () => {
  errorLogListeners.forEach(fn => fn([...adminErrorLogs]));
};

/**
 * 🌟 3-LEVEL ENTERPRISE ERROR HANDLER
 * Level 1: User-Facing Toast/Snackbar
 * Level 2: Developer Console & Diagnostics
 * Level 3: Admin Panel Real-Time Audit Log Record
 */
export const handleEnterpriseError = (
  userMessage: string,
  errorDetails?: any,
  module: string = 'System',
  endpoint?: string,
  userId?: string
) => {
  const timestamp = new Date().toISOString();
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  // LEVEL 1: USER TOAST
  const newToast: ToastMessage = {
    id: toastId,
    message: userMessage,
    type: 'error',
    timestamp,
    module,
  };
  activeToasts = [newToast, ...activeToasts].slice(0, 5); // Keep max 5 active toasts
  notifyToastListeners();

  // Auto dismiss toast after 4 seconds
  setTimeout(() => {
    activeToasts = activeToasts.filter(t => t.id !== toastId);
    notifyToastListeners();
  }, 4000);

  // LEVEL 2: DEVELOPER LOGGING
  console.error(`[AURA LIVE ERROR][${module}] ${userMessage}`, {
    timestamp,
    endpoint,
    userId,
    rawError: errorDetails,
    stack: errorDetails?.stack || 'N/A',
  });

  // LEVEL 3: ADMIN AUDIT LOG RECORD
  const newAuditLog: AdminErrorLog = {
    id: `ERR-${Date.now()}`,
    timestamp,
    userId: userId || 'USR-ANONYMOUS',
    module,
    endpoint: endpoint || '/api/v1/system',
    error: `${userMessage} | ${errorDetails?.message || errorDetails || 'Execution Exception'}`,
    stackTrace: errorDetails?.stack || 'No stacktrace recorded',
    deviceInfo: typeof navigator !== 'undefined' ? `${navigator.userAgent} (${navigator.platform})` : 'Web Browser',
    networkStatus: typeof navigator !== 'undefined' && navigator.onLine ? 'ONLINE' : 'OFFLINE',
  };

  adminErrorLogs = [newAuditLog, ...adminErrorLogs].slice(0, 100);
  notifyErrorLogListeners();
};

/**
 * 🌟 SHOW SUCCESS OR INFO TOAST
 */
export const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info', module?: string) => {
  const timestamp = new Date().toISOString();
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const newToast: ToastMessage = {
    id: toastId,
    message,
    type,
    timestamp,
    module,
  };
  activeToasts = [newToast, ...activeToasts].slice(0, 5);
  notifyToastListeners();

  setTimeout(() => {
    activeToasts = activeToasts.filter(t => t.id !== toastId);
    notifyToastListeners();
  }, 3500);
};

export const toast = {
  success: (message: string, module?: string) => showToast(message, 'success', module),
  error: (message: string, module?: string) => handleEnterpriseError(message, undefined, module),
  warning: (message: string, module?: string) => showToast(message, 'warning', module),
  info: (message: string, module?: string) => showToast(message, 'info', module),
};

/**
 * React Hook to subscribe to Toast Notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>(activeToasts);

  useEffect(() => {
    const listener: ToastListener = (updatedToasts) => setToasts(updatedToasts);
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    dismissToast: (id: string) => {
      activeToasts = activeToasts.filter(t => t.id !== id);
      notifyToastListeners();
    },
  };
};

/**
 * React Hook to subscribe to Admin Error Logs
 */
export const useAdminErrorLogs = () => {
  const [logs, setLogs] = useState<AdminErrorLog[]>(adminErrorLogs);

  useEffect(() => {
    const listener: ErrorLogListener = (updatedLogs) => setLogs(updatedLogs);
    errorLogListeners.add(listener);
    return () => {
      errorLogListeners.delete(listener);
    };
  }, []);

  return { logs };
};

/**
 * 🌟 PRODUCTION API CLIENT WRAPPER WITH TIMEOUT & ERROR INTERCEPTION
 */
export const fetchLiveApi = async (
  endpoint: string,
  options: RequestInit = {},
  module: string = 'API Client'
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Platform-Client': 'Auralive-WebMobile',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      handleEnterpriseError(
        `HTTP Error ${response.status}: ${response.statusText || 'API Request Failed'}`,
        errText,
        module,
        endpoint
      );
      throw new Error(`API ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      handleEnterpriseError('Server request timeout. Please check your network connection.', err, module, endpoint);
    } else if (!navigator.onLine) {
      handleEnterpriseError('Network connection lost. Please verify internet access.', err, module, endpoint);
    } else {
      handleEnterpriseError(`Unable to connect to ${endpoint}`, err, module, endpoint);
    }
    throw err;
  }
};
