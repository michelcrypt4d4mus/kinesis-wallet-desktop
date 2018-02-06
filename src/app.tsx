import * as React from 'react'
import { CreateAccount, Dashboard } from './components'
import { WalletList } from './components/WalletList';
import { retrieveWallets } from './services/wallet_persistance';

export enum View {
  create,
  settings,
  dashboard
}

export interface AppState {
  view: View,
  walletList: Wallet[],
  passwordMap: PasswordMap,
  viewParams?: ViewParams,
  serverLocation: string
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number,
    password: string
  }
}

export interface ViewParams {
  walletIndex?: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName?: string
}

export class App extends React.Component<undefined, AppState> {
  constructor (props) {
    super(props)
    this.state = {view: View.create, walletList: [], serverLocation: 'https://stellar-local.abx.com', passwordMap: {}}
  }

  public componentDidMount() {
    retrieveWallets()
      .then((walletList: Wallet[]) => {
        this.setWalletList(walletList || [])
      })
  }

  public viewMap(view: View) {
    const ref = {
      [View.create]: <CreateAccount setWalletList={this.setWalletList.bind(this)} appState={this.state} changeView={this.changeView.bind(this)} />,
      [View.dashboard]: <Dashboard appState={this.state} setWalletList={this.setWalletList.bind(this)} changeView={this.changeView.bind(this)} setPassword={this.setPassword.bind(this)} />,
    }

    return ref[view]
  }

  public setWalletList (walletList: Wallet[]): void {
    this.setState({walletList})
  }

  public changeView (view: View, viewParams?: ViewParams) {
    this.setState({view, viewParams})
  }

  public setPassword (accountId: string, password: string) {
    this.setState({
      passwordMap: {
        ...this.state.passwordMap,
        [accountId]: {password: password, timestamp: Date.now()}
      }
    })
  }

  render() {
    return (
      <div className='columns' style={{height: '100%'}}>
        <div className='column is-one-quarter' style={{backgroundColor:'#2b3e50', padding: '0px'}}>
          <img src="./logo.svg" className="logo-sidebar"/>
          <WalletList appState={this.state} setWalletList={this.setWalletList.bind(this)} changeView={this.changeView.bind(this)} />
        </div>
        <div className='column' style={{padding:'0px'}}>
          { this.viewMap(this.state.view) }
        </div>
      </div>
    )
  }
}
