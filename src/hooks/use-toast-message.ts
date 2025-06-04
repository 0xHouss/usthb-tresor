import { FormState } from '@/lib/to-form-state';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useToastMessage(formState: FormState) {
  const prevTimestamp = useRef(formState.timestamp);
  const router = useRouter()

  const showToast =
    formState.message &&
    formState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (showToast) {
      if (formState.status === 'ERROR') {
        toast.error(formState.message);
      } else {
        toast.success(formState.message);
      }

      prevTimestamp.current = formState.timestamp;

      if (formState.redirect) router.push(formState.redirect)
    }
  }, [formState, showToast]);
};