import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  phone: Yup.string()
    .required('شماره موبایل الزامی است')
    .matches(/^09\d{9}$/, 'شماره موبایل نامعتبر است')
});

export const verifySchema = Yup.object().shape({
  activation_code: Yup.string()
    .required('کد تایید الزامی است')
    .matches(/^\d{6}$/, 'کد تایید باید 6 رقمی باشد')
});