export interface Token{
    access_token:string,
    refresh_token:string
}
export default interface Config{
    config: {
        host:string,
        client_id:string,
        client_secret:string,
        redirect_uri:string
    },
    methods: {
        saveToken(data:Object):void,
        retriveToken():Promise<Token>
    }
}