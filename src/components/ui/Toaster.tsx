"use client";

import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT } from "./toast";
import styles from "./Toaster.module.css";

/** One shared, polite status region for short messages. */
export function Toaster() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    function onToast(event: Event) {
      const text = (event as CustomEvent<string>).detail;
      window.clearTimeout(timer.current);
      setVisible(false);
      setMessage("");
      window.requestAnimationFrame(() => {
        setMessage(text);
        setVisible(true);
        timer.current = window.setTimeout(() => setVisible(false), 3200);
      });
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
