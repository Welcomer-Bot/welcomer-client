export type ActionResult<T> = {
  data: T | null;
  done: boolean;
  error: string | null;
};

export type VoidActionResult = {
  done: boolean;
  error: string | null;
};

export function actionError(message: string): ActionResult<never> {
  return { data: null, done: false, error: message };
}

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { data, done: true, error: null };
}

export function voidActionError(message: string): VoidActionResult {
  return { done: false, error: message };
}

export function voidActionSuccess(): VoidActionResult {
  return { done: true, error: null };
}
