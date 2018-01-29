import * as request from 'request-promise';
import * as qs from 'qs';

import Config from './config';
import BitrixAuth from './auth';

export class Bitrix24{
    auth: BitrixAuth;
    /**
     * Create Bitrix Client
     * @param init Configuration Initializer
     */
    constructor(private init:Config){
        if(init.config.host.indexOf('.') == -1){
            init.config.host = `http://${init.config.host}.bitrix24.com`;
        }

        if(init.config.mode != undefined){
            if((init.config.mode != 'api') && (init.config.mode != "webhook")){
                throw Error("Mode not supported");
            }
        }else{
            init.config.mode = "api"
        }

        if(!init.config.mode || init.config.mode == "api"){
            this.auth = new BitrixAuth(init);        
        }
        
    }
    
    /**
     * Call Bitrix rest API
     * @param {string} method - Method that will be called
     * @param {Object} param - Parameter and field that will send to API
     * @return {Promise} Return as object
     */
    async callMethod(method:string, param: any = {}){
        let url:string;
        
        if(this.init.config.mode == "api"){
            //FIX ME: This implementation always refresh token before request, please fix it
            const token = await this.auth.refreshToken();
            param['auth'] = token.access_token;
            url = `${this.init.config.host}/rest/${method}?${qs.stringify(param)}`;
        }else{
            url = `${this.init.config.host}/rest/${this.init.config.user_id}/${this.init.config.code}/${method}?${qs.stringify(param)}`
        }

        const result = await request.get(url);
        return JSON.parse(result)
    }
}
