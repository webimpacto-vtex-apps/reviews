import { Review} from './../typings/custom'
import axios from 'axios'

interface Args {
    reviewId: Number
}

export async function adminReview(_root: any, args: Args, ctx: any) {
    let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=id,reviewId,approved,comment,locale,name,productId,score&_where=reviewId=` +args["reviewId"] ;
   
    let response = await axios({
        headers: {
            'VtexIdclientAutCookie': ctx.vtex.authToken,
            'Proxy-Authorization': ctx.vtex.authToken
        },
        method: 'GET',
        url: URL,
    }).then(function (response) {
        var listado = response.data;
        return listado[0] as Review;
    }).catch(function (error) {
        console.log("ERROR"); 
        console.log(error);
    });
    return response;
}