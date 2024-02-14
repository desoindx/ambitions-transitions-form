"use client";

import React, { FormEvent, useMemo, useState } from "react";
import Input from "./Input";
import axios from "axios";
import { ZodError } from "zod";
import { InscriptionCommandValidation } from "@/utils";
import styles from "./Form.module.css";
import CheckboxInput from "./CheckboxInput";
import Radio from "./Radio";
import RadioInput from "./RadioInput";
import Checkbox from "./Checkbox";

const Form = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [experience, setExperience] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const [errors, setErrors] = useState<ZodError | null>();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const data = useMemo(() => {
    const data = {
      email,
      checked,
      user,
      objectives,
      subjects,
      experience,
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
  }, [email, checked, user, objectives, subjects, experience]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setErrors(null);

    const body = InscriptionCommandValidation.safeParse(data);
    if (body.success) {
      try {
        await axios.post("/api/inscription", body.data);
      } catch {
        setError(true);
      }
      setSent(true);
    } else {
      const input = document.getElementById(
        `input-${body.error.issues[0].path[0]}`,
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
        label="Email :"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        errors={errors}
        disabled={sending}
        required
      />
      <div className={styles.message}>
        Si tu veux nous aider, dis-nous en un petit peu plus sur toi.
        C&lsquo;est facultatif mais ça nous aidera à affiner le programme !
      </div>
      <Radio id="user" label="Je suis :" errors={errors}>
        <RadioInput
          name="user"
          label="Etudiant·e"
          value="Etudiant·e"
          selected={user}
          setSelected={setUser}
          disabled={sending}
        />
        <RadioInput
          name="user"
          label="Salarié·e ou à mon compte"
          value="Salarié·e ou à mon compte"
          selected={user}
          setSelected={setUser}
          disabled={sending}
        />
        <RadioInput
          name="user"
          label="En reconversion professionnelle"
          value="En reconversion professionnelle"
          selected={user}
          setSelected={setUser}
          disabled={sending}
        />
        <RadioInput
          name="user"
          label="Sans activité professionnelle"
          value="Sans activité professionnelle"
          selected={user}
          setSelected={setUser}
          disabled={sending}
        />
        <RadioInput
          name="user"
          label="Autre"
          value="Autre"
          selected={user}
          setSelected={setUser}
          disabled={sending}
        />
      </Radio>
      <br />
      <Checkbox id="objectives" label="Je viens au Forum pour :">
        <CheckboxInput
          id="Trouver un métier engagé"
          checked={objectives.includes("Trouver un métier engagé")}
          setChecked={(checked) => {
            if (checked) {
              setObjectives([...objectives, "Trouver un métier engagé"]);
            } else {
              setObjectives(
                objectives.filter(
                  (objective) => objective !== "Trouver un métier engagé",
                ),
              );
            }
          }}
          label="Trouver un métier engagé"
          disabled={sending}
        />
        <CheckboxInput
          id="Chercher des pistes pour ma reconversion, mon orientation, mon engagement"
          checked={objectives.includes(
            "Chercher des pistes pour ma reconversion, mon orientation, mon engagement",
          )}
          setChecked={(checked) => {
            if (checked) {
              setObjectives([
                ...objectives,
                "Chercher des pistes pour ma reconversion, mon orientation, mon engagement",
              ]);
            } else {
              setObjectives(
                objectives.filter(
                  (objective) =>
                    objective !==
                    "Chercher des pistes pour ma reconversion, mon orientation, mon engagement",
                ),
              );
            }
          }}
          label="Chercher des pistes pour ma reconversion, mon orientation, mon engagement"
          disabled={sending}
        />
        <CheckboxInput
          id="Rencontrer l'écosystème à impact"
          checked={objectives.includes("Rencontrer l'écosystème à impact")}
          setChecked={(checked) => {
            if (checked) {
              setObjectives([
                ...objectives,
                "Rencontrer l'écosystème à impact",
              ]);
            } else {
              setObjectives(
                objectives.filter(
                  (objective) =>
                    objective !== "Rencontrer l'écosystème à impact",
                ),
              );
            }
          }}
          label="Rencontrer l'écosystème à impact"
          disabled={sending}
        />
        <CheckboxInput
          id="M'inspirer et apprendre"
          checked={objectives.includes("M'inspirer et apprendre")}
          setChecked={(checked) => {
            if (checked) {
              setObjectives([...objectives, "M'inspirer et apprendre"]);
            } else {
              setObjectives(
                objectives.filter(
                  (objective) => objective !== "M'inspirer et apprendre",
                ),
              );
            }
          }}
          label="M'inspirer et apprendre"
          disabled={sending}
        />
      </Checkbox>
      <br />
      <Checkbox id="subjects" label="Les sujets qui m'interessent :">
        <CheckboxInput
          id="Sensibilisation et transition environnementale"
          checked={subjects.includes(
            "Sensibilisation et transition environnementale",
          )}
          setChecked={(checked) => {
            if (checked) {
              setSubjects([
                ...subjects,
                "Sensibilisation et transition environnementale",
              ]);
            } else {
              setSubjects(
                subjects.filter(
                  (subject) =>
                    subject !==
                    "Sensibilisation et transition environnementale",
                ),
              );
            }
          }}
          label="Sensibilisation et transition environnementale"
          disabled={sending}
        />
        <CheckboxInput
          id="Les nouveaux imaginaires liés au travail"
          checked={subjects.includes("Engagement et solidarité")}
          setChecked={(checked) => {
            if (checked) {
              setSubjects([...subjects, "Engagement et solidarité"]);
            } else {
              setSubjects(
                subjects.filter(
                  (subject) => subject !== "Engagement et solidarité",
                ),
              );
            }
          }}
          label="Engagement et solidarité"
          disabled={sending}
        />
        <CheckboxInput
          id="Les nouveaux imaginaires liés au travail"
          checked={subjects.includes(
            "Les nouveaux imaginaires liés au travail",
          )}
          setChecked={(checked) => {
            if (checked) {
              setSubjects([
                ...subjects,
                "Les nouveaux imaginaires liés au travail",
              ]);
            } else {
              setSubjects(
                subjects.filter(
                  (subject) =>
                    subject !== "Les nouveaux imaginaires liés au travail",
                ),
              );
            }
          }}
          label="Les nouveaux imaginaires liés au travail"
          disabled={sending}
        />
      </Checkbox>
      <br />
      <Radio
        id="experience"
        label="Mon expérience professionnelle :"
        errors={errors}
      >
        <RadioInput
          name="experience"
          label="Je suis en stage, alternance, encore étudiant·e"
          value="Je suis en stage, alternance, encore étudiant·e"
          selected={experience}
          setSelected={setExperience}
          disabled={sending}
        />
        <RadioInput
          name="experience"
          label="J'ai entre 0 et 5 ans d'expérience pro"
          value="J'ai entre 0 et 5 ans d'expérience pro"
          selected={experience}
          setSelected={setExperience}
          disabled={sending}
        />
        <RadioInput
          name="experience"
          label="J'ai entre 5 et 10 ans d'expérience pro"
          value="J'ai entre 5 et 10 ans d'expérience pro"
          selected={experience}
          setSelected={setExperience}
          disabled={sending}
        />
        <RadioInput
          name="experience"
          label="J'ai plus de 10 ans d'expérience pro"
          value="J'ai plus de 10 ans d'expérience pro"
          selected={experience}
          setSelected={setExperience}
          disabled={sending}
        />
      </Radio>
      <div className={styles.accept}>
        <CheckboxInput
          id="checked"
          checked={checked}
          setChecked={setChecked}
          label="J'accepte de recevoir des emails de la part d'Ambitions Transitions"
          disabled={sending}
          errors={errors}
        />
      </div>
      <button disabled={sending} className={styles.button} type="submit">
        S&lsquo;inscrire
      </button>
    </form>
  );
};

export default Form;
