import HttpRequest from '@/libs/axios'
import config from '@/config'

let baseUrl = config.baseUrl

const axios = new HttpRequest(baseUrl)
export default axios
