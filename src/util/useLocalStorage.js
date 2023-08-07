import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

function useLocalState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const localStorageValue = localStorage.getItem(key);
    return localStorageValue !== null ? parseLocalStorageValue(localStorageValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  useEffect(() => {
    const checkTokenValidity = () => {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        try {
          const decodedToken = jwt_decode(localStorageValue);
          const currentTime = Date.now() / 1000; // Convert to seconds

          if (decodedToken.exp < currentTime) {
            // Token has expired
            localStorage.removeItem(key); // Usuwa JWT z Local Storage
            setValue(""); // Ustawia wartość w hook'u na pusty ciąg znaków
            window.location.href = window.location.pathname; // Przekierowuje na aktualny adres URL
          }
        } catch (error) {
          // Token decoding error
          console.error("Invalid token specified:", error);
        }
      }
    };

    checkTokenValidity();
  }, [key, setValue]);

  return [value, setValue];
}

function parseLocalStorageValue(localStorageValue) {
  try {
    return JSON.parse(localStorageValue);
  } catch (error) {
    console.error("Error parsing localStorage value:", error);
    return null;
  }
}

export { useLocalState };
