import React, { ReactNode } from "react";
import { ZodError } from "zod";
import styles from "./RadioCheckbox.module.css";
import useError from "./errors";

export type RadioProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  errors?: ZodError | null;
};

const Radio = ({
  id,
  label,
  hint,
  children,
  required,
  errors,
}: RadioProps & { children: ReactNode }) => {
  const error = useError(id, errors);

  return (
    <div aria-labelledby={`input-${id}`}>
      <div className={styles.legend} id={`checkbox-legend-${id}`}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <div className={styles.inputs}>{children}</div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Radio;
