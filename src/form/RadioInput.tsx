import React, {
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";
import styles from "./RadioCheckboxInput.module.css";

const RadioInput = ({
  selected,
  setSelected,
  value,
  label,
  children,
  priority,
  ...inputProps
}: {
  selected: string;
  value: string;
  setSelected: Dispatch<SetStateAction<string>>;
  label: string;
  children?: ReactNode;
  priority?: "secondary";
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={styles.container}>
      <label className={styles.radioLabel}>
        <input
          {...inputProps}
          type="radio"
          value={value}
          checked={selected === value}
          className={selected ? "checked" : ""}
          onChange={(e) => {
            if (e.target.checked) {
              setSelected(value);
            }
          }}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default RadioInput;
