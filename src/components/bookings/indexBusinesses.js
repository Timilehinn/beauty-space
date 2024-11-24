'use client'

import React, { useState } from 'react'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    zIndex: 1000,
    transform: 'translate(-50%, -50%)',
  },
}

const TOKEN =
  'pk.eyJ1IjoiaWFmb2xheWFuIiwiYSI6ImNsMTBwcGVxajIwc3UzYmtibWppMnRxZTAifQ.7YH7BoXUrg3R8T-NcRX3SA'

const categories = [
  {
    label: 'Spas',
    value: 'spa',
  },
  {
    label: 'Beauty studio',
    value: 'beauty studio',
  },
  {
    label: 'Saloon',
    value: 'saloon',
  },
  {
    label: 'Hair stylist',
    value: 'saloon',
  },
  {
    label: 'Barber shop',
    value: 'saloon',
  },
  {
    label: 'Massage',
    value: 'spa',
  },
]

let MAP_ZOOM = 12

export default function IndexBusinessComp() {
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [services, setServices] = useState([])
  const [maxPrice, setMaxPrice] = useState([50, 99999])
  const [modal, showModal] = useState(false)
  const [category, setCategory] = useState({ label: '', value: '' })
  const [address, setAddress] = useState('')
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: MAP_ZOOM,
  })
  const [popupInfo, setPopupInfo] = useState(null)
  const [openBottomSheet, setOpenBottomSheet] = useState(true)
  const [rangeBottomSheet, showRangeBottomSheet] = useState(false)
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  )

  return (
    <main className=''>
      <h1 className=''>Hello</h1>
    </main>
  )
}
