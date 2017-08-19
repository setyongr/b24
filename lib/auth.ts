import * as request from 'request-promise';
import * as qs from 'querystring';

import Config from './config';

export default class BitrixAuth{
    authorization_uri: string;
    
    /**
     * Create Bitrix Authenticator
     * @param init Configuration Initializer
     */
    constructor(private init: Config) {
        this.authorization_uri = init.config.host + "/oauth/authorize?" + qs.stringify({
            client_id: init.config.client_id,
            response_type: "code",
            redirect_uri: init.config.redirect_uri
        })
    }

    /**
     * Get token from Bitrix
     * @param {string} code - Code that coming after authorizing user
     * @return {Promise} Token result object
     */
    async getToken(code: string){
        const result = await request.get(this.init.config.host + "/oauth/token/?" + qs.stringify({
            client_id: this.init.config.client_id,
            grant_type: "authorization_code",
            client_secret: this.init.config.client_secret,
            redirect_uri: this.init.config.redirect_uri,
            code: code
        }));

        let parsed = JSON.parse(result);
        if(this.init.methods && this.init.methods.saveToken){
            await this.init.methods.saveToken(parsed);        
        }
        return parsed;
    }

    /**
     * Get new token
     * @param {string} token - Refresh token
     * @return {Promise} Token result object
     */
    async refreshToken(token?:string){
        if((!token) && (this.init.methods && this.init.methods.retriveToken)){
            let retriveToken = await this.init.methods.retriveToken();
            token = retriveToken.refresh_token;
        }else if(!token){
            throw Error("Please provide token");
        }

        const url = this.init.config.host + "/oauth/token/?" + qs.stringify({
            client_id: this.init.config.client_id,
            grant_type: "refresh_token",
            client_secret: this.init.config.client_secret,
            redirect_uri: this.init.config.redirect_uri,
            refresh_token: token
        });
        const result = await request.get(url);

        let parsed = JSON.parse(result);        
        if(this.init.methods && this.init.methods.saveToken){
            await this.init.methods.saveToken(parsed);        
        }

        return parsed;
    }
}