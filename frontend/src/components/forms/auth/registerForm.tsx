// src/components/forms/auth/registerForm.tsx
import { withFormik } from "formik";
import * as yup from "yup";
import InnerRegisterForm from "@/components/auth/innerRegisterForm";
import { RegisterFormValuesInterface } from "@/contracts/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { apiClient } from "@/services/api/client";

const phoneRegExp = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/;

const registerFormValidationSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('نام الزامی است')
    .min(2, 'نام باید حداقل 2 کاراکتر باشد')
    .max(255, 'نام نمی‌تواند بیش از 255 کاراکتر باشد'),
  last_name: yup
    .string()
    .required('نام خانوادگی الزامی است')
    .min(2, 'نام خانوادگی باید حداقل 2 کاراکتر باشد')
    .max(255, 'نام خانوادگی نمی‌تواند بیش از 255 کاراکتر باشد'),
  phone: yup
    .string()
    .required('شماره موبایل الزامی است')
    .matches(phoneRegExp, 'فرمت شماره موبایل صحیح نیست')
});

interface RegisterFormProps {
  router: AppRouterInstance;
}

const RegisterForm = withFormik<RegisterFormProps, RegisterFormValuesInterface>({
  mapPropsToValues: () => ({
    first_name: '',
    last_name: '',
    phone: '',
  }),
  
  validationSchema: registerFormValidationSchema,
  
  handleSubmit: async (values, { props, setFieldError, setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      setStatus(null);
      
      console.log("Submitting registration form with values:", values);
      
      const response = await apiClient.post('/api/auth/register', values, false);
      
      console.log("Registration API response:", response);
      
      if (response.success) {
        setStatus({ 
          type: 'success', 
          message: 'ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...' 
        });
        
        // تأخیر برای نمایش پیام موفقیت
        setTimeout(() => {
          props.router.push('/auth/login');
        }, 2000);
        
      } else {
        // مدیریت خطاهای اعتبارسنجی از سرور
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setFieldError(field, messages[0]);
            }
          });
        } else {
          setStatus({ 
            type: 'error', 
            message: response.message || 'خطا در ثبت‌نام. لطفا دوباره تلاش کنید.' 
          });
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setStatus({ 
        type: 'error', 
        message: 'خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.' 
      });
    } finally {
      setSubmitting(false);
    }
  }
})(InnerRegisterForm);

export default RegisterForm;