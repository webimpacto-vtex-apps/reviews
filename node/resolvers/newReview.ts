/*import { ReviewInput } from '../typings/custom'
import axios from 'axios'


interface Args {
    review: ReviewInput
}

export async function newReview(_root: any, args: Args, ctx:any) {
    const URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/documents/`
    let response = await axios({
        headers: {
             'VtexIdclientAutCookie': ctx.cookies.get('VtexIdclientAutCookie'),
             'Proxy-Authorization': ctx.vtex.authToken,
        },
        method: 'patch',
        url: URL,
        data: {
            comment : args['review'].comment,
            locale : args['review'].locale,
            name : args['review'].name,
            productId : args['review'].productId,
            score : args['review'].score,
            approved: false
        }
    }).then(function () {
        //console.log(response.data);
        return args['review'];
        //return response.data;
    }).catch(function (error) {
        console.log("ERROR");
        console.log(error);
    });
    return response;
}*/