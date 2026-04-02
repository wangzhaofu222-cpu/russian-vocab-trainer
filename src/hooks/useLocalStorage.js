import { useEffect, useState } from 'react';

function resolveInitialValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue;
}

function readLocalStorageValue(key, initialValue) {
  if (!key || typeof window === 'undefined') {
    return resolveInitialValue(initialValue);
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : resolveInitialValue(initialValue);
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}"`, error);
    return resolveInitialValue(initialValue);
  }
}

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => ({
    key,
    value: readLocalStorageValue(key, initialValue),
  }));

  useEffect(() => {
    if (!key) {
      setState({
        key,
        value: resolveInitialValue(initialValue),
      });
      return;
    }

    setState((previous) => {
      if (previous.key === key) {
        return previous;
      }

      return {
        key,
        value: readLocalStorageValue(key, initialValue),
      };
    });
  }, [initialValue, key]);

  useEffect(() => {
    if (!key || state.key !== key) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state.value));
    } catch (error) {
      console.warn(`Failed to save localStorage key "${key}"`, error);
    }
  }, [key, state]);

  const setValue = (nextValue) => {
    setState((previous) => ({
      key,
      value: typeof nextValue === 'function' ? nextValue(previous.value) : nextValue,
    }));
  };

  return [state.value, setValue];
}
