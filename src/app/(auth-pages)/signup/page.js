"use client";

import Head from 'next/head';
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../components/authComponents/signupComp/RegisterationSteps'), { ssr: false, })

export default function Page() {
 
  return  (
    <>
     <Head>
        <title>BeautySpace NG | Reviews</title>
        <meta
          name="description"
          content="We connect customers to beauty professionals across Nigeria"
        />
      </Head>
      <Dynamic />
    </>
  )
}
