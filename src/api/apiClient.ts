export const BASE_URL: string = import.meta.env.VITE_BASE_URL;
export const USE_LOCAL_STORAGE: boolean =
  import.meta.env.VITE_USE_LOCAL_STORAGE === 'true';

export const STORAGE_KEYS = {
  QUIZZES: 'rejd_quizzes',
  QUESTIONS: 'rejd_questions',
};

// Local Storage Helpers

export const getStored = <T>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export const setStored = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Global API Request Handler

/**
 * A global request handler that throws an error on non-ok responses.
 * This allows using try-catch blocks in components.
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // Attempt to get error message from response body
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.message ||
        `API Error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return (await response.json()) as T;
  } catch (error) {
    // Re-throw the error so it can be caught by the caller
    if (error instanceof Error) throw error;
    throw new Error('An unexpected network error occurred.');
  }
}
