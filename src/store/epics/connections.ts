import {
  loadConnections,
  loadConnectionsFailure,
  loadConnectionsSuccess,
} from '@actions'
import { generalFailureAlert } from '@helpers/alert'
import { fetchConnections } from '@services/connections'
import { OurEpic } from '@store'
import { of } from 'rxjs/observable/of'
import {
  catchError,
  filter,
  ignoreElements,
  map,
  switchMap,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadConnections$: OurEpic = (action$) => {
  const loadConnectionsRequest$ = action$.pipe(
    filter(
      isActionOf(loadConnections),
    ),
  )

  return loadConnectionsRequest$.pipe(
    switchMap(fetchConnections),
    map(loadConnectionsSuccess),
    catchError((err) => of(loadConnectionsFailure(err))),
  )
}

export const loadConnectionsFailure$: OurEpic = (action$) => {
  return action$.pipe(
    filter(isActionOf(loadConnectionsFailure)),
    map(() => generalFailureAlert('Unable to load Networks.')),
    ignoreElements(),
  )
}
