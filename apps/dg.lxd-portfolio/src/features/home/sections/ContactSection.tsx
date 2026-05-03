/**
 * ContactSection — homepage contact form with server submission.
 *
 * State is managed via `useReducer` to keep all form + async status logic in
 * one predictable transition table instead of multiple `useState` calls.
 *
 * Submission flow:
 * 1. `SUBMIT_START` — disables all inputs and shows a sending state.
 * 2. `fetch` POSTs JSON to `${VITE_API_URL}/api/v1/contact`.
 * 3. On HTTP 2xx → `SUBMIT_SUCCESS` — clears fields, shows success banner.
 * 4. On HTTP error → `SUBMIT_ERROR` — surfaces the API's first validation
 *    error message, or a generic fallback.
 * 5. On network failure → `SUBMIT_ERROR` with a connection error message.
 *
 * The `VITE_API_URL` env var defaults to `http://localhost:8000` so the form
 * works out of the box against the local FastAPI dev server.
 */
import { useCallback, useId, useReducer } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type FormFields = {
  name: string;
  email: string;
  type: string;
  message: string;
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

type State = {
  fields: FormFields;
  status: SubmitStatus;
  serverError: string;
};

type Action =
  | { type: "SET_FIELD"; field: keyof FormFields; value: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "RESET" };

// ── Reducer ──────────────────────────────────────────────────────────────────

const INITIAL_FIELDS: FormFields = { name: "", email: "", type: "", message: "" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, fields: { ...state.fields, [action.field]: action.value } };
    case "SUBMIT_START":
      return { ...state, status: "sending", serverError: "" };
    case "SUBMIT_SUCCESS":
      return { fields: INITIAL_FIELDS, status: "success", serverError: "" };
    case "SUBMIT_ERROR":
      return { ...state, status: "error", serverError: action.message };
    case "RESET":
      return { fields: INITIAL_FIELDS, status: "idle", serverError: "" };
    default:
      return state;
  }
}

// ── Constants ────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactSection() {
  const id = useId();
  const [{ fields, status, serverError }, dispatch] = useReducer(reducer, {
    fields: INITIAL_FIELDS,
    status: "idle",
    serverError: "",
  });

  const isBusy = status === "sending";

  /** Creates a stable `onChange` handler for a given field key. */
  const setField = useCallback(
    (field: keyof FormFields) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch({ type: "SET_FIELD", field, value: e.target.value });
      },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isBusy) return;

      dispatch({ type: "SUBMIT_START" });

      try {
        const res = await fetch(`${API_URL}/api/v1/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fields.name.trim(),
            email: fields.email.trim(),
            subject: fields.type || undefined,
            message: fields.message.trim(),
          }),
        });

        const data: {
          success: boolean;
          message?: string;
          errors?: { field: string; message: string }[];
        } = await res.json();

        if (!res.ok) {
          const msg =
            data.errors?.[0]?.message ??
            data.message ??
            "Something went wrong. Please try again.";
          dispatch({ type: "SUBMIT_ERROR", message: msg });
          return;
        }

        dispatch({ type: "SUBMIT_SUCCESS" });
      } catch {
        dispatch({
          type: "SUBMIT_ERROR",
          message: "Unable to reach the server. Check your connection and try again.",
        });
      }
    },
    [fields, isBusy]
  );

  return (
    <section id="contact">
      <div className="contact-inner">
        {/* ── Left column ────────────────────────────────────── */}
        <div className="contact-left">
          <div className="s-label">Contact</div>
          <h2>
            LET&apos;S MAKE
            <br />
            SOMETHING <em>real.</em>
          </h2>
          <p>
            Whether you&apos;re a nonprofit looking for a creative partner or an interested
            recruiter&nbsp;— I&apos;d love to hear from you.
          </p>
          <div className="contact-highlights" aria-label="Focus areas">
            <span>Community campaigns</span>
            <span>Mission-driven focus</span>
            <span>Outreach strategist</span>
          </div>
        </div>

        {/* ── Right column — form ──────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
          {status === "success" && (
            <div className="contact-banner contact-banner--success" role="status">
              <strong>Message sent!</strong> I&apos;ll be in touch soon.
              <button
                type="button"
                className="contact-banner-close"
                onClick={() => dispatch({ type: "RESET" })}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {status === "error" && serverError && (
            <div className="contact-banner contact-banner--error" role="alert">
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor={`${id}-name`}>Your name</label>
            <input
              id={`${id}-name`}
              name="name"
              className="form-input"
              type="text"
              placeholder="Frida Kahlo"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              value={fields.name}
              onChange={setField("name")}
              disabled={isBusy}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${id}-email`}>Email address</label>
            <input
              id={`${id}-email`}
              name="email"
              className="form-input"
              type="email"
              placeholder="frida@lacasaazul.org"
              autoComplete="email"
              required
              maxLength={254}
              value={fields.email}
              onChange={setField("email")}
              disabled={isBusy}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${id}-type`}>I&apos;m reaching out as a</label>
            <select
              id={`${id}-type`}
              name="type"
              className="form-input"
              value={fields.type}
              onChange={setField("type")}
              disabled={isBusy}
            >
              <option value="">Select one</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Collaborator">Collaborator</option>
              <option value="Nonprofit organization">Nonprofit organization</option>
              <option value="Prospective client">Prospective client</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${id}-message`}>Message</label>
            <textarea
              id={`${id}-message`}
              name="message"
              className="form-input"
              placeholder="Tell me a bit about your project, opportunity, or interest…"
              required
              minLength={10}
              maxLength={4000}
              value={fields.message}
              onChange={setField("message")}
              disabled={isBusy}
            />
          </div>

          <button className="form-submit" type="submit" disabled={isBusy}>
            {isBusy ? "Sending…" : "Let's Work!"}
          </button>
        </form>
      </div>

      <footer className="contact-footer">
        <div className="footer-logo">&copy; 2025 Daisy G. | All rights reserved</div>
      </footer>
    </section>
  );
}
