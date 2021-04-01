declare module 'node-nicehash' {

  export type AlgorithmType =
    'SHA256' |
    'DAGGERHASHIMOTO'

  export type OrderStatusType =
    'PENDING' |
    'ACTIVE' |
    'PENDING_CANCELLATION' |
    'CANCELLED' |
    'DEAD' |
    'EXPIRED' |
    'ERROR' |
    'ERROR_ON_CREATION' |
    'ERROR_ON_CREATION_ON_REVERTING_TRANSACTIONS' |
    'COMPLETED' |
    'ERROR_MISSING'

  export enum MarketType {
    EU = 'EU',
    EU_N = 'EU_N',
    USA = 'USA',
    USA_E = 'USA_E',
  }

  export type OrderType =
    'STANDARD' |
    'FIXED'

  interface Pagination {
    size: number
    page: number
    totalPageCount: number
  }

  interface Account2Currency {
    active: boolean
    currency: string
    totalBalance: string
    available: string
    pending: string
    btcRate: number
  }

  export interface Account2 {
    total: {
      available: string
      pending: string
      totalBalance: string
      pendingDetails: {
        deposit: string
        withdrawal: string
        exchange: string
        hashpowerOrders: string
        unpaidMining: string
      }
    }
    currencies: Account2Currency[]
  }

  export interface Pool {
    id: string
    name: string
    algorithm: string
    stratumHostname: string
    stratumPort: number
    username: string
    password: string
    status: string
    updatedTs: string
    inMoratorium: boolean
  }

  export interface MyOrder {
    id: string
    availableAmount: number
    payedAmount: number
    endTs: string
    updatedTs: string
    estimateDurationInSeconds: number
    type: {
      code: OrderType
      description: string
    }
    market: MarketType
    algorithm: {
      algorithm: string
      title: string
      enabled: boolean
      order: number
    }
    status: {
      code: OrderStatusType
      description: string
    }
    liquidation: string
    meta: any
    price: string
    limit: number
    amount: number
    displayMarketFactor: string
    marketFactor: number
    alive: boolean
    startTs: string
    pool: Pool
    acceptedCurrentSpeed: number
    rigsCount: number
    organizationId: string
    creatorUserId: string
  }

  export interface HashpowerOrder {
    id: string
    type: string
    price: string
    limit: string
    rigsCount: number
    acceptedSpeed: string
    payingSpeed: string
    alive: boolean
    market?: MarketType
  }

  export interface HashpowerMarket {
    updatedTs: string
    totalSpeed: number
    marketFactor: number
    displayMarketFactor: string
    orders: HashpowerOrder[]
    pagination: Pagination
  }

  export interface MyOrders {
    list: MyOrder[]
  }

  export type HashpowerMarkets = {
    [key in keyof typeof MarketType]: HashpowerMarket
  }

  export interface OrderBook {
    stats: HashpowerMarkets
  }

  export interface Algorithm {
    algorithm: string
    title: string
    enabled: boolean
    order: number
    displayMiningFactor: string
    miningFactor: number
    displayMarketFactor: string
    marketFactor: number
    minimalOrderAmount: number
    minSpeedLimit: number
    maxSpeedLimit: number
    priceDownStep: number
    minimalPoolDifficulty: number
    port: number
    color: string
    ordersEnabled: boolean
  }

  export interface MyExchangeOrders {
    market: string
    orderId: string
    price: number
    origQty: number
    origSndQty: number
    executedQty: number
    executedSndQty: number
    type: string
    side: string
    submitTime: number
    lastResponseTime: number
    state: string
  }

  export interface Pools {
    list: Pool[]
    pagination: Pagination
  }

  export interface Nicehash {
    accounting: {
      account2 (options?: { extendedResponse?: boolean, fiat?: string }): Promise<Account2>
      account2Currency (currency: string): Promise<Account2Currency>
    },
    hashpower: {
      myOrders (options: { algorithm?: string, status?: OrderStatusType, active?: boolean, market?: MarketType, ts: number, op: string, limit: number }): Promise<MyOrders>
      order (id: string): Promise<MyOrder>
      createOrder (options: { market: string, algorithm: string, amount: number, displayMarketFactor: string, marketFactor: number, price: number, poolId: string, limit: number, type: string }): Promise<any>
      cancelOrder (id: string): Promise<any>
      refillOrder (id: string, options?: { amount?: number }): Promise<any>
      orderBook (options: { algorithm: string, size?: number, page?: number }): Promise<OrderBook>
      updatePriceAndLimit (id: string, options?: { price?: number, limit?: number, displayMarketFactor?: string, marketFactor?: number }): Promise<any>
    },
    mining: {
      algorithms (): Promise<Algorithm[]>
    },
    exchange: {
      createOrder (options: { market: string, side: string, type: string, quantity: number, price: number, minSecQuantity?: number, secQuantity?: number, minQuantity?: number }): Promise<any>
      myOrders (options: { market: string, orderState?: string, orderStatus?: string, sortDirection?: string, limit?: number, timestamp?: number }): Promise<MyExchangeOrders[]>
      cancelAllOrders (options?: { market?: string, side?: string }): Promise<any>
    },
    pools (options?: { algorithm?: string, page?: number, size?: number }): Promise<Pools>,
  }

  export interface NicehashClientOptions {
    key?: string
    secret?: string
    organizationId?: string
  }

  export default function (options?: NicehashClientOptions): Nicehash
}
