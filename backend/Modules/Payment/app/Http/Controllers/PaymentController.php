<?php

namespace Modules\Payment\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Shetabit\Payment\Facade\Payment;
use Shetabit\Multipay\Exceptions\InvalidPaymentException;
use Modules\Payment\Models\Payment as PaymentModel;
use Modules\Order\Models\Order;

class PaymentController extends Controller
{
    /**
     * شروع پرداخت
     */
    public function pay(Request $request)
    {
        $order = Order::where('user_id', auth()->id())->where('status', 'pending')->first();

        if (!$order) {
            return response()->json(['message' => 'No pending order found'], 404);
        }

        // ذخیره اطلاعات پرداخت در دیتابیس
        $payment = PaymentModel::create([
            'user_id' => auth()->id(),
            'order_id' => $order->id,
            'amount' => $order->total_price,
            'status' => 'pending',
        ]);

        // ارسال کاربر به درگاه پرداخت
        $paymentGateway = Payment::purchase(
            (new \Shetabit\Multipay\Invoice)->amount($order->total_price),
            function ($driver, $transactionId) use ($payment) {
                $payment->update(['transaction_id' => $transactionId]);
            }
        )->pay();

        return redirect($paymentGateway->getAction());
    }

    /**
     * بازگشت از درگاه پرداخت
     */
    public function callback(Request $request)
    {
        $payment = PaymentModel::where('transaction_id', $request->Authority)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        try {
            // بررسی صحت پرداخت
            Payment::amount($payment->amount)->transactionId($payment->transaction_id)->verify();

            // به‌روزرسانی وضعیت پرداخت
            $payment->update(['status' => 'paid']);
            $payment->order->update(['status' => 'paid']);

            return response()->json(['message' => 'Payment successful'], 200);
        } catch (InvalidPaymentException $exception) {
            // به‌روزرسانی وضعیت پرداخت در صورت خطا
            $payment->update(['status' => 'failed']);

            return response()->json(['message' => $exception->getMessage()], 400);
        }
    }
}