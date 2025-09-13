import { Form, FormikProps } from "formik"
import { PhoneVerifyFormValuesInterface } from "@/contracts/auth"
import Input from "@/components/common/form/input"

const InnerPhoneVerify = (props : FormikProps<PhoneVerifyFormValuesInterface>) => {
    return (
        <Form className="space-y-6">
            <div>
                <Input name='code' label="کد"/>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    تایید
                </button>
            </div>
        </Form>
    )
}

export default InnerPhoneVerify;