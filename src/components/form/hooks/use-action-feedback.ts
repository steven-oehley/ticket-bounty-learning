import { useEffect } from 'react';

import { type ActionState } from '../utils/to-action-state';

export type OnArgs = {
  actionState: ActionState;
};

export type UseActionFeedbackOptions = {
  onSuccess?: (args: OnArgs) => void;
  onError?: (args: OnArgs) => void;
};

const useActionFeedback = (actionState: ActionState, options: UseActionFeedbackOptions) => {
  useEffect(() => {
    if (actionState.status === 'SUCCESS') {
      options.onSuccess?.({ actionState });
    }

    if (actionState.status === 'ERROR') {
      options.onError?.({ actionState });
    }
  }, [actionState, options]);
};

export default useActionFeedback;
