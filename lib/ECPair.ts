import * as bcl from "bitcoincashjs-lib"
import { Address } from "./Address"

const Bitcoin = require("bitcoincashjs-lib")

export class ECPair {
  private _address: Address
  constructor(address: Address = new Address()) {
    this._address = address
  }

  public fromWIF(privateKeyWIF: string): bcl.ECPair {
    let network: string = "mainnet"
    if (privateKeyWIF[0] === "L" || privateKeyWIF[0] === "K")
      network = "mainnet"
    else if (privateKeyWIF[0] === "c") network = "testnet"

    let bitcoincash: any
    if (network === "mainnet") bitcoincash = Bitcoin.networks.zclassic
    else bitcoincash = Bitcoin.networks.zclassicTest

    return Bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoincash)
  }

  public toWIF(ecpair: bcl.ECPair): string {
    return ecpair.toWIF()
  }

  public sign(
    ecpair: bcl.ECPair,
    buffer: Buffer,
    signatureAlgorithm?: number
  ): bcl.ECSignature {
    return ecpair.sign(buffer, signatureAlgorithm)
  }

  public verify(
    ecpair: bcl.ECPair,
    buffer: Buffer,
    signature: bcl.ECSignature
  ): boolean {
    return ecpair.verify(buffer, signature)
  }

  public fromPublicKey(pubkeyBuffer: Buffer): bcl.ECPair {
    return Bitcoin.ECPair.fromPublicKeyBuffer(pubkeyBuffer)
  }

  public toPublicKey(ecpair: bcl.ECPair): Buffer {
    return ecpair.getPublicKeyBuffer()
  }

  public toLegacyAddress(ecpair: bcl.ECPair): string {
    return ecpair.getAddress()
  }

  public toCashAddress(ecpair: bcl.ECPair, regtest: boolean = false): string {
    return this._address.toCashAddress(ecpair.getAddress(), true, regtest)
  }
}
