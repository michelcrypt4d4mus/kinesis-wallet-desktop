import {
  accountIsLoading,
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  loadAccountTransactions,
} from '@actions'
import { RootEpic } from '@store'
import { merge, of } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, delay, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccount$: RootEpic = (action$, state$, { loadAccount }) => {
  const accountLoadRequest$ = action$.pipe(
    filter(isActionOf(accountLoadRequest)),
    map(({payload}) => payload),
  )

  const accountIsLoading$ = accountLoadRequest$.pipe(
    map(() => accountIsLoading()),
  )

  const accountLoad$ = accountLoadRequest$.pipe(
    delay(500),
    withLatestFrom(state$),
    mergeMap(
      ([publicKey, state]) => fromPromise(loadAccount(publicKey, state.connections.currentConnection))
        .pipe(
          map(accountLoadSuccess),
          catchError((err) => of(accountLoadFailure(err))),
      ),
    ),
  )

  const loadAccountTransactions$ = accountLoadRequest$.pipe(
    map((publicKey) => loadAccountTransactions(publicKey)),
  )

  return merge(accountIsLoading$, accountLoad$, loadAccountTransactions$)
}
