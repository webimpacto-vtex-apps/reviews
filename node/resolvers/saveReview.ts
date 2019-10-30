import { Review } from '../typings/custom'
import axios from 'axios'
import VBaseClient from '../VBaseClient'
//import getReview from './getReview'

interface Args {
    review: Review
}

export async function saveReview(_root: any, args: Args, ctx:any) {
    const URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/documents/`;

    // Formar objeto para actualizar review
    let review = {} as any;
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
    if(typeof args['review'].reviewId != "undefined"){
        review.reviewId = args['review'].reviewId;
    }
    if(typeof args['review'].id != "undefined"){
        review.id = args['review'].id;
    }

    let response = await axios({
        headers: {
             'VtexIdclientAutCookie': ctx.cookies.get('VtexIdclientAutCookie'),
             'Proxy-Authorization': ctx.vtex.authToken,
        },
        method: 'patch',
        url: URL,
        data: review
    }).then( async function () {
        // Obtener Review que se acaba de actualizar
        if(typeof args['review'].reviewId != "undefined"){
            let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=id,approved,comment,locale,name,productId,score&_where=reviewId=` + args['review'].reviewId;
        
            await axios({
                headers: {
                    'VtexIdclientAutCookie': ctx.vtex.authToken,
                    'Proxy-Authorization': ctx.vtex.authToken
                },
                method: 'GET',
                url: URL,
            }).then( async function (response) {
                // Obtener todas las reviews aprobadas del producto en cuestión.
                let reviewActualizada = response.data[0];
                let productId = reviewActualizada.productId;
                let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=reviewId,locale,score&_where=productId=` + productId + ` AND approved=true`;
                await axios({
                    headers: {
                        'VtexIdclientAutCookie': ctx.vtex.authToken,
                        'Proxy-Authorization': ctx.vtex.authToken
                    },
                    method: 'GET',
                    url: URL,
                }).then(function (response) {                    
                    // Por problemas con la caché en la API de VTEx, hay que tratar la respuesta para actualizarla con los datos que teníamos de esta review
                    if(args['review'].approved == true){
                        var reviewList = response.data;
                        reviewList.push({
                            locale: reviewActualizada.locale,
                            score: reviewActualizada.score
                        })
                    }else if(args['review'].approved == false){
                        var reviewList = response.data.map(function(responseItem:any){
                            if(responseItem.reviewId != args['review'].reviewId){
                                return responseItem;
                            }
                        })
                    }

                    // Generar información que se guardará en el fichero
                    let average = 0;
                    reviewList.length > 0 && reviewList.map(function(reviewObj:any){
                        average += reviewObj.score;
                    })
                    let json:any = {
                        cont: reviewList.length,
                        average: average/reviewList.length
                    }

                    // Guardar en un fichero el resumen del producto                    
                    const {vtex: ioContext} = ctx
                    const vBase = VBaseClient(ioContext,productId + ".txt")
                    vBase.saveFile(json)
                }).catch(function (error) {
                    console.log("ERROR: " + URL);
                    console.log(error);
                });
            }).catch(function (error) {
                console.log("ERROR: " + URL); 
                console.log(error.response);
            });
        }
        return args['review'];
    }).catch(function (error) {
        console.log("ERROR: ");
        console.log(error);
    });
    return response;
}