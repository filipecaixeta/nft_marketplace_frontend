import * as  axios from 'axios'
import { providerConfig  } from './network'


export async function callConversionRatio() {
    try {
        let r = await axios.get(providerConfig.api+"/convertion_ratio")
        let data = r.data
        data.ratio = BigInt(data.ratio)
        data.expireTimestamp = BigInt(data.expireTimestamp)
        data.signature =  '0x'+Buffer.from(data.signature, 'base64').toString('hex')
        return data
    } catch (error) {       
        console.error(error)
    }
}

export async function callBuyWithFiat(itemIndex, rwSigner) {
    try {
        let r = await axios.post(providerConfig.api+"/buy_with_fiat", {
            item_index: itemIndex,
            to: await rwSigner.getAddress(),
        })
        return r.data
    } catch (error) {       
        console.error(error)
    }
}
