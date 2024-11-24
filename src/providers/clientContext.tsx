import React, { useState, useRef, createContext, useEffect, useContext } from "react";
import ChatClient from "softchatjs-core";
import usePushNotification from "../hooks/usePushNotification";

export type ClientContextType = {
  client: ChatClient | null
}

const ClientContext = createContext<ClientContextType & { webToken: string | null }>({
  client: null,
  webToken: ''
});

export const useClient = () => useContext<ClientContextType& { webToken: string | null }>(ClientContext)

function ClientContextApi(props: ClientContextType & { children: JSX.Element }) {

  // const { webToken } = usePushNotification();

  const { client } = props;

  return (
    <ClientContext.Provider value={{ client, webToken: "" }}>
      {props.children}
    </ClientContext.Provider>
  );
}

export default ClientContextApi;
