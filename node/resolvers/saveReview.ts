import { Review } from '../typings/custom'
import axios from 'axios'


interface Args {
    review: Review
}

export async function saveReview(_root: any, args: Args, ctx:any) {
    const URL = (typeof args["review"].reviewId != 'undefined' ? `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/documents?_where=reviewId=` + args['review'].reviewId : `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/documents/`)
    let review:Review = {} as Review;
    if(args['review'].comment != '' && typeof args['review'].comment != "undefined"){
        review.comment = args['review'].comment;
    }
    if(args['review'].locale != '' && typeof args['review'].locale != "undefined"){
        review.locale = args['review'].locale;
    }
    if(args['review'].name != '' && typeof args['review'].name != "undefined"){
        review.name = args['review'].name;
    }
    if(args['review'].productId != '' && typeof args['review'].productId != "undefined"){
        review.productId = args['review'].productId;
    }
    if(args['review'].score != '' && typeof args['review'].score != "undefined"){
        review.score = args['review'].score;
    }
    if(typeof args['review'].approved != "undefined"){
        review.approved = args['review'].approved;
    }
    
    let response = await axios({
        headers: {
             'VtexIdclientAutCookie': ctx.cookies.get('VtexIdclientAutCookie'),
             'Proxy-Authorization': ctx.vtex.authToken,
        },
        method: 'patch',
        url: URL,
        data: review
    }).then(function () {
        //console.log(response.data);
        return args['review'];
        //return response.data;
    }).catch(function (error) {
        console.log("ERROR");
        console.log(error);
    });
    return response;
}