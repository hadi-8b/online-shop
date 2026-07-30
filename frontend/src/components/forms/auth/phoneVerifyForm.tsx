// src/components/forms/auth/phoneVerifyForm.tsx
import { withFormik } from "formik";
import * as yup from "yup";
import InnerPhoneVerify from "@/components/auth/innerPhoneVerifyForm";
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth";
import { apiClient, authApi } from "@/services/api/client";
import useAuth from "@/hooks/useAuth";
import { store } from "@/store";
import { fetchCart } from "@/store/cart/cartSlice";

const phoneVerifyFormValidationSchema = yup.object().shape({
    code: yup
        .string()
        .required("کد تایید الزامی است")
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
            await apiClient.get("/api/sanctum/csrf-cookie");

            // مهم: از authApi.verify تا X-Guest-ID برود
            const response = await authApi.verify({
                code: values.code,
                phone: values.phone,
            });

            if (response.status) {
                props.clearPhone();

                // سشن/پروفایل
                await props.userMutate();

                // سبد بعد از transfer سمت سرور
                await store.dispatch(fetchCart());

                // اگر از checkout آمده بود
                const redirect =
                    typeof window !== "undefined"
                        ? new URLSearchParams(window.location.search).get("redirect")
                        : null;

                props.router.replace(redirect || "/panel");
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