// src/components/common/form/selectbox.tsx
import { ErrorMessage, Field, FieldProps } from "formik";
import { ChangeEvent, FC } from "react";


interface SelectBoxOptionsInterface {
  label: string;
  value: string;
}

interface SelectBoxProps {
  name: string;
  label: string;
  options: SelectBoxOptionsInterface[];
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (e: ChangeEvent) => void;
}

const SelectBox: FC<SelectBoxProps> = ({
  name,
  label,
  options,
  inputClassName,
  labelClassName,
  errorClassName,
  onChange,
}) => {
  return (
    <>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 ${labelClassName ?? ""}`}
      >
        {label}
      </label>
      <Field id={name} name={name}>
        {({ field, meta }: FieldProps) => (
          <select
            {...field}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm ${inputClassName ?? ""} ${meta.error && meta.touched ? 'border-red-500' : ''}`}
            onChange={onChange || field.onChange}
          >
            {options.map((option: SelectBoxOptionsInterface, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <ErrorMessage
        name={name}
        className={`text-red-500 text-sm mt-1 ${errorClassName ?? ""}`}
        component="div"
      />
    </>
  );
};

export default SelectBox;
