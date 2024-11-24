"use client";

import SurveySpaceComp from '../../../../components/Survey-space/SurveySpaceComp'

// export const metadata = {
//   title: 'BeautySpace NG | Space Review',
//   description:
//     'Read and write reviews for beauty services and spaces in your area with BeautySpace NG. Share your experiences and discover highly-rated spas, salons, and wellness centers near you.',
//   keywords: [
//     'BeautySpace NG space review',
//     'review beauty services',
//     'beauty space reviews',
//     'read reviews spas',
//     'read reviews salons',
//     'read reviews wellness centers',
//     'write reviews beauty services',
//     'customer feedback beauty services',
//     'beauty service ratings',
//     'highly-rated beauty spaces',
//     'top-reviewed beauty services',
//     'BeautySpace reviews',
//     'BeautySpace customer feedback',
//     'beauty service experiences',
//   ],
// }

export default function Page({ params }) {
  return <SurveySpaceComp transactionId={params.tranxId} />
}
