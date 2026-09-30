import { ZodError } from "zod";
import { AppError } from "./errors";

export type FormState = {
  status: 'UNSET' | 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  formData: FormData
  redirect: string;
  reset: boolean;
  timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
  status: 'UNSET',
  message: '',
  fieldErrors: {},
  formData: new FormData(),
  redirect: '',
  reset: false,
  timestamp: Date.now(),
};

/**
 * Converts a failed action's error to a form state. `translate` maps message
 * keys to text: schema messages for field errors, AppError keys, and
 * "unexpected" for anything else, whose details stay server-side.
 */
export function fromErrorToFormState(
  error: unknown,
  formData: FormData,
  translate: (key: string) => string,
): FormState {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[] | undefined> = error.flatten().fieldErrors;
    return toFormState('ERROR', formData, {
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.map(translate)]),
      ),
    })
  } else if (error instanceof AppError) {
    return toFormState('ERROR', formData, { message: translate(error.key) });
  } else {
    return toFormState('ERROR', formData, { message: translate('unexpected') });
  }
};

export const toFormState = (
  status: FormState['status'],
  formData: FormData,
  {
    message = '',
    redirect = '',
    reset = false,
    fieldErrors = {},
  }: {
    message?: string,
    redirect?: string,
    reset?: boolean,
    fieldErrors?: FormState['fieldErrors']
  }): FormState => ({
    status,
    message,
    redirect,
    reset,
    fieldErrors,
    formData,
    timestamp: Date.now(),
  })

export const getPrevValue = (state: FormState, key: string) => state.formData.get(key) && !state.reset ? state.formData.get(key)!.toString() : ''