import { useCallback, useId, useReducer } from "react";
import { INITIAL_FIELDS, reducer, type ContactApiRequest, type ContactApiResponse, type FormFields } from "./contactReducer";
import { API_URL } from "../../../lib/api";

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
          } satisfies ContactApiRequest),
        });

        const data: ContactApiResponse = await res.json();

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
        <div className="footer-logo">&copy; {new Date().getFullYear()} Daisy G. | All rights reserved</div>
      </footer>
    </section>
  );
}
