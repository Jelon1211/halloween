"use client";

import { useEffect } from "react";
import styles from "./FallingSkulls.module.css";

const FallingSkulls = () => {
  useEffect(() => {
    const createSkull = () => {
      const skull = document.createElement("div");
      skull.classList.add(styles.skull);

      // Ustawienie losowej pozycji startowej (lewo/prawo)
      skull.style.left = `${Math.random() * 100}vw`;

      // Ustawienie losowej prędkości spadania
      skull.style.animationDuration = `${Math.random() * 6 + 4}s`;

      // Dodanie czaszki do dokumentu
      document.body.appendChild(skull);

      // Usunięcie czaszki po zakończeniu animacji (5 sekund)
      setTimeout(() => {
        skull.remove();
      }, 9000);
    };

    const interval = setInterval(createSkull, 2000); // Nowa czaszka co 1500ms

    return () => clearInterval(interval); // Sprzątanie po odmontowaniu komponentu
  }, []);

  return null; // Komponent nie renderuje żadnych elementów
};

export default FallingSkulls;
