import React, { useState, createContext } from 'react'
import Pusher from 'pusher-js';


export const SocketProvider = createContext(undefined);

function SocketProviderApi(props) {

  const pusher = new Pusher('7012e616cdc8adeba3bb', {
    cluster:'eu',
    // encrypted: true
  });

    const allValues = {
      pusher
     };
     
    return (
        <SocketProvider.Provider value={allValues}>
            {props.children}
        </SocketProvider.Provider>
    )
}

export default SocketProviderApi
