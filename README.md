# Bitrix24 Client Library

## Installation
`npm install b24 --save`

## Modes
There are 2 modes to use this library. API mode and Webhook mode.

You can specify the mode when initializing Bitrix24.

### API Mode
When you use API mode, you must authenticate the user using OAuth. See Authentication for example.
You also must provide `client_id`, `client_secret`, and `redirect_uri` in `config` block. 

#### Method Hook
There are 2 method that will called when using API mode. `saveToken(data)` and `retriveToken`. You can use this to save and get token from database.

#### Example
```JavaScript
const b24 = require('b24');

const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "api",
        host: "your bitrix host",
        client_id : "your client id",
        client_secret : "your client secret",
        redirect_uri : "http://localhost:3000/callback"
    },
    methods: {
        async saveToken(data){
            //Save token to database
        },
        async retriveToken(){
            //Retrive token from database
            return {
                access_token: "youraccesstoken",
                refresh_token: "yourrefreshtoken"
            }
        }
    }
})
```

### Webhook Mode
It use webhook feature from Bitrix24
To use this you must provide `user_id` and `code` in `config` block.

`user_id` can be obtained throught my profile page. See the URL, e.g https://k2d2.bitrix24.com/company/personal/user/4/. The value would be `4`

`code` can be obtained throught Application -> Web hooks -> ADD WEB HOOK -> Inbound web hook

#### Example
```JavaScript
const b24 = require('b24');

const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "webhook",
        host: "your bitrix host",
        user_id: "1",
        code: "your_webhook_code"
    }
})
```


## Authentication

You must do authentication when use API mode. It just OAuth2

Step:
1. Visit url provided by `bitrix24.auth.authorization_uri`
2. It will give you the `code` in callback url, use this to get token
3. Get token with `bitrix24.auth.getToken(code)`
4. Profit!!!

Example:
```JavaScript
const express = require('express');
const b24 = require('b24');

const app = express()

const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "api",
        host: "your bitrix host",
        client_id : "your client id",
        client_secret : "your client secret",
        redirect_uri : "http://localhost:3000/callback"
    },
    methods: {
        async saveToken(data){
            //Save token to database
        },
        async retriveToken(){
            //Retrive token from database
            return {
                access_token: "youraccesstoken",
                refresh_token: "yourrefreshtoken"
            }
        }
    }
})

// Bitrix auth
app.get('/auth', (req, res) => {
    res.redirect(bitrix24.auth.authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
    try{
        const code = req.query.code;
        const result = await bitrix24.auth.getToken(code);
        return res.json(result);
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Authentication Failed"});
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
```

## Run Bitrix24 API
For complete API refrence visit https://training.bitrix24.com/rest_help/index.php

To Run Bitrix24 API we need to use `callMethod(method, param)` method.

pass the method you want to run in `method` parameter, `param` parameter is optional, it used to add parameter to method that you call, visit the official API reference to see all possible parameter.

Example:
```JavaScript
const express = require('express');
const b24 = require('b24');

const app = express()

const bitrix24 = new b24.Bitrix24({
    config: {
        mode: "webhook",
        host: "your bitrix host",
        user_id: "1",
        code: "your_webhook_code"
    }
})

// Get all Bitrix24 User
app.get('/allUser', async (req, res) => {
    try{
        const result = await bitrix24.callMethod('user.get');
        return res.json(result);        
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"});
    }
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
```
