import { useEffect } from 'react';

import { toast } from 'sonner';

import { type ActionState } from '../utils/to-action-state';

const useActionFeedback = (
  actionState: ActionState,
  onSuccess?: (actionState: ActionState) => void,
  onError?: (actionState: ActionState) => void
) => {
  useEffect(() => {
    if (actionState.status === 'SUCCESS') {
      if (actionState.message) {
        toast.success(actionState.message);
      }
      onSuccess?.(actionState);
    }

    if (actionState.status === 'ERROR') {
      if (actionState.message) {
        toast.error(actionState.message);
      }
      onError?.(actionState);
    }
  }, [actionState, onSuccess, onError]);
};

export default useActionFeedback;
