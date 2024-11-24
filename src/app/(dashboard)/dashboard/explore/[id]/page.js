"use client";

import React from 'react'
import ExploreDetailsComp from '../../../../../components/DashboardComp/Explore/ExploreDetailsComp'

// export async function generateMetadata({ params }) {
//   const id = params.id

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`
//   ).then((res) => res.json())

//   // Parse the HTML description (assuming it's in the format '<p>Welcome to bobtech</p>')
//   const htmlDescription = res?.data?.description || '' // Replace with the actual description

//   return {
//     title: `${res?.data?.name} | Get access to the best and affordable ${
//       res?.category?.name + 's'
//     }`,
//     description: htmlDescription.slice(0, 300) || 'No description available',
//   }
// }

export default function page({ params }) {
  return <ExploreDetailsComp id={params.id} />
}
