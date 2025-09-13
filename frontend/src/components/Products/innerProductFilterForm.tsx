// src/components/Products/innerProductFilterForm.tsx
import { Form, FormikProps } from "formik";
import Input from "@/components/common/form/input";
import { ProductFilterValues } from "@/contracts/products";
import SelectBox from "@/components/common/form/selectbox";

const InnerProductFilterForm = (props: FormikProps<ProductFilterValues>) => {
  return (
    <Form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* انتخاب مرتب سازی */}
      <div className="w-full sm:w-auto">
        <SelectBox
          name="sort"
          label="مرتب سازی بر اساس"
          options={[
            { label: "پیش‌ فرض", value: "default" },
            { label: "قیمت: کم به زیاد", value: "price-low" },
            { label: "قیمت: زیاد به کم", value: "price-high" },
            { label: "امتیاز", value: "rating" },
          ]}
          inputClassName="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>

      {/* فیلد جستجو */}
      <div className="w-full sm:w-auto">
        <Input
          name="search"
          label="جستجوی مدل ها"
          inputClassName="w-full sm:w-64"
        />
      </div>

      {/* دکمه ارسال */}
      <div className="flex flex-col items-start w-full sm:w-auto pt-6 lg:pr-6">
        <button
          type="submit"
          className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-2 px-6 rounded transition"
        >
          اعمال فیلترها
        </button>
      </div>
    </Form>
  );
};

export default InnerProductFilterForm;
