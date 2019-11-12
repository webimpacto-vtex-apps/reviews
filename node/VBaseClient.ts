import { VBase } from '@vtex/api'

//const service: string = process.env.VTEX_APP_NAME
const service: string = "wimvtexlengow"
const userAgent: string = "VTEX wimvtexlengow " + process.env.VTEX_APP_VERSION

export default function VBaseClient({ account, workspace, region, authToken }: any, fileName:any) {
    const vBaseParams:any = { account, workspace, region, authToken, userAgent }
    const client = new VBase(vBaseParams)

    return {
        saveFile: (data:any) => {
            var Readable = require('stream').Readable;
            var s = new Readable()
            s._read = () => undefined
            s.push(JSON.stringify(data))
            s.push(null)

            return client.saveFile(service, fileName, s, false)
        },
        getFile: () => {
            return client.getFile(service, fileName)
        },
        deleteFile: () => {
            return client.deleteFile(service, fileName)
        }
    }
}