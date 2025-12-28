import { z, ZodError } from 'zod';

export type ActionState = {
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  payload?: FormData;
};

export const fromErrorToActionState = (error: unknown, formData?: FormData): ActionState => {
  if (error instanceof ZodError) {
    return {
      message: '',
      fieldErrors: z.flattenError(error).fieldErrors,
      payload: formData,
    };
  } else if (error instanceof Error) {
    // if another error instance, return error message
    // e.g. database error
    return {
      message: error.message,
      payload: formData,
    };
  } else {
    // if not an error instance but something else crashed
    // return generic error message
    return {
      message: 'An unknown error occurred',
      payload: formData,
    };
  }
};
