// src/components/common/form/input.tsx
import { ErrorMessage, Field } from "formik";
import { FC } from "react";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input: FC<InputProps> = ({
  name,
  label,
  type = "text",
  inputClassName,
  labelClassName,
  errorClassName,
}) => {
  return (
    <>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 ${labelClassName ?? ""}`}
      >
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm ${inputClassName ?? ""}`}
      />
      <ErrorMessage
        name={name}
        className={`text-red-500 text-sm mt-1 ${errorClassName ?? ""}`}
        component="div"
      />
    </>
  );
};

export default Input;
