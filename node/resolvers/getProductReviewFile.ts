import VBaseClient from '../VBaseClient'
//import { ProductReviewFile} from './../typings/custom'

interface Args {
    id: String
}

export async function getProductReviewFile(_root: any, args: Args, ctx: any) {
    const {vtex: ioContext} = ctx    
    const vBase = VBaseClient(ioContext,args['id'] + '.txt')
    const response:any = await vBase.getFile().catch(function(){return {}})

    //console.log("response")
    //console.log(JSON.parse(response.data.toString()))

    if(response && response.data){
        let json  =  JSON.parse(response.data.toString())
        return json;
        /*let test = JSON.stringify(json).replace(/(?:\\[rn])+/g, '')
        console.log(typeof JSON.parse(JSON.parse(test)), JSON.parse(test))
        

        console.log("check: " + json)
        console.log('==========  json["average"] = ' +  json["average"] + '============ json.average = ' + json.average)
        let re = {"cont":2, "average": 5} as ProductReviewFile
        return re
      */  
    } else {
        return {}
    }
}