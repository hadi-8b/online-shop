<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>کد تایید</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>سلام {{ $name }}</h2>
        <p>کد تایید شما:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold;">
            {{ $code }}
        </div>
        <p>این کد تا 2 دقیقه معتبر است.</p>
        <p>اگر شما درخواست این کد را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
    </div>
</body>
</html>