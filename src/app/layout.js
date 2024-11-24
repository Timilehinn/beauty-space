"use client";

import { ChatProvider } from "@tryspacely/web-chat-client";
import { appWithTranslation } from "next-i18next";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import i18Config from '../../next-i18next.config'

import Loading from "./loading";
import Providers from "./providers";

import "react-toastify/dist/ReactToastify.css";
import "./sass/global.scss";

import { ChatClientProvider } from "softchatjs-react";
import ChatClient from "softchatjs-core";
import ClientContextApi from "../providers/clientContext";
import { ErrorBoundary } from 'react-error-boundary';

const beautySpace = {
  background: {
    primary: "#FFFFFF",
    secondary: "#F0F0F0",
    disabled: "#E0E0E0",
  },
  text: {
    primary: "#000000",
    secondary: "#555555",
    disabled: "#B0B0B0",
  },
  action: {
    primary: "#4F9ED0",
    secondary: "#B3D8F0",
  },
  chatBubble: {
    left: {
      bgColor: "#F0F0F0",
      messageColor: "#333333",
      messageTimeColor: "#777777",
      replyBorderColor: "#D0D0D0",
    },
    right: {
      bgColor: "#B3D8F0",
      messageColor: "#000000",
      messageTimeColor: "#777777",
      replyBorderColor: "#4F9ED0",
    },
  },
  icon: "#555555",
  divider: "#E0E0E0",
  hideDivider: false,
  input: {
    bgColor: "#FFFFFF",
    textColor: "#000000",
    emojiPickerTheme: "light",
  },
};

const client = ChatClient.getInstance({
  subId: "CqMLUCJAuzzyEif",
  projectId: "e9fb7b9a-5274-45e3-bd5c-b98c16ca0156",
});

function RootLayout({ children }) {
  let chatConfig = {
    serverUrl: process.env.NEXT_PUBLIC_CHAT_SERVER_URL,
    websocketUrl: process.env.NEXT_PUBLIC_WS_SERVER_URL,
    mapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  };

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBt0lOsqxgm4kePV4_dX3DeQQGFVK_xQac&libraries=places"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      </head>
      <body>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <Providers>
            <ClientContextApi client={client}>
              <ChatClientProvider client={client} theme={beautySpace}>
                <ChatProvider config={chatConfig}>
                  <section>{children}</section>
                </ChatProvider>
              </ChatClientProvider>
            </ClientContextApi>
          </Providers>
          <ToastContainer />
        </Suspense>
      </ErrorBoundary>

      </body>
    </html>
  );
}

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default appWithTranslation(RootLayout, i18Config);
