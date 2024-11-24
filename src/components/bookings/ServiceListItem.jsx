'use client'

import React, { useState } from 'react'
import clsx from 'clsx'
import { RxMinus, RxPlus } from 'react-icons/rx'
import { FormatAmount } from '../../utils/formatAmount'

export default function ServiceListItem({
  number,
  selectedServices,
  setSelectedServices,
  service,
  isCheckout = false,
}) {
  const [serviceType, setServiceType] = useState('walk-in')

  function checkSelected(id) {
    var _ = selectedServices.find((service) => service.id === id)
    if (_) return true
    return false
  }

  const serviceTypes = [
    {
      label: 'Walk-in',
      value: 'walk-in',
    },
    {
      label: 'Home service',
      value: 'home-service',
    },
  ]

  React.useEffect(() => {
    const updatedServices = selectedServices.map((_s) => {
      if (_s.id === service.id) {
        return {
          ..._s,
          type: serviceType,
          finalPrice:
            serviceType === 'walk-in' ? _s.price : _s.home_service_price,
        }
      }
      return _s
    })
    setSelectedServices(updatedServices)
  }, [serviceType])

  function selectService(s) {
    var exists = selectedServices.find((service) => service.id === s.id)
    if (exists) {
      var filtered = selectedServices.filter((service) => service.id !== s.id)
      setSelectedServices(filtered)
    } else {
      setSelectedServices((prev) => {
        return [...prev, s]
      })
    }
  }

  function RadioListItem({ type, label, index }) {
    const isSelected = serviceType === type
    return (
      <div
        key={index}
        onClick={() => setServiceType(type)}
        className='flex justify-start items-center gap-2'
      >
        <div className='h-3 w-3 flex justify-center items-center border border-lightgrey rounded-full'>
          {isSelected && (
            <div className='rounded-full bg-primary h-2 w-2'></div>
          )}
        </div>
        <p className='text-sm'>{label}</p>
      </div>
    )
  }

  function findSelected(id) {
    var _ = selectedServices.find((service) => service.id === id)
    return _
  }

  const displayPrice = () => {
    const selected = findSelected(service.id)
    if (selected?.type === 'home-service') {
      return selected?.home_service_price
    }
    return service?.price
  }

  let price = displayPrice()

  return (
    <div
      className={clsx(
        'flex justify-between items-start w-full gap-5 border-b border-gray py-2 last:border-b-0 '
      )}
    >
      <div className='flex flex-col justify-start items-start gap-3'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-base font-semibold'>{service.name}</h3>
          <p className='font-light'>
            ₦{FormatAmount(price)}/{service.min_hour}hr
            {service.min_hour > 1 ? 's' : ''}
          </p>
        </div>

        {checkSelected(service.id) && service?.home_service_price > 0 && (
          <div className='flex flex-col justify-start items-start gap-2 w-full'>
            {serviceTypes.map((_type, i) => (
              <RadioListItem index={i} type={_type.value} label={_type.label} />
            ))}
          </div>
        )}
      </div>

      {!isCheckout ? (
        <button
          type='button'
          onClick={() => selectService(service)}
          className={clsx(
            'flex justify-center items-center gap-2 font-medium text-base shadow-2fl rounded-full h-10 px-5 ',
            checkSelected(service.id)
              ? 'bg-primary text-white'
              : 'bg-white text-black'
          )}
        >
          <RxPlus />
          Book
        </button>
      ) : (
        <button
          type='button'
          onClick={() => selectService(service)}
          className={clsx(
            'border border-gray p-[1px] rounded-sm ',
            checkSelected(service.id) ? 'bg-primary text-white' : ''
          )}
        >
          {checkSelected(service.id) ? <RxMinus /> : <RxPlus />}
        </button>
      )}
    </div>
  )
}
