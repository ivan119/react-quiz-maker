export const BASE_URL: string = import.meta.env.VITE_BASE_URL || '';

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
    if (import.meta.env.VITE_ENABLE_MOCKS) {
      // just fake delay for .369 second to simulate network delay for mocks
      await new Promise((resolve) => setTimeout(resolve, 369));
    }
    if (!response.ok) {
      // Attempt to get error message from response body
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.message ||
        `API Error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    // No content response
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    // Re-throw the error so it can be caught by the caller
    if (error instanceof Error) throw error;
    throw new Error('An unexpected network error occurred.');
  }
}
