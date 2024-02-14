import React, { ReactNode } from "react";
import styles from "./RadioCheckbox.module.css";
const Checkbox = ({
  id,
  label,
  hint,
  children,
  required,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) => {
  return (
    <div aria-labelledby={`checkbox-legend-${id}`}>
      <div className={styles.legend} id={`checkbox-legend-${id}`}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <div className={styles.inputs}>{children}</div>
    </div>
  );
};

export default Checkbox;
