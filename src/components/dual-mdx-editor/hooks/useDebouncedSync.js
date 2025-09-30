import { useRef, useCallback } from 'react';

/**
 * Creates a debounced function that prevents rapid successive calls
 * Essential for two-way editor sync to avoid infinite update loops
 * 
 * @param {Function} fn - The function to debounce
 * @param {number} ms - Debounce delay in milliseconds (default: 400ms)
 * @returns {Function} Debounced function
 */
export function useDebouncedSync(fn, ms = 400) {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), ms);
  }, [fn, ms]);
}

/**
 * Hook for managing two-way sync state between editors
 * Prevents infinite loops by tracking which editor initiated the change
 */
export function useSyncState() {
  const lastUpdatedByRef = useRef(null);
  
  const setLastUpdatedBy = useCallback((source) => {
    lastUpdatedByRef.current = source;
  }, []);
  
  const shouldUpdate = useCallback((source) => {
    // Only update if the change didn't originate from the target editor
    return lastUpdatedByRef.current !== source;
  }, []);
  
  const clearLastUpdatedBy = useCallback(() => {
    lastUpdatedByRef.current = null;
  }, []);
  
  return { setLastUpdatedBy, shouldUpdate, clearLastUpdatedBy };
}