import { changeUnlockPasswordInput, lockWallet, unlockWalletSuccess } from '@actions'
import { RootAction } from '@store'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

interface PasswordMap {
  [publicKey: string]: {
    timestamp: Date
    privateKey: string
    password: string
  }
}

export interface PasswordsState {
  currentInput: string
  livePasswords: PasswordMap
}

export const passwords = combineReducers<PasswordsState, RootAction>({
  currentInput: (state = '', action) => {
    switch (action.type) {
      case getType(changeUnlockPasswordInput):
        return action.payload
      case getType(unlockWalletSuccess):
        return ''
      default:
        return state
    }
  },
  livePasswords: (state = {}, action) => {
    switch (action.type) {
      case getType(unlockWalletSuccess):
        return {
          ...state,
          [action.payload.publicKey]: {
            privateKey: action.payload.decryptedPrivateKey,
            password: action.payload.password,
            timestamp: new Date(),
          },
        }
      case getType(lockWallet):
        return Object.keys(state)
          .filter(key => key !== action.payload)
          .reduce((newState, key) => ({ ...newState, [key]: state[key] }), {})
      default:
        return state
    }
  },
})
