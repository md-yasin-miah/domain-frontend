/**
 * Error handler utilities for API error responses
 * Handles FastAPI/Pydantic validation errors and other API error formats
 */

interface ValidationErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: any;
}

interface ApiErrorResponse {
  detail?: ValidationErrorDetail[] | string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Extracts a user-friendly error message from API error response
 */
export const extractErrorMessage = (error: any): string => {
  // Handle RTK Query error format
  const errorData = error?.data || error;

  // If errorData is already a string, return it
  if (typeof errorData === 'string') {
    return errorData;
  }

  // Handle FastAPI/Pydantic validation errors
  if (errorData?.detail) {
    // If detail is an array (validation errors)
    if (Array.isArray(errorData.detail)) {
      const validationErrors = errorData.detail as ValidationErrorDetail[];
      
      // Extract field names and messages
      const fieldErrors = validationErrors.map((err) => {
        const field = err.loc[err.loc.length - 1]; // Get the last element (field name)
        return `${field}: ${err.msg}`;
      });

      // Return combined error message
      if (fieldErrors.length === 1) {
        return fieldErrors[0];
      }
      return fieldErrors.join(', ');
    }
    
    // If detail is a string
    if (typeof errorData.detail === 'string') {
      return errorData.detail;
    }
  }

  // Handle standard error formats
  if (errorData?.message) {
    return errorData.message;
  }

  if (errorData?.error) {
    return errorData.error;
  }

  // Handle errors object (field-specific errors)
  if (errorData?.errors && typeof errorData.errors === 'object') {
    const fieldErrors = Object.entries(errorData.errors).map(([field, messages]) => {
      const messageArray = Array.isArray(messages) ? messages : [messages];
      return `${field}: ${messageArray.join(', ')}`;
    });
    return fieldErrors.join('; ');
  }

  // Fallback to status-based messages
  if (error?.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid credentials. Please check your email and password.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error ${error.status}: ${error.statusText || 'An error occurred'}`;
    }
  }

  // Final fallback
  return error?.message || 'An unexpected error occurred';
};

/**
 * Extracts validation errors by field name
 */
export const extractFieldErrors = (error: any): Record<string, string> => {
  const errorData = error?.data || error;
  const fieldErrors: Record<string, string> = {};

  if (errorData?.detail && Array.isArray(errorData.detail)) {
    const validationErrors = errorData.detail as ValidationErrorDetail[];
    
    validationErrors.forEach((err) => {
      const field = err.loc[err.loc.length - 1] as string;
      if (field) {
        fieldErrors[field] = err.msg;
      }
    });
  }

  if (errorData?.errors && typeof errorData.errors === 'object') {
    Object.entries(errorData.errors).forEach(([field, messages]) => {
      const messageArray = Array.isArray(messages) ? messages : [messages];
      fieldErrors[field] = messageArray.join(', ');
    });
  }

  return fieldErrors;
};

/**
 * Checks if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  const errorData = error?.data || error;
  return (
    (errorData?.detail && Array.isArray(errorData.detail)) ||
    (errorData?.errors && typeof errorData.errors === 'object') ||
    error?.status === 422
  );
};

/**
 * Sets form field errors from API error response
 * 
 * @param form - React Hook Form instance
 * @param error - API error object
 * @param fieldMapping - Optional mapping from backend field names to form field names
 * @param allowedFields - Optional array of allowed form field names (only these will have errors set)
 * @returns true if field-specific errors were set, false otherwise
 * 
 * @example
 * ```ts
 * const hasFieldErrors = setFormErrors(form, error, {
 *   counter_amount: 'amount',
 *   user_email: 'email'
 * }, ['amount', 'message']);
 * 
 * if (!hasFieldErrors) {
 *   toast({ title: extractErrorMessage(error) });
 * }
 * ```
 */
export const setFormErrors = <TFieldValues extends Record<string, any>>(
  form: {
    setError: (
      name: keyof TFieldValues,
      error: { type?: string; message: string }
    ) => void;
  },
  error: any,
  fieldMapping?: Record<string, keyof TFieldValues>,
  allowedFields?: (keyof TFieldValues)[]
): boolean => {
  const fieldErrors = extractFieldErrors(error);
  
  if (Object.keys(fieldErrors).length === 0) {
    return false;
  }

  let hasSetErrors = false;

  Object.entries(fieldErrors).forEach(([backendField, message]) => {
    // Map backend field name to form field name
    let formField: keyof TFieldValues;
    
    if (fieldMapping && fieldMapping[backendField]) {
      // Use explicit mapping if provided
      formField = fieldMapping[backendField];
    } else {
      // Try to use backend field name directly, or check if it's in allowed fields
      formField = backendField as keyof TFieldValues;
    }

    // Only set error if field is in allowed fields (if provided)
    if (!allowedFields || allowedFields.includes(formField)) {
      form.setError(formField, {
        type: 'server',
        message: message,
      });
      hasSetErrors = true;
    }
  });

  return hasSetErrors;
};

