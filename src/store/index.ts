import { applyMiddleware, compose, createStore, Dispatch } from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'
import { RootAction } from './root-action'
import { rootEpic, rootReducer, RootState } from './root-reducer'

const epicMiddleware = createEpicMiddleware(rootEpic)

export type Dispatch = Dispatch<RootAction>
export type Epic = Epic<RootAction, RootState>
export { RootAction, RootState }

const w = window as any
const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)))
