// app/hooks/useEditorHistory.js
import { useState, useCallback } from 'react';

export const useEditorHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = useCallback((newState) => {
    // Don't push if it's the same as current state
    if (JSON.stringify(newState) === JSON.stringify(currentState)) {
      return;
    }

    // Remove any future states if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    
    setHistory([...newHistory, newState]);
    setCurrentIndex(newHistory.length);
  }, [history, currentIndex, currentState]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  return {
    history,
    currentState,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};