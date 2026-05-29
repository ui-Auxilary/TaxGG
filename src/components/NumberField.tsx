interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  step?: string;
  onChange: (value: string) => void;
}

export function NumberField({ id, label, value, step, onChange }: NumberFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        placeholder="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
