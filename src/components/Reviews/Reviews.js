import React from 'react'

import ReviewsHeader from './ReviewsUI/ReviewsHeader'
import ReviewsHero from './ReviewsUI/ReviewsHero'
import ReviewsCard from './ReviewsUI/ReviewsCard'
import FooterComp from '../../pages/Homepage/HomeComp/footer'

const Reviews = () => {
  return (
    <>
      <ReviewsHeader />
      <ReviewsHero />
      <ReviewsCard />
      <FooterComp />
    </>
  )
}
export default Reviews
