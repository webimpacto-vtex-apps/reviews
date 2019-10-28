import { Review} from './../typings/custom'
import axios from 'axios'

interface Args {
    productId: Number
    from: Number
    to: Number
    approved: Boolean
    locale: String
}

export async function adminReviews(_root: any, args: Args, ctx: any) {
    const pageItems = 10;

    let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=reviewId,approved,comment,locale,name,productId,score&_where=` ;

    // Filter by productId
    if(typeof args["productId"] == "undefined"){
        URL += 'productId<>0'        
    }else{
        URL += 'productId=' + args["productId"]
    }

    // Filter by approved
    if(typeof args["approved"] != "undefined"){
        URL += ' AND approved=' + args["approved"]
    }

    // Filter by locale
    if(typeof args["locale"] != "undefined"){
        URL += ' AND locale=' + args["locale"]
    }
    
    // Filter by range
    if(typeof args["from"] == "undefined"){
        args["from"] = 0;
    }
    if(typeof args["to"] == "undefined"){
        args["to"] = pageItems;
    }

    // Borrar esta linea
    args["to"] = 999;


    let response = await axios({
        headers: {
            'VtexIdclientAutCookie': ctx.vtex.authToken,
            'Proxy-Authorization': ctx.vtex.authToken,
            'REST-Range': 'resources=' + args["from"] + '-' + args["to"]
        },
        method: 'GET',
        url: URL,
    }).then(function (response) {
        return response.data.filter(function(review:Review){
            return review;
        })
    }).catch(function (error) {
        console.log("ERROR"); 
        console.log(error);
    });

    return response;
}