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
