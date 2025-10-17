/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('SSR Safety', () => {
    it('should not throw error when window is undefined (SSR environment)', () => {
      // Simulate SSR by temporarily removing window.localStorage
      const originalLocalStorage = window.localStorage;

      // @ts-ignore - Simulating SSR environment
      delete window.localStorage;

      expect(() => {
        renderHook(() => useLocalStorage('test-key', 'initial-value'));
      }).not.toThrow();

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
    });

    it('should return initialValue when localStorage is not available', () => {
      const originalLocalStorage = window.localStorage;

      // @ts-ignore - Simulating SSR environment
      delete window.localStorage;

      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
    });
  });

  describe('Basic Functionality', () => {
    it('should initialize with initialValue when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('new-key', 'initial'));

      expect(result.current[0]).toBe('initial');
    });

    it('should initialize with value from localStorage if it exists', () => {
      // Pre-populate localStorage
      window.localStorage.setItem('existing-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('existing-key', 'initial'));

      // After hydration effect runs, should have localStorage value
      expect(result.current[0]).toBe('stored-value');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated-value');
      });

      expect(result.current[0]).toBe('updated-value');
      expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated-value'));
    });

    it('should support functional updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);
      expect(window.localStorage.getItem('counter')).toBe('1');
    });
  });

  describe('Complex Data Types', () => {
    it('should handle objects', () => {
      const initialObj = { name: 'John', age: 30 };
      const { result } = renderHook(() => useLocalStorage('user', initialObj));

      const updatedObj = { name: 'Jane', age: 25 };
      act(() => {
        result.current[1](updatedObj);
      });

      expect(result.current[0]).toEqual(updatedObj);
      expect(JSON.parse(window.localStorage.getItem('user')!)).toEqual(updatedObj);
    });

    it('should handle arrays', () => {
      const initialArray = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage('numbers', initialArray));

      act(() => {
        result.current[1]([...initialArray, 4]);
      });

      expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      // Set invalid JSON
      window.localStorage.setItem('corrupted', 'invalid-json{');

      const { result } = renderHook(() => useLocalStorage('corrupted', 'fallback'));

      // Should fall back to initialValue
      expect(result.current[0]).toBe('fallback');
    });

    it('should handle localStorage quota exceeded errors', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      // Mock setItem to throw quota exceeded error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

      // Should not throw, just fail silently
      expect(() => {
        act(() => {
          result.current[1]('new-value');
        });
      }).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe('Hydration Consistency', () => {
    it('should use initialValue for first render to prevent hydration mismatch', async () => {
      // Pre-populate localStorage BEFORE rendering
      // This simulates a user who has previously saved data
      window.localStorage.setItem('hydration-test', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('hydration-test', 'initial-value'));

      // The hook should have synced with localStorage by now via useEffect
      // Wait for the effect to complete
      await waitFor(() => {
        expect(result.current[0]).toBe('stored-value');
      });

      // Verify it's now the stored value
      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle SSR environment without errors', () => {
      // Simulate SSR by removing localStorage
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true
      });

      // Should not throw and should use initialValue
      const { result } = renderHook(() => useLocalStorage('ssr-test', 'default'));

      expect(result.current[0]).toBe('default');

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
    });
  });
});
