"use client";

import Image from "next/image";

import BgImage from "../../assets/beauty-portrait1.jpg";
// import LoginComponent from "../../components/loginComp/loginComp";
import Head from "next/head";

import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../components/loginComp/loginComp'), { ssr: false, })

export default function Page() {
  return (
    <>
      <Head>
        <title>BeautySpace NG | Reviews</title>
        <meta
          name="description"
          content="We connect customers to beauty professionals across Nigeria"
        />
      </Head>
      <main className="flex gap-5 h-screen overflow-hidden xxl:px-[10rem] xl:px-[10rem] lg:px-16 md:px-10 sm:px-5">
        <div className="xl:w-[50%] lg:h-[90%] lg:w-[50%] md:w-full sm:w-full m-auto hidden lg:block">
          <Image
            src={BgImage}
            width={500}
            height={500}
            alt="Beauty Image"
            className="rounded-xl object-cover object-top w-full h-full shadow-2fl"
          />
        </div>

        <section className="xl:w-[50%] lg:w-[50%] md:w-full sm:w-full m-auto">
          <Dynamic />
        </section>
      </main>
    </>
  );
}
