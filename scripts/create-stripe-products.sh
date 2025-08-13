#!/bin/bash

echo "🚀 Stripe Test Products Oluşturuluyor..."
echo ""

# Test products oluşturmak için kullanabileceğiniz cURL komutları
# (Stripe API key'inizi kullanarak)

echo "Pro Plan Product oluşturmak için:"
echo "curl https://api.stripe.com/v1/products \\"
echo "  -u \$STRIPE_SECRET_KEY: \\"
echo "  -d name='Pro Plan' \\"
echo "  -d description='For professionals and creators'"
echo ""

echo "Pro Plan Price oluşturmak için (product_id gerekli):"
echo "curl https://api.stripe.com/v1/prices \\"
echo "  -u \$STRIPE_SECRET_KEY: \\"
echo "  -d unit_amount=999 \\"
echo "  -d currency=usd \\"
echo "  -d recurring[interval]=month \\"
echo "  -d product=PRODUCT_ID_HERE"
echo ""

echo "⚠️  Bu komutları çalıştırmadan önce STRIPE_SECRET_KEY environment variable'ınızı set edin:"
echo "export STRIPE_SECRET_KEY=sk_test_..."
