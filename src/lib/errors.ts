import type messages from "../../messages/fr.json";

/** Key of a user-facing error message, under `errors` in the message catalogues. */
export type ErrorKey = keyof typeof messages.errors;

/**
 * An expected failure whose message is safe to show the user. Carries a
 * catalogue key rather than text, so it can be translated to the caller's locale.
 */
export class AppError extends Error {
  constructor(public readonly key: ErrorKey) {
    super(key);
    this.name = "AppError";
  }
}
