import 'regenerator-runtime'
import axios from 'axios'
import { randomBytes, createHmac } from 'crypto'
import { stringify } from 'querystring'

const BASE = 'https://api2.nicehash.com'
const createNonce = () => randomBytes(16).toString('base64')
const createSignature = (input, secret) => {
  const signature = createHmac('sha256', secret)
  for (const index in input) {
    if (+index) {
      signature.update(Buffer.from([0]))
    }
    if (input[index] !== null) {
      signature.update(Buffer.from(input[index]))
    }
  }
  return signature.digest('hex')
}
const createServerTime = async (endpoint) => {
  try {
    const { data } = await axios.get(`${endpoint}/api/v2/time`)
    return data.serverTime
  } catch (err) {
    console.error(err)
    return Date.now()
  }
}

const createApiCall = ({ key, secret, organizationId, endpoint, getTime = createServerTime }) => async (
  method,
  path,
  request = { query: null, body: null },
) => {
  const nonce = createNonce()
  const timestamp = await getTime(endpoint)
  const input = [
    key,
    timestamp.toString(),
    nonce,
    null,
    organizationId,
    null,
    method.toUpperCase(),
    path,
    (request && request.query) ? stringify(request.query).toString() : '',
  ]
  if (request?.body) {
    input.push(JSON.stringify(request.body))
  }

  const headers = {
    'X-Time': timestamp,
    'X-Nonce': nonce,
    'X-Organization-Id': organizationId,
    'X-Auth': `${key}:${createSignature(input, secret)}`,
    'X-Request-Id': nonce,
    'X-User-Agent': 'MiniQ',
    'X-User-Lang': 'zh'
  }

  const response = await axios.request({
    url: `${endpoint}${path}`,
    method,
    params: request?.query,
    data: request?.body,
    headers
  })

  return response.data
}

export default options => {
  const endpoint = (options && options.httpBase) || BASE
  const apiRequest = createApiCall({ ...options, endpoint })
  return {
    accounting: {
      account2: (query) => apiRequest('GET', '/main/api/v2/accounting/accounts2', { query }),
      account2Currency: (currency) => apiRequest('GET', `/main/api/v2/accounting/account2/${currency}`)
    },
    hashpower: {
      myOrders: (query) => apiRequest('GET', '/main/api/v2/hashpower/myOrders', { query }),
      order: (id) => apiRequest('GET', `/main/api/v2/hashpower/order/${id}`),
      createOrder: (body) => apiRequest('POST', '/main/api/v2/hashpower/order', { body }),
      cancelOrder: (id) => apiRequest('DELETE', `/main/api/v2/hashpower/order/${id}`),
      refillOrder: (id, body) => apiRequest('POST', `/main/api/v2/hashpower/order/${id}/refill`, { body }),
      orderBook: (query) => apiRequest('GET', '/main/api/v2/hashpower/orderBook', { query }),
      updatePriceAndLimit: (id, body) => apiRequest('POST', `/main/api/v2/hashpower/order/${id}/updatePriceAndLimit`, { body })
    },
    mining: {
      algorithms: () => apiRequest('GET', '/main/api/v2/mining/algorithms')
    },
    exchange: {
      createOrder: (query) => apiRequest('POST', '/exchange/api/v2/order', { query }),
      myOrders: (query) => apiRequest('GET', '/exchange/api/v2/info/myOrders', { query }),
      cancelAllOrders: (query) => apiRequest('DELETE', '/exchange/api/v2/info/cancelAllOrders', { query })
    },
    pools: (query) => apiRequest('GET', '/main/api/v2/pools', { query })
  }
}