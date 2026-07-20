"use client";

import { Input } from "@heroui/input";

type EmbedTextInputProps = {
  /** Visible label prefix (the character counter is appended automatically). */
  label: string;
  /** Accessible name. Defaults to `label` when omitted. */
  ariaLabel?: string;
  /** Subject used in the "must not exceed" validation message. Defaults to `label`. */
  errorSubject?: string;
  value: string;
  onValueChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  className?: string;
};

// ponytail: shared presentational wrapper for the embed's plain-text Inputs
// (label with a live character counter + a max-length `validate`). It only
// renders HeroUI's Input from the `value`/`onValueChange` it is given -
// reading the embed's current value and writing it back (including any
// field-specific side effect) stays in each caller, so this component never
// needs to know the shape of the embed or which store action to call.
export function EmbedTextInput({
  label,
  ariaLabel,
  errorSubject,
  value,
  onValueChange,
  maxLength,
  placeholder,
  className,
}: EmbedTextInputProps) {
  const subject = errorSubject ?? label;

  return (
    <Input
      type="text"
      label={`${label} ( ${value.length}/${maxLength} )`}
      aria-label={ariaLabel ?? label}
      validate={(v) => {
        if (v.length > maxLength)
          return `${subject} must not exceed ${maxLength} characters!`;
      }}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
