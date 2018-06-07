import { changeView, transferRequest, updateTransferForm } from '@actions'
import { Transfer  as TransferPresentation } from '@components'
import { getFeeInKinesis } from '@services/kinesis'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, connections, transfer, accounts, payees }: RootState) => {
  const activeWallet = wallets.walletList[wallets.currentlySelected]
  return {
    ...transfer.form,
    getFee: (amount: number) => getFeeInKinesis(connections.currentConnection, amount),
    isTransferring: transfer.isTransferring,
    isWalletUnlocked: !!activeWallet.decryptedPrivateKey,
    accountBalance: accounts.accountsMap[activeWallet.publicKey].balance,
    payees: payees.payees,
    activeWallet,
  }
}

const mapDispatchToProps = {
  changeView,
  transferRequest,
  updateTransferForm,
}

export type TransferProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
export const Transfer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPresentation)
