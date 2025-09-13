// src/components/forms/auth/phoneVerifyForm.tsx
import { withFormik } from "formik";
import * as yup from "yup";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import { apiClient } from "@/services/api/client";
import useAuth from "@/hooks/useAuth";

const phoneVerifyFormValidationSchema = yup.object().shape({
    code: yup.string().required("کد تایید الزامی است")
        .matches(/^[0-9]+$/, "فقط عدد مجاز است")
        .length(6, "کد تایید باید 6 رقم باشد"),
});

interface PhoneVerifyFormProps {
    phone?: string;
    clearPhone: () => void;
    router: any;
}

const PhoneVerifyFormWithContext = (props: PhoneVerifyFormProps) => {
    const { mutate } = useAuth();
    return <PhoneVerifyFormBase {...props} userMutate={mutate} />;
};

const PhoneVerifyFormBase = withFormik<
    PhoneVerifyFormProps & { userMutate: any },
    PhoneVerifyFormValuesInterface
>({
    mapPropsToValues: (props) => ({
        code: "",
        phone: props.phone || "",
    }),
    validationSchema: phoneVerifyFormValidationSchema,

    handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
        setSubmitting(true);
        try {
            // // گرفتن csrf cookie
            // await apiClient.get("/sanctum/csrf-cookie", false);

            // ارسال verify
            const response = await apiClient.post("auth/verify", {
                code: values.code,
                phone: values.phone,
            }, false);

            if (response.success) {
                props.clearPhone();
                // پروفایل رو به‌روز کنه
                await props.userMutate();
                props.router.replace("/panel");
            } else {
                setFieldError("code", response.message || "کد تایید نامعتبر است");
            }
        } catch (error) {
            setFieldError("code", "خطا در ارتباط با سرور");
        } finally {
            setSubmitting(false);
        }
    },
})(InnerPhoneVerify);

export default PhoneVerifyFormWithContext;
