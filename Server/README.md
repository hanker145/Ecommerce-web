# Final test demo app

A demo application for the final test of FWT course.

## Get Started

- Create `/.env`:

```
PORT = 8080
DEV_MODE = development
MONGO_URL = mongodb+srv://phamvangiau2411:Vangiau2311@cluster0.obwvzjq.mongodb.net/ecommerce
JWT_SECRET = 12345abcd
BRAINTREE_MERCHANT_ID = "ym3ksvv74gcgwtdx"
BRAINTREE_PUBLIC_KEY = "y89pc82dyjg9sy6h"
BRAINTREE_PRIVATE_KEY = "453ef935fa636d98eab9a86d15b34f21"
CLOUD_NAME= "dlbfxkof2"
CLOUD_KEY= "436857447829554"
CLOUD_KEY_SECRET= "fo2ZzHOQ9li9_-L9EF36-QJ2dzQ"
CLOUD_PRESET = "final_app"

```

- The env file is already included in the link on Github

- Run `npm install`
- Run `npm install cloudinary`

## The demo web have the following features:
- Login/Logout
- Register, change password, search product.
- Card/Paypal payment.
- Upload/Delete/Update product and all of the image will be stored on Cloudinary. (only addmin account can do it)
- Filtered by price and category.
- Can login into admin account. (user: admin@1.com, password: 1234)

The demo app is running on: https://ecommercedemotest1.netlify.app/
