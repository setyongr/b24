import * as request from 'request-promise';
import * as qs from 'querystring';

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
        this.auth = new BitrixAuth(init);
        
    }
    
    /**
     * Call Bitrix rest API
     * @param {string} method - Method that will be called
     * @param {Object} param - Parameter and field that will send to API
     * @return {Promise} Return as object
     */
    async callMethod(method:string, param: any = {}){
        //FIX ME: This implementation always refresh token before request, please fix it
        const token = await this.auth.refreshToken();
        param['auth'] = token.access_token;
        const url = `${this.init.config.host}/rest/${method}?${qs.stringify(param)}`;
        const result = await request.get(url);
        return JSON.parse(result)
    }
}
