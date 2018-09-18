import { initialiseWallet, unlockWalletNew, updateAccountName } from '@actions'
import { createStorage } from '@services/storage'
import { RootAction } from '@store'
import { BaseAccount, PersistedAccount, WalletAccount, WalletLoggedInState } from '@types'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getType } from 'typesafe-actions'

interface WalletPersistedState {
  encryptedPassphrase: string
  activeAccount: number
  createdAccounts: PersistedAccount[]
  walletName: string
}

interface WalletState extends WalletLoggedInState {
  persisted: WalletPersistedState
}

function accountNameStateChange<T extends BaseAccount>(state: any[], {existingName, newName}: {existingName: string, newName: string}): T[] {
  const existingAccount = state.find(a => a.name === existingName)
  const remainingAccounts = state.filter(a => a.name !== existingName)
  const newAccount = {
    ...existingAccount,
    name: newName
  }
  return [...remainingAccounts, newAccount]
}

const persisted = combineReducers<WalletPersistedState, RootAction>({
  activeAccount: (state = 0, action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return 0
      default:
        return state
    }
  },
  createdAccounts: (state = [], action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return [action.payload.createdAccount]
      case getType(updateAccountName):
        return accountNameStateChange<PersistedAccount>(state, action.payload)
      default:
        return state
    }
  },
  encryptedPassphrase: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.encryptedPassphrase : state,
  walletName: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.walletName : state,
})

export const wallet = combineReducers<WalletState, RootAction>({
  accounts: (state = [], action) => {
    switch (action.type) {
      case getType(unlockWalletNew):
        return action.payload.accounts
      case getType(updateAccountName):
        return accountNameStateChange<WalletAccount>(state, action.payload)
      default:
        return state
    }
  },
  passphrase: (state = '', action) => {
    switch (action.type) {
      case getType(unlockWalletNew):
        return action.payload.passphrase
      default:
        return state
    }
  },
  persisted: persistReducer({ key: 'secure', storage: createStorage() }, persisted),
})
