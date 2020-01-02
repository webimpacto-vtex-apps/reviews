import { Review} from './../typings/custom'
import axios from 'axios'

interface Args {
    productId: Number
    from: Number
    to: Number
    approved: Boolean
    notapproved: Boolean
    locale: String
}

export async function adminReviews(_root: any, args: Args, ctx: any) {
    let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/scroll?_fields=id,reviewId,approved,comment,locale,name,productId,score&_where=` ;
    
    // Filter by productId
    if(typeof args["productId"] == "undefined"){
        URL += 'productId<>0'        
    }else{
        URL += 'productId=' + args["productId"]
    }

    // Filter by approved
    if(typeof args["approved"] != "undefined" || typeof args["notapproved"] != "undefined"){
        if(typeof args["approved"] != "undefined" && args["approved"]){
            URL += ' AND approved=true'
        }else if(typeof args["notapproved"] != "undefined" && args["notapproved"]){
            URL += ' AND approved=false'
        }
    }
    
    // Filter by locale
    if(typeof args["locale"] != "undefined" && args["locale"]!=''){
        URL += ' AND locale=' + args["locale"]
    }
    
    let response = await axios({
        headers: {
            'VtexIdclientAutCookie': ctx.vtex.authToken,
            'Proxy-Authorization': ctx.vtex.authToken
        },
        method: 'GET',
        url: URL,
    }).then(function (response) {
        return response.data.filter(function(review:Review){
            return review;
        })
    }).catch(function (error) {
        console.log("-------> ERROR"); 
        console.log(error.response.data);
    });

    return response;
}