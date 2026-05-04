export type FormFields = {
  name: string;
  email: string;
  type: string;
  message: string;
};

export type SubmitStatus = "idle" | "sending" | "success" | "error";

export type State = {
  fields: FormFields;
  status: SubmitStatus;
  serverError: string;
};

export type Action =
  | { type: "SET_FIELD"; field: keyof FormFields; value: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "RESET" };

export const INITIAL_FIELDS: FormFields = { name: "", email: "", type: "", message: "" };

// ── API contract ─────────────────────────────────────────────────────────────

/** JSON body sent to POST /api/v1/contact. */
export type ContactApiRequest = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

/**
 * All possible JSON response shapes from POST /api/v1/contact.
 * - 201: success=true, message always present, submission_id optional
 * - 422: success=false, errors array present, no message
 * - 429/500: success=false, message present, no errors
 */
export type ContactApiResponse = {
  success: boolean;
  message?: string;
  submission_id?: number;
  errors?: { field: string; message: string }[];
};

export function reducer(state: State, action: Action): State {
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
