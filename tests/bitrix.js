const {Bitrix24} = require('../dist');

function generateApiMode(hookResult){
    const bitrix = new Bitrix24({
      config: {
        host: process.env.TEST_BITRIX_HOST || "test",
        client_id : process.env.TEST_BITRIX_CLIENT_ID || "test_client",
        client_secret : process.env.TEST_BITRIX_CLIENT_SECRET || "test_secret",
        redirect_uri : "http://localhost:3000/callback"
      },
      methods: {
        async saveToken(param){
          try{
            hookResult.saveTokenCalled = true;

          }catch(err){
            console.log(err);
          }
        },
        async retriveToken(){
          try{
            hookResult.retriveTokenCalled = true;    
            return {
                access_token: process.env.TEST_BITRIX_ACCESS_TOKEN || "test_access_token",
                refresh_token: process.env.TEST_BITRIX_REFRESH_TOKEN || "test_refresh_token"
            }        
          }catch(err){
            console.log(err);
          }
        }
      }
    });
    
    return bitrix;
}


function generateWebhookMode(hookResult){
  const bitrix = new Bitrix24({
    config: {
      mode: "webhook",
      host: "test",
      user_id : "1",
      code : "test_code",
    },
  });
  
  return bitrix;
}

module.exports = {
    generateApiMode: generateApiMode,
    generateWebhookMode: generateWebhookMode
}