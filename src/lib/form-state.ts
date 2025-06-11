import { ZodError } from "zod";

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

export function fromErrorToFormState(error: unknown, formData: FormData): FormState {
  if (error instanceof ZodError) {
    return toFormState('ERROR', formData, {
      fieldErrors: error.flatten().fieldErrors,
    })
  } else if (error instanceof Error) {
    return toFormState('ERROR', formData, {
      message: error.message
    });
  } else {
    return toFormState('ERROR', formData, {
      message: 'An error occured !'
    });
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