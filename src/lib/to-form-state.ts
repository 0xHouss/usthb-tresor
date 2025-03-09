import { ZodError } from "zod";

export type FormState = {
    status: 'UNSET' | 'SUCCESS' | 'ERROR';
    message: string;
    fieldErrors: Record<string, string[] | undefined>;
    redirect: string;
    reset: boolean;
    timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
    status: 'UNSET' as const,
    message: '',
    fieldErrors: {},
    redirect: '',
    reset: false,
    timestamp: Date.now(),
};

export function fromErrorToFormState(error: unknown): FormState {
    if (error instanceof ZodError) {
        return toFormState('ERROR', {
            fieldErrors: error.flatten().fieldErrors,
        })
    } else if (error instanceof Error) {
        return toFormState('ERROR', {
            message: error.message
        });
    } else {
        return toFormState('ERROR', {
            message: 'An error occured !'
        });
    }
};

export const toFormState = (
    status: FormState['status'],
    {
        message = '',
        redirect = '',
        reset = false,
        fieldErrors = {}
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
        timestamp: Date.now(),
    })