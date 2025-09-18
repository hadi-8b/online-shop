// src/components/forms/auth/loginForm.tsx
import { withFormik } from "formik";
import * as yup from "yup";
import InnerLoginForm from "@/components/auth/innerLoginForm";
import { LoginFormValuesInterface } from "@/contracts/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { apiClient } from "@/services/api/client";

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/;

const loginFormValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .required("شماره موبایل الزامی است")
    .matches(phoneRegExp, "فرمت شماره موبایل صحیح نیست"),
});

interface LoginFormProps {
  // setVerifyToken: (token: string) => void;
  setPhone: (phone: string) => void;
  router: AppRouterInstance;
}

const LoginForm = withFormik<LoginFormProps, LoginFormValuesInterface>({
  mapPropsToValues: () => ({
    phone: "",
  }),
  validationSchema: loginFormValidationSchema,

  handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
    try {
      setSubmitting(true);
      // گام ۱: گرفتن csrf cookie
      await apiClient.get("/api/sanctum/csrf-cookie", false);

      // گام ۲: ارسال login
      const response = await apiClient.post("/api/auth/login", values, false);

      if (response.success) {
        props.setPhone(values.phone);
        props.router.push("/auth/login/verify");
        console.log("Login response:", response);

      } else {
        setFieldError("phone", response.message || "خطا در ورود");
      }
    } catch (error) {
      setFieldError("phone", "خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  },

})(InnerLoginForm);

export default LoginForm;