import { BigInt, Bytes, BigDecimal, ByteArray, ethereum } from "@graphprotocol/graph-ts"
import {
  hashmasks,
  Approval,
  ApprovalForAll,
  NameChange as ChangeName,
  OwnershipTransferred,
  Transfer
} from "../generated/hashmasks/hashmasks"
import {
  nameChangeToken,
  Approval as NctApproval,
  Transfer as NctTransfer
} from "../generated/nameChangeToken/nameChangeToken"

import { NameChange, Owner, Transaction, Hashmask, NameChangeToken} from "../generated/schema"


export function handleApproval(event: Approval): void {
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity.owner = event.params.owner
  // entity.approved = event.params.approved

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.HASHMASKS_PROVENANCE(...)
  // - contract.MAX_NFT_SUPPLY(...)
  // - contract.NAME_CHANGE_PRICE(...)
  // - contract.REVEAL_TIMESTAMP(...)
  // - contract.SALE_START_TIMESTAMP(...)
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.getNFTPrice(...)
  // - contract.isApprovedForAll(...)
  // - contract.isMintedBeforeReveal(...)
  // - contract.isNameReserved(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.startingIndex(...)
  // - contract.startingIndexBlock(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.toLower(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenNameByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.totalSupply(...)
  // - contract.validateName(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}


export function handleNameChange(event: ChangeName): void {
  let namechange = NameChange.load(event.params.maskIndex.toString())
  let transaction = Transaction.load(event.block.hash.toHexString())
  let mask = Hashmask.load(event.params.maskIndex.toString())
  let contract = hashmasks.bind(event.address)
  let owner = Owner.load(event.params.maskIndex.toString())

  if(transaction == null){
    transaction = new Transaction(event.block.hash.toHexString())
  }
  if(namechange == null){
    namechange = new NameChange(event.params.maskIndex.toString())
  }
  if(owner == null){
    owner = new Owner(event.params.maskIndex.toString())
  }
  if(mask == null){
    mask = new Hashmask(event.params.maskIndex.toString())
  }
  
  // owner.balance = contract.balanceOf((contract.ownerOf((event.params.maskIndex))))

  owner.id = contract.ownerOf((event.params.maskIndex)).toHexString()

  mask.maxSupply = contract.MAX_NFT_SUPPLY()
  mask.startingindex = contract.startingIndex()
  mask.tokenName = contract.name()
  mask.hashmaskName = contract.tokenNameByIndex(event.params.maskIndex)
  mask.hashmaskSymbol = contract.symbol()
  mask.allMasks = contract.tokenByIndex(event.params.maskIndex)
  mask.transaction = transaction.id
  mask.currentOwner = owner.id
  
  namechange.mask = mask.id
  namechange.newName = event.params.newName
  namechange.transaction = transaction.id 

  transaction.date = event.block.timestamp
  transaction.gasUsed = event.block.gasUsed
  transaction.block = event.block.number

  
  namechange.save()
  transaction.save()
  mask.save()
  owner.save()

}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handleTransfer(event: Transfer): void {
}


export function handleNctTransfer(event: NctTransfer): void {
  let nct = new NameChangeToken(event.params.to.toHexString())
  let contract = nameChangeToken.bind(event.address)
  let owner = Owner.load(event.params.to.toHexString())
  let transaction = Transaction.load(event.block.hash.toHexString())

  if(transaction == null){
    transaction = new Transaction(event.block.hash.toHexString())
  }
  if(owner == null){
    owner = new Owner(event.params.to.toHexString())
  }


  nct.receiver = owner.id
  nct.sender = event.params.from
  nct.transaction = transaction.id

  transaction.date = event.block.timestamp
  transaction.gasUsed = event.block.gasUsed
  transaction.block = event.block.number

  nct.save()
  transaction.save()

}

export function handleNctApproval(event: NctApproval): void {
 
}