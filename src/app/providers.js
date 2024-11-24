'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../redux/store'

const store = makeStore()

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>
}
