"use client";

import React, { FormEvent, useMemo, useState } from "react";
import Input from "./Input";
import axios from "axios";
import { ZodError } from "zod";
import { InscriptionCommandValidation } from "@/utils";
import styles from "./Form.module.css";
import CheckboxInput from "./CheckboxInput";

const Form = () => {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);

  const [errors, setErrors] = useState<ZodError | null>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const data = useMemo(() => {
    const data = {
      email,
      checked,
    };
    if (errors) {
      const body = InscriptionCommandValidation.safeParse(data);
      if (body.success) {
        setErrors(null);
      } else {
        setErrors(body.error);
      }
    }
    return data;
    // errors is not needed and cause an infinite refresh !
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, checked]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setErrors(null);

    const body = InscriptionCommandValidation.safeParse(data);
    console.log(body);
    if (body.success) {
      try {
        await axios.post("/api/inscription", body.data);
      } catch {
        setError(true);
      }
      setSent(true);
    } else {
      const input = document.getElementById(
        `input-${body.error.issues[0].path[0]}`
      );
      if (input) {
        input.scrollIntoView({ behavior: "smooth" });
        input.focus({ preventScroll: true });
      }
      setErrors(body.error);
    }

    setSending(false);
  };

  return sent ? (
    <div className={styles.result}>
      <div className={styles.resultTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M11.7255 2.83986L5.63692 10.8336C5.51281 10.9949 5.35341 11.1255 5.17097 11.2156C4.98852 11.3057 4.78787 11.3527 4.5844 11.3532C4.38204 11.3543 4.18208 11.3093 3.99971 11.2216C3.81735 11.1339 3.65736 11.0057 3.53189 10.847L0.281086 6.70352C0.173486 6.5653 0.0941633 6.40724 0.0476475 6.23837C0.00113161 6.0695 -0.0116664 5.89312 0.00998373 5.7193C0.0316339 5.54548 0.0873084 5.37762 0.173829 5.22532C0.260349 5.07301 0.37602 4.93924 0.514238 4.83164C0.652457 4.72404 0.810514 4.64472 0.979388 4.5982C1.14826 4.55169 1.32464 4.53889 1.49846 4.56054C1.67228 4.58219 1.84014 4.63787 1.99244 4.72439C2.14474 4.81091 2.27852 4.92658 2.38612 5.0648L4.55776 7.83597L9.59384 1.17449C9.80938 0.89181 10.1284 0.706334 10.4807 0.658862C10.833 0.611389 11.1897 0.70581 11.4724 0.921351C11.7551 1.13689 11.9405 1.4559 11.988 1.80819C12.0355 2.16049 11.9411 2.51721 11.7255 2.79989V2.83986Z"
            fill="currentcolor"
          />
        </svg>
        <span> Merci pour ton inscription !</span>
      </div>
      Surveille ta boîte e-mail pour plus d&lsquo;infos sur le programme du
      Forum 2024.
    </div>
  ) : (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errors={errors}
        disabled={sending}
        required
      />
      <CheckboxInput
        id="checked"
        checked={checked}
        setChecked={setChecked}
        label="J'accepte de recevoir des emails de la part d'ambitions transitions"
        disabled={sending}
        errors={errors}
      />
      <button disabled={sending} className={styles.button} type="submit">
        S&lsquo;inscrire
      </button>
    </form>
  );
};

export default Form;
