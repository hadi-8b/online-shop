import { withFormik } from "formik";
import * as yup from "yup";
import InnerProductFilterForm from "@/components/Products/innerProductFilterForm";
import { ProductFilterValues } from "@/contracts/products";
import { fetcher } from "@/services/api/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


const productFilterValidationSchema = yup.object().shape({
  search: yup.string().required("فیلد جستجو الزامی است"),
  sort: yup.string().required("گزینه مرتب سازی مورد نیاز است"),
});



interface ProductFilterFormProps {
  router: AppRouterInstance;
}

const ProductFilterForm = withFormik<ProductFilterFormProps, ProductFilterValues>({
  // mapPropsToValues : (props) => ({
  mapPropsToValues : () => ({
        search : '',
        sort : '',
        value:'',
    }),

  validationSchema: productFilterValidationSchema,

  // handleSubmit: async (values, { props, setFieldError }) => {
  handleSubmit: async (values, {  setFieldError }) => {
    try {
      const response = await fetcher({
        url: "products/filter",
        options: {
          method: "POST",
          body: JSON.stringify(values),
        },
      });

      if (response.ok) {
        const filteredProducts = await response.json();
        console.log(filteredProducts);
      } else {
        throw new Error("فیلتر کردن محصولات انجام نشد");
      }
    } catch (error) {
      console.error(error);
      setFieldError("جستجو کنید", "هنگام فیلتر کردن محصولات خطایی روی داد");
    }
  },
})(InnerProductFilterForm);

export default ProductFilterForm;
