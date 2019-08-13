import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { REST_URL } from "./BITBOX"

// Pull in additional libraries required to support the sweep function.
import { Address } from "./Address"
const addressLib = new Address(REST_URL)
import { ECPair } from "./ECPair"
const ecPair = new ECPair(addressLib)
import { TransactionBuilder } from "./TransactionBuilder"
import { BitcoinCash } from "./BitcoinCash"
const bitcoinCash = new BitcoinCash(addressLib)

export interface AddressDetails {
  isvalid: boolean
  address: string
  scriptPubKey: string
  ismine: boolean
  iswatchonly: boolean
  isscript: boolean
  pubkey: string
  iscompressed: boolean
  account: string
}

export class Util {
  public restURL: string
  constructor(restURL: string = REST_URL) {
    this.restURL = restURL
  }

  public async validateAddress(
    address: string | string[]
  ): Promise<AddressDetails | AddressDetails[]> {
    try {
      // Single block
      if (typeof address === "string") {
        const response: AxiosResponse = await axios.get(
          `${this.restURL}util/validateAddress/${address}`
        )
        return response.data

        // Array of blocks.
      } else if (Array.isArray(address)) {
        // Dev note: must use axios.post for unit test stubbing.
        const response: AxiosResponse = await axios.post(
          `${this.restURL}util/validateAddress`,
          {
            addresses: address
          }
        )

        return response.data
      }

      throw new Error(`Input must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  // Sweep a private key in compressed WIF format and sends funds to another
  // address.
  // Passing in optional balanceOnly flag will return just the balance without
  // actually moving the funds.
  // Or 0 if no funds are found, otherwise:
  // Returns an object containing the amount of BCH swept from address,
  // and the txid of the generated transaction that swept the funds.
  async sweep(wif: string, toAddr: string, balanceOnly: boolean) {
    try {
      // Input validation
      if (!wif || wif === "") {
        throw new Error(
          `wif private key must be included in Compressed WIF format.`
        )
      }

      // Input validation
      if (!balanceOnly) {
        if (!toAddr || toAddr === "") {
          throw new Error(
            `Address to receive swept funds must be included unless balanceOnly flag is true.`
          )
        }
      }

      // Generate a keypair from the WIF.
      const keyPair = ecPair.fromWIF(wif)

      // Generate the public address associated with the private key.
      const fromAddr = ecPair.toCashAddress(keyPair)

      // Check the BCH balance of that public address.
      const details: any = await axios.get(
        `${this.restURL}address/details/${fromAddr}`
      )
      const balance = details.data.balance

      // If balance is zero, exit.
      if(balance === 0) return balance

      // If balanceOnly flag is passed in, exit.
      if(balanceOnly) return balance

      // Get UTXOs associated with public address.
      const u: any = await axios.get(
        `${this.restURL}address/utxo/${fromAddr}`
      )
      const utxos = u.data.utxos

      // Prepare to generate a transaction to sweep funds.
      const transactionBuilder = new TransactionBuilder()
      let originalAmount = 0

      // Add all UTXOs to the transaction inputs.
      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        originalAmount = originalAmount + utxo.satoshis

        transactionBuilder.addInput(utxo.txid, utxo.vout)
      }

      if (originalAmount < 1)
        throw new Error(`Original amount is zero. No BCH to send.`)

      // get byte count to calculate fee. paying 1.1 sat/byte
      const byteCount = bitcoinCash.getByteCount(
        { P2PKH: utxos.length },
        { P2PKH: 1 }
      )
      const fee = Math.ceil(1.1 * byteCount)

      // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
      const sendAmount = originalAmount - fee

      // add output w/ address and amount to send
      transactionBuilder.addOutput(
        addressLib.toLegacyAddress(toAddr),
        sendAmount
      )

      // Loop through each input and sign it with the private key.
      let redeemScript
      for (var i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        transactionBuilder.sign(
          i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()

      // Broadcast the transaction to the BCH network.
      const response: any = await axios.get(
        `${REST_URL}rawtransactions/sendRawTransaction/${hex}`
      )

      return response.data
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}
