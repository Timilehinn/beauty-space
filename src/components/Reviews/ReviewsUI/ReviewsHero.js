import React from 'react'
import { useTranslation } from 'next-i18next'


const ReviewsHero = () => {
const { t } = useTranslation()
  return (
    <div className="flex flex-col overflow-hidden xl:px-24 md:px-20 sm:px-0 lg:mt-28 sm:mt-10 w-full">
      <h1 className="text-[#434144] xl:text-left md:text-center sm:text-center text-3xl pb-10 font-semibold">{t("What our workspace users are saying")}</h1>

      <div className="flex xl:flex-row sm:flex-col md:flex-col  items-center pb-10">
        <div className="flex space-x-7 items-center lg:text-left sm:pb-5 md:pb-5 lg:pb-5">
          <div className="flex items-center space-x-1">
            <h2 className="text-2xl">2000</h2>
            <div className="text-2xl">{t("Reviews")}</div>
          </div>
          <div className="flex xl:flex-row items-center space-x-1">
            <p className="">{t("Sort")}</p>
            <p className="">{t("by:")}</p>
            <button className="flex  space-x-2 py-3 px-7 bg-[#FCFCFC] hover:bg-indigo-800 rounded">
              <p className="">{t("Date")}</p>
              <div><i className="fas fa-chevron-down"></i></div>
            </button>
          </div>
        </div>
        <div
          className="pop flex justify-center md:flex-wrap sm:flex-wrap w-full xl:flex-nowrap lg:flex-wrap relative z-30">
          <div className=""><i
            className="fas fa-search  absolute xl:left-3 xl:pl-0 xl:bottom-5 lg:top-6 md:top-5 md:left-0 lg:left-3 sm:top-5 lg:pl-0 sm:pl-3 md:pl-0 text-[#AAAAAA] icon"></i>
            <input
              className=" h-14 xl:w-[30rem] lg:w-[54rem] md:w-[40rem] sm:w-[25rem]  border border-[#D4D4D4]  pl-10"
              maxLength='60' type="text"
              placeholder="Search by Location"/></div>
          <div className=""><i
            className="fas fa-search absolute right-50 pl-4 bottom-5 z-30 text-[#AAAAAA] "></i> <input
            className="h-14  border border-[#D4D4D4] lg:w-[54rem] xl:w-[30rem] md:w-[40rem] sm:w-[25rem]  pl-10"
            maxLength="60" type="text"
            placeholder="Search by Workspace Name"/></div>
        </div>
      </div>
    </div>


  )
}
export default ReviewsHero;