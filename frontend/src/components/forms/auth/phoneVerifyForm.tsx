import { withFormik } from "formik";
import * as yup from "yup";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import { apiClient } from "@/services/api/client";

const schema = yup.object().shape({
  code: yup.string().required("کد تایید الزامی است").matches(/^[0-9]+$/, "فقط عدد مجاز است").length(6, "کد تایید باید 6 رقم باشد"),
});

interface PhoneVerifyFormProps {
  phone?: string;
  clearPhone: () => void;
  router: any;
}

const PhoneVerifyForm = withFormik<
  PhoneVerifyFormProps,
  PhoneVerifyFormValuesInterface
>({
  mapPropsToValues: (props) => ({
    code: "",
    phone: props.phone || "",
  }),
  validationSchema: schema,

  handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await apiClient.post("auth/verify", {
        code: values.code,
        phone: values.phone,
      }, false);

      if (!response.success) {
        setFieldError("code", response.message || "کد تایید نامعتبر است");
        setSubmitting(false);
        return;
      }

      props.clearPhone();
      // هیچ فراخوانی دیگری نکن؛ اجازه بده مرورگر کوکی را ست کند
      props.router.replace("/panel");

    } catch {
      setFieldError("code", "خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  },
})(InnerPhoneVerify);

export default PhoneVerifyForm;
