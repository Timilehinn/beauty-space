import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../../pages/Homepage/HomeComp/header'

const ReviewsHeader = () => {
  const [modalOpen, setModalStatus] = React.useState(false)
  const [hamBurgerOpen] = React.useState(true)
  const ModalDialog = () => {
    setModalStatus(false)
  }
  const HamBurger = () => {
    setModalStatus(true)
  }

  return <Header />
}

export default ReviewsHeader
