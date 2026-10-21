"use client";

import { useEffect } from "react";

/* Marca como visibles los elementos con data-reveal al entrar en pantalla. */
export default function RevealObserver() {
  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observer.unobserve(entrada.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
