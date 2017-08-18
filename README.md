# Bitrix24 Client Library

## Installation
`npm install b24 --save`

## Initialization
```JavaScript
const {Bitrix24} = require('b24');

const bitrix24 = new Bitrix24({
    config: {
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

## Authentication

It just OAuth2

Step:
1. Visit url provided by `bitrix24.auth.authorization_uri`
2. It will give you the `code` in callback url, use this to get token
3. Get token with `bitrix24.auth.getToken(code)`
4. Profit!!!

Example:
```JavaScript
const express = require('express');
const {Bitrix24} = require('b24');

const app = express()
const bitrix24 = new Bitrix24({
    config: {
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
    res.redirect(bitrix24.auth.authorizationUri);
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
```

## Run Bitrix24 API
For complete API refrence visit https://training.bitrix24.com/rest_help/index.php

To Run Bitrix24 API we need to use `callMethod(method, param)` method.

pass the method you want to run in `method` parameter, `param` parameter is optional, it used to add paramter to method that you call, visit the official API reference to see all posible parameter.

Example:
```JavaScript
const express = require('express');
const {Bitrix24} = require('b24');

const app = express()
const bitrix24 = new Bitrix24({
    config: {
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
    res.redirect(bitrix24.auth.authorizationUri);
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