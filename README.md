# OrderManager Docs

Welcome to the **OrderManager** documentation. This documentation allows users to understand our API endpoints and responses.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Counters](#counters)
  - [Items](#items)
  - [Orders](#orders)
  - [Pix](#pix)
- [Errors](#errors)
- [Contributors](#contributors)

---

## Getting Started

Simply run the project using ``npm install`` to install all the dependencies, and ``npm run dev`` to run.

## Authentication

To use the API, you will need to authenticate with <a href="https://github.com/nextauthjs/next-auth" target="_blank">Next Auth Credentials</a> submitting the login form on the root page (``/``) with the already set ``user`` and ``password`` fields in the MongoDB's ``users`` collection. For testing, use the following credentials to login as an administrator:

```json
{
  "name": "dyeizon",
  "password": "123"
}
```

You will then receive a **NextAuth Token** that will be kept stored on your cookies under the name of ``session``, the application will use this token to access the API routes. This access depends on the ``privilegeLevel`` of the user like 1, 2 or 3, being the latter one considered an administrator.

## API Endpoints

### Users

```POST /api/users/```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Creates an user given a name, password and a privilege level. The password is automatically encrypted with <a href="https://github.com/dcodeIO/bcrypt.js" target="_blank">bcryptjs</a> salt and hash.

**Request Body Example**

 ```json
{
  "name": "username",
  "password": "password",
  "privilegeLevel": 2,
}
```

**Response Body Example**

 ```json
 "data" : {
    "name": "username",
    "password": "salted-and-hashed-password",
    "privilegeLevel": 2,
  }
```

---

### Counters

```GET /api/counters/```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">No privilege required</p>

Retrieves the next number of a counter stored on the database, each time this route is called, it triggers a function that adds 1 to the counter, so the next request to it will retrieve the next number of the sequence. This route is exclusively to handle the ``code`` attribute of an Order, considering that it can not repeat, and needs to be an easy number so the customer can keep record.

**Response Body Example**

 ```json
{
  "nextSequence": 47
}
```

---

### Items

```GET /api/items```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 1</p>

Retrieves a list of all the items.

**Response Body Example**

 ```json
 {
   "data" : [
    {
      "_id": "673a24bcd3b4a9b2ed294637",
      "name": "Hambúrguer",
      "category": "Lanche",
      "price": 12.99,
      "image": "base64-image",
      "imageType": "image/png",
    },

    {
      "_id": "673a277cd3b4a9b2ed29466f",
      "name": "Milk Shake",
      "category": "Bebida",
      "price": 8.59,
      "image": "base64-image",
      "imageType": "image/png",
    },
   ]
 }
```

---

```POST /api/items```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Creates a new item, given the request body information.

**Request Body Example**

 ```json
{
  "_id": "673a24bcd3b4a9b2ed294637",
  "name": "Hambúrguer",
  "category": "Lanche",
  "price": 12.99,
  "image": "base64-image",
  "imageType": "image/png",
}
```

**Response Body Example**

 ```json
{
  "data": {
    "_id": "673a24bcd3b4a9b2ed294637",
    "name": "Hambúrguer",
    "category": "Lanche",
    "price": 12.99,
    "image": "base64-image",
    "imageType": "image/png",
  }  
}
```
---

```PUT /api/items?id=itemId```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Given an ``id`` query parameter and a body with the changes to commit, updates and returns the updated item as a response.

**Request Body Example**

 ```json
  {
    "price": 10.50,
  }
```

---

```DELETE /api/items?id=itemId```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Given an ``id`` query parameter, deletes and returns the deleted item as a response.

---

### Orders

```GET /api/orders?status=2,3,4&telao=false```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 2</p>

Retrieves a list of all the orders. This route can be called with some optional query parameters to define which ``status``es you want, given a list of numbers separated by comma, and a boolean ``telao`` that defines whether the request is for the large screen or not, if it is, it returns only the codes of the orders, sorted by the update time.

**Response Body Example**

 ```json
{
  "data": [
    {
      "_id": "6743c2e4e8d9e36aa386ff33",
      "code": 47,
      "status": 3,
      "total": 57.48,
      "cart": {
        "673a24bcd3b4a9b2ed294637": {
          "item": {
            "name": "Hambúrguer",
            "price": 12.99,
            "_id": "673a24bcd3b4a9b2ed294637"
          },
          "quantity": 2,
          "_id": "6743c2e4e8d9e36aa386ff34"
        },

        "6743c2d2e8d9e36aa386ff2b": {
          "item": {
            "name": "Milk Shake",
            "price": 10.50,
            "_id": "6743c2d2e8d9e36aa386ff2b"
          },
          "quantity": 3,
          "_id": "6743c2e4e8d9e36aa386ff36"
        }
      },
      "createdAt": "2024-11-25T00:20:52.407Z",
      "updatedAt": "2024-11-25T00:21:04.792Z",
      "mercadoPagoId": "94002133671",
      "qrCode64": "base64-qrcode",
      "qrCodeLink": "url"
    }    
  ]
}
```

---

```POST /api/orders```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Create an order given the request body information. If succeed, returns the created order.

**Request Body Example**

 ```json
{
  "code": 47,
  "status": 3,
  "total": 64.95,
  "cart": {
    "673a24bcd3b4a9b2ed294637": {
      "item": {
        "name": "Hambúrguer",
        "price": 12.99,
        "_id": "673a24bcd3b4a9b2ed294637"
      },
      "quantity": 5,
      "_id": "6743c2e4e8d9e36aa386ff34"
    },
  },
}    
```

---

```PUT /api/orders?id=orderId```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 1</p>

Given an ``id`` query parameter and a body with the changes to commit, updates and returns the updated order as a response.

**Request Body Example**

 ```json
{
  "status": 4
} 
```

---

```DELETE /api/orders?id=orderId```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">Minimum privilege = 3</p>

Given an ``id`` query parameter, deletes and returns the deleted order as a response.

---

### Pix

```POST /api/pix```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">No privilege required</p>

Creates a <a href="https://github.com/mercadopago/sdk-nodejs" target="_blank">MercadoPago</a> Pix Payment based on the order information and returns a **PaymentResponse** object.

**Request Body Example**

 ```json
{
  "total": 91.90,
  "code": 49
}   
```

---

```DELETE /api/pix?id=mercadoPagoId```

<p style="display: inline-block; padding: 5px 10px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 12px;">No privilege required</p>

Given an ``id`` query parameter, cancels a pending payment and returns a **PaymentResponse** object.

---

## Errors
``401 Unauthorized``: Unauthorized request, check if your session is active.<br>
``403 Forbidden``: Insufficient privilege level.

## Contributors

[![Contributors](https://contrib.rocks/image?repo=Dyeizon/OrderManager)](https://github.com/Dyeizon/OrderManager/graphs/contributors)