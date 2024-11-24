"use client";

import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Chat } from "softchatjs-react";
import { useClient } from "../../providers/clientContext";
import { GET_BUSINESSES_CUSTOMERS } from "../../api/workspaceRoutes";
import { handleResponse } from "../../api/router";
import AppModal, { ModalHeader } from "../Modals";

export default function InboxComp() {
  const cookies = new Cookies();
  const token = cookies.get("user_token");
  const { client, webToken } = useClient();
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [otherUserDetails, setOtherUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [modal, showModal] = useState(false);
  const [conversation, setConversation] = useState(null);

  // const getInitChatHandle = () => {
  //   let newConvoInitMe = window.localStorage.getItem('newConvoInitMe')
  //   const parsedNewConvoInitme = JSON.parse(newConvoInitMe)
  //   setCurrentUserDetails(parsedNewConvoInitme)
  //   window.localStorage.removeItem('newConvoInitMe')

  //   let otherUserConvoInfo = window.localStorage.getItem('otherUserConvoInfo')
  //   const parsedOtherUserInfo = JSON.parse(otherUserConvoInfo)
  //   setOtherUserDetails(parsedOtherUserInfo)
  //   window.localStorage.removeItem('otherUserConvoInfo')
  // }

  // useEffect(()=>{
  //   console.log(currentUserDetails, '--current user details')
  //   setCurrentUser({
  //     id: '2',
  //     firstName: 'Timilehin',
  //     lastName: 'Makinde',
  //     profileImgUrl: 'https://d1pzp604yjq4ak.cloudfront.net/65c560d6a5be16.73097099.jpeg',
  //     phone: '8140516424',
  //     email: 'makindetimi@gmail.com'
  //   })
  // },[currentUserDetails]);

  // useEffect(() => {
  //   getInitChatHandle()
  // }, []);

  useEffect(() => {
    if(typeof window !== "undefined"){
      const queryParams = new URLSearchParams(window.location.search);
      const conversation = queryParams.get("conversation"); 
      setConversation(conversation);
    }
  }, []);
  
  // useEffect(() => {
  //   if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/firebase-messaging-sw.js")
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   }
  // }, []);
  

  const getBusinessCustomers = async () => {
    try {
      const res = await GET_BUSINESSES_CUSTOMERS(token);
      if (res) {
        const { data, error, status } = handleResponse(res);
        if (status) {
          setCustomers(data.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserDetails = async () => {
    if (!token) {
      // alert('Not authenticated!!!')
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
          }),
        }
      );
      const data = await res.json();
      if (data?.status !== true) {
        return;
      }
      setUser({
        uid: data?.data?.id?.toString(),
        username: data?.data?.first_name,
        firstName: data?.data?.first_name,
        lastName: data?.data?.last_name,
        profileUrl: data?.data?.profile_url,
        email: data?.data?.email,
      });
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getUserDetails();
    getBusinessCustomers();
  }, []);

  const selectCustomer = (id) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          var isSelected = c?.isSelected ?? false;
          return { ...c, isSelected: !isSelected };
        }
        return c;
      })
    );
  };

  const createBroadcastList = () => {
    if(client){
      var participants = customers.filter(c => c.isSelected).map(c => ({
        uid: c.id.toString(),
        username: c?.first_name || c?.email.substring(0, 6),
        firstname: c?.first_name,
        lastname: c?.last_name,
        profileUrl: c?.profile_url,
      }))
      const newBroadcastList = client.newBroadcastList(participants);
      newBroadcastList.create(name);
      showModal(true);
    }
  }

  const isDisabled = () =>{
    return customers.filter(c => c.isSelected).length === 0
  }

  return (
    <>
      <main className="h-full w-full top-0">
        {/* {!loading && <ConversationLayout />} */}
        {!loading && user && (
          <Chat
            activeConversationId={conversation}
            headerHeightOffset={70}
            onCreateBroadcastList={createBroadcastList}
            user={user}
            webToken={webToken}
          />
        )}
      </main>
      <AppModal modal={modal} showModal={showModal}>
        <div className="w-[450px] sm:w-[90%] md:w-[450px] h-[600px] flex flex-col gap-5 bg-white rounded-xl p-6">
          <ModalHeader title="Customers" onClose={() => showModal(false)} />
          <input
            placeholder="Enter list name"
            type="text"
            name="name"
            id="name"
            className="h-12 outline-none indent-2 rounded-md w-full border border-gray"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="overflow-y-auto h-full bg-green-500 w-full">
            {customers.length === 0 && (
              <div className="h-[100%] w-[100%] flex items-center justify-center">
                <p className="text-grey-300">Your customers will appear here</p>
              </div>
            )}
            {customers.map((customer, i) => (
              <button
                onClick={() => selectCustomer(customer.id)}
                key={i}
                className={`w-full flex items-center px-4 py-2 border-b-[1px] ${
                  customers.length !== i + 1
                    ? "border-[lightgrey]"
                    : "border-[transparent]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={customer?.isSelected}
                  onChange={() => selectCustomer(customer.id)}
                  className="mr-4 h-[25px] w-[25px]"
                />
                <div className="flex flex-col w-full bg-red-500 px-2 py-1 text-left">
                  <p className="font-semibold">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="text-sm">{customer.email}</p>
                </div>
              </button>
            ))}
          </div>
          <div className='flex flex-row justify-between gap-5'>
            <button
              onClick={() => showModal(false)}
              disabled={isDisabled()}
              className={`rounded flex-1 text-white ${isDisabled()? 'bg-gray-500' : 'bg-primary'} p-3`}
            >
              CREATE
            </button>
          </div>
        </div>
      </AppModal>
    </>
  );
}
