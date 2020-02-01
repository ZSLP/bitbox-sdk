/// <reference path="./lib/interfaces/vendors.d.ts"/>

export * from "./lib/Address"
export * from "./lib/BITBOX"
export * from "./lib/BitcoinCash"
export * from "./lib/Block"
export * from "./lib/Blockchain"
export * from "./lib/CashAccounts"
export * from "./lib/Control"
export * from "./lib/Crypto"
export * from "./lib/ECPair"
export * from "./lib/Generating"
export * from "./lib/HDNode"
export * from "./lib/Mining"
export * from "./lib/Mnemonic"
export * from "./lib/Price"
export * from "./lib/RawTransactions"
export * from "./lib/Schnorr"
export * from "./lib/Script"
export * from "./lib/Socket"
export * from "./lib/Transaction"
export * from "./lib/TransactionBuilder"
export * from "./lib/Util"

export interface CoinInfo {
  messagePrefix: string
  bip32: {
    public: number
    private: number
  }
  pubKeyHash: number
  scriptHash: number
  wif: number
  consensusBranchId: { [id: number]: number }
  coin: string
}
