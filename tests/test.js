require('dotenv').config();

const test = require('ava');
const nock = require('nock');
const bitrix = require('./bitrix');

function setUpMock(){
    //Refresh
    let url = 'http://' + (process.env.TEST_BITRIX_HOST || "test") + '.bitrix24.com'     
    nock(url)
        .get('/oauth/token/')
        .query({
            client_id: process.env.TEST_BITRIX_CLIENT_ID || "test_client",            
            grant_type: "refresh_token",
            client_secret: process.env.TEST_BITRIX_CLIENT_SECRET || "test_secret",            
            redirect_uri: "http://localhost:3000/callback",
            refresh_token: process.env.TEST_BITRIX_REFRESH_TOKEN || "test_refresh_token"
        })
        .reply(200, {
            access_token: "test1",
            refresh_token: "test2",
        });

    //Auth
    nock(url)
        .get('/oauth/token/')
        .query({
            client_id: process.env.TEST_BITRIX_CLIENT_ID || "test_client",
            grant_type: "authorization_code",
            client_secret: process.env.TEST_BITRIX_CLIENT_SECRET || "test_secret",
            redirect_uri: "http://localhost:3000/callback",
            code: "testcode"
        })
        .reply(200, {
            access_token: "test1",
            refresh_token: "test2",
        });
    
    //Get User list
    nock(url)
        .get('/rest/user.get')
        .query({
            auth: "test1"
        })
        .reply(200, {
            user: "user"
        })

    nock(url)
        .get("/rest/1/test_code/user.get")
        .query({})
        .reply(200, {
            user: "user"
        })
    
}


test('bitrix authentication', async t => {
    if(process.env.CI){
        setUpMock();
        let hookResult = {};
        const btx = bitrix.generateApiMode(hookResult);
        const result = await btx.auth.getToken('testcode');

        t.deepEqual(result, {
            access_token: 'test1',
            refresh_token: 'test2'
        })
        t.is(hookResult.saveTokenCalled, true)
    }else{
        t.pass();
    }
})


test('bitrix refresh token', async t => {
    if(process.env.CI){
        setUpMock();        
        let hookResult = {};
        const btx = bitrix.generateApiMode(hookResult);
        const result = await btx.auth.refreshToken(process.env.TEST_BITRIX_REFRESH_TOKEN || 'test_refresh_token');
        t.deepEqual(result, {
            access_token: 'test1',
            refresh_token: 'test2'
        })
    }else{
        t.pass();
    }
})

test('bitrix get user list', async t => {
    if(process.env.CI){
        setUpMock();        
        let hookResult = {};
        const btx = bitrix.generateApiMode(hookResult);
        const result = await btx.callMethod('user.get');
        t.deepEqual(result, {
            user: 'user'
        });
    }else{
        //Use real server
        let hookResult = {};        
        const btx = bitrix.generateApiMode(hookResult);
        const result = await btx.callMethod('user.get')
        t.is(result, '{"result":[{"ID":"1","ACTIVE":true,"EMAIL":"setyo.nugroho1337@gmail.com","NAME":"Setyo","LAST_NAME":"Nugroho","SECOND_NAME":null,"PERSONAL_GENDER":"","PERSONAL_PROFESSION":null,"PERSONAL_WWW":null,"PERSONAL_BIRTHDAY":"","PERSONAL_PHOTO":"https:\\/\\/cdn.bitrix24.com\\/b4893991\\/main\\/35e\\/35e778d96e3e55c6035e23034a54355b\\/27bd57f2bc22fc47e6548528d1df05ea.jpg","PERSONAL_ICQ":null,"PERSONAL_PHONE":null,"PERSONAL_FAX":null,"PERSONAL_MOBILE":null,"PERSONAL_PAGER":null,"PERSONAL_STREET":null,"PERSONAL_CITY":null,"PERSONAL_STATE":null,"PERSONAL_ZIP":null,"PERSONAL_COUNTRY":null,"WORK_COMPANY":null,"WORK_POSITION":null,"WORK_PHONE":null,"UF_DEPARTMENT":[1],"UF_INTERESTS":null,"UF_SKILLS":null,"UF_WEB_SITES":null,"UF_XING":null,"UF_LINKEDIN":null,"UF_FACEBOOK":null,"UF_TWITTER":null,"UF_SKYPE":null,"UF_DISTRICT":null,"UF_PHONE_INNER":null}],"total":1}');
    }
})

test('bitrix get user list webhook', async t => {
    if(process.env.CI){
        setUpMock();        
        let hookResult = {};
        const btx = bitrix.generateWebhookMode(hookResult);
        const result = await btx.callMethod('user.get');
        t.deepEqual(result, {
            user: 'user'
        });
    }else{
        //Use real server
        let hookResult = {};        
        const btx = bitrix.generateWebhookMode(hookResult);
        const result = await btx.callMethod('user.get')
        t.is(result, '{"result":[{"ID":"1","ACTIVE":true,"EMAIL":"setyo.nugroho1337@gmail.com","NAME":"Setyo","LAST_NAME":"Nugroho","SECOND_NAME":null,"PERSONAL_GENDER":"","PERSONAL_PROFESSION":null,"PERSONAL_WWW":null,"PERSONAL_BIRTHDAY":"","PERSONAL_PHOTO":"https:\\/\\/cdn.bitrix24.com\\/b4893991\\/main\\/35e\\/35e778d96e3e55c6035e23034a54355b\\/27bd57f2bc22fc47e6548528d1df05ea.jpg","PERSONAL_ICQ":null,"PERSONAL_PHONE":null,"PERSONAL_FAX":null,"PERSONAL_MOBILE":null,"PERSONAL_PAGER":null,"PERSONAL_STREET":null,"PERSONAL_CITY":null,"PERSONAL_STATE":null,"PERSONAL_ZIP":null,"PERSONAL_COUNTRY":null,"WORK_COMPANY":null,"WORK_POSITION":null,"WORK_PHONE":null,"UF_DEPARTMENT":[1],"UF_INTERESTS":null,"UF_SKILLS":null,"UF_WEB_SITES":null,"UF_XING":null,"UF_LINKEDIN":null,"UF_FACEBOOK":null,"UF_TWITTER":null,"UF_SKYPE":null,"UF_DISTRICT":null,"UF_PHONE_INNER":null}],"total":1}');
    }
})


