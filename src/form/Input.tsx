import React, { InputHTMLAttributes } from "react";
import { ZodError } from "zod";
import useError from "./errors";
import styles from "./Input.module.css";

const Input = ({
  id,
  label,
  hint,
  maxWidth,
  color,
  errors,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  hint?: string;
  maxWidth?: string;
  color?: "secondary";
  errors?: ZodError | null;
}) => {
  const error = useError(id, errors);

  return (
    <div>
      {label && (
        <label className={styles.label} htmlFor={`input-${id}`}>
          {label}
          {!inputProps.required && (
            <span className={styles.notRequired}> - Facultatif</span>
          )}
          {hint && <span className={styles.hint}>{hint}</span>}
        </label>
      )}
      <input className={styles.input} {...inputProps} id={`input-${id}`} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
