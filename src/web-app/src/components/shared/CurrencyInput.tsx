import { useState, useRef } from "react";

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * Controlled input for Brazilian Real (BRL) monetary values.
 *
 * - Stores the raw numeric string (e.g. "1234.56") in parent form state.
 * - When blurred: displays formatted BRL (e.g. "R$ 1.234,56").
 * - When focused: user types freely — only digits, comma, and dot are allowed.
 * - On blur: the typed value is parsed and normalized to 2 decimal places.
 */
export default function CurrencyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  required,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [local, setLocal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const rawValue = value || "";

  // When blurred, show the formatted value (or empty if no value).
  // When focused, show the local editing buffer.
  const displayValue = focused
    ? local
    : rawValue
      ? formatter.format(parseFloat(rawValue) || 0)
      : "";

  const handleFocus = () => {
    // Seed the local buffer with the raw value so the user can edit it.
    setLocal(rawValue);
    setFocused(true);
    // Select all text for easy replacement.
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setFocused(false);
    // Parse and normalize what the user typed.
    const cleaned = local
      .replace(/\./g, "")        // remove thousand separators
      .replace(",", ".")          // decimal comma → dot
      .replace(/[^\d.]/g, "");    // remove anything else

    const num = parseFloat(cleaned);
    const normalized = isNaN(num) ? "" : num.toFixed(2);
    onChange(normalized);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, comma, and dot while typing.
    const filtered = e.target.value.replace(/[^\d,.]/g, "");
    setLocal(filtered);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      required={required}
    />
  );
}
