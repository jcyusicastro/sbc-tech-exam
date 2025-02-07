'use client';
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store'

export function ReduxProvider({ children} : { children: React.ReactNode }) {
//   const storeRef = useRef<AppStore>()
//   if (!storeRef.current) {
//     // Create the store instance the first time this renders
//     storeRef.current = store();
//   }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}