import { Review} from './../typings/custom'
import axios from 'axios'


interface Args {
    productId: Number,
    locale: String,
    approved: Boolean
}

export async function productReviews(_root: any, args: Args, ctx: any) {
    let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=approved,comment,locale,name,productId,score&_where=productId=` + args["productId"];
    //let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=approved,comment,locale,name,productId,score&_where=productId=` + args["productId"] + ` AND approved=`+ args["approved"];
    
    if(typeof args['locale'] != "undefined" && args['locale'] != ''){
        URL += ` AND locale=`+ args["locale"];
    }
    if(typeof args['approved'] != "undefined" && args['approved'] == true){
        URL += ` AND approved=true`;
    }else if(typeof args['approved'] != "undefined" && args['approved'] == false){
        URL += ` AND approved=false`;
    }

    let response = await axios({
        headers: {
            'VtexIdclientAutCookie': ctx.vtex.authToken,
            'Proxy-Authorization': ctx.vtex.authToken,
        },
        method: 'GET',
        url: URL,
    }).then(function (response) {
        var listado = response.data;
        
        // Filter by lang if necessary
        if(typeof args['locale'] == "undefined"){
            return listado;
        }    
        let listadoFiltradoPorLenguaje = listado.filter(function(review:Review){
            return review['locale'] == args['locale']
        })    
        return listadoFiltradoPorLenguaje;
    }).catch(function (error) {
        console.log("ERROR"); 
        console.log(error);
    });

    return response;
}