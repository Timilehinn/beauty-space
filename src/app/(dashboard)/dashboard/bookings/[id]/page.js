"use client";

import React from "react";

import BookingDetails from "../../../../../components/DashboardComp/BookingDetails";
import Head from "next/head";

export default function BookingDetailsPage({ params }) {
  return (
    <>
      <Head>
        <title>BeautySpace NG | Reviews</title>
        <meta
          name="description"
          content="We connect customers to beauty professionals across Nigeria"
        />
      </Head>
      <BookingDetails id={params.id} />
    </>
  );
}
