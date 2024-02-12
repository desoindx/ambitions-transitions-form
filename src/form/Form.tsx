"use client";

import React, { FormEvent, useState } from "react";
import Input from "./Input";
import axios from "axios";
import { ZodError } from "zod";
import { InscriptionCommandValidation } from "@/utils";
import styles from "./Form.module.css";

const Form = () => {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<ZodError | null>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setErrors(null);

    const body = InscriptionCommandValidation.safeParse({ email });
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

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errors={errors}
        required
      />
      <button className={styles.button} type="submit">
        S'inscrire
      </button>
    </form>
  );
};

export default Form;
