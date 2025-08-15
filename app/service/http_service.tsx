import { useCookies } from 'react-cookie';

const baseUrl = "api/";

export class HttpService{


    async make_request(requestBody: any, url: string, method: string): Promise<Response>{

        const requestOptions: RequestInit = {
            method: method,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
            credentials: "include"
        };
        try{
            const res = await fetch(
                `${baseUrl}${url}`,
                requestOptions
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res
        }
        catch (err: any){
            throw err;
        }    
    }

    async make_get_request(url: string): Promise<Response>{

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
            credentials: "include"
        };
        try{
            const res = await fetch(
                `${baseUrl}${url}`,
                requestOptions
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res
        }
        catch (err: any){
            throw err;
        }    
    }
}