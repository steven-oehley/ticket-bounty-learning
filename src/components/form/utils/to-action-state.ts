import { z, ZodError } from 'zod';

export type ActionState = {
  status?: 'SUCCESS' | 'ERROR';
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  payload?: FormData;
  timeStamp: number;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: '',
  fieldErrors: {},
  timeStamp: Date.now(),
};

export const toActionState = (message: string): ActionState => {
  return {
    status: 'SUCCESS',
    message,
    timeStamp: Date.now(),
  };
};

export const fromErrorToActionState = (error: unknown, formData?: FormData): ActionState => {
  if (error instanceof ZodError) {
    return {
      status: 'ERROR',
      message: '',
      fieldErrors: z.flattenError(error).fieldErrors,
      payload: formData,
      timeStamp: Date.now(),
    };
  } else if (error instanceof Error) {
    // if another error instance, return error message
    // e.g. database error
    return {
      status: 'ERROR',
      message: error.message,
      payload: formData,
      timeStamp: Date.now(),
    };
  } else {
    // if not an error instance but something else crashed
    // return generic error message
    return {
      status: 'ERROR',
      message: 'An unknown error occurred',
      payload: formData,
      timeStamp: Date.now(),
    };
  }
};
