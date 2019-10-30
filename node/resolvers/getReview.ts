import { Review} from '../typings/custom'
import axios from 'axios'

interface Args {
    id: String
}

export async function getReview(_root: any, args: Args, ctx: any) {
    let URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/RE/search?_fields=id,approved,comment,locale,name,productId,score&_where=id=` + args["id"] ;

    let response = await axios({
        headers: {
            'VtexIdclientAutCookie': ctx.vtex.authToken,
            'Proxy-Authorization': ctx.vtex.authToken
        },
        method: 'GET',
        url: URL,
    }).then(function (response) {
        var listado = response.data;
        
        // Filter by lang if necessary
        /*if(typeof args['locale'] == "undefined"){
            return listado;
        }    
        let listadoFiltradoPorLenguaje = listado.filter(function(review:Review){
            return review['locale'] == args['locale']
        })*/
        //return listadoFiltradoPorLenguaje;
        return listado.filter(function(review:Review){
            return review;
        });
    }).catch(function (error) {
        console.log("ERROR"); 
        console.log(error);
    });

    return response;
}