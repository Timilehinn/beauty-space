'use client'

import Image from 'next/image'
import { returnServiceImagesAsString } from '../../../utils/returnServiceImageString'

export function ServiceItemComp({ service, index, onRemove }) {
  return (
    <section
      key={index}
      className='w-full flex justify-between items-center py-2 border-b border-gray last:border-none'
    >
      <div className='flex flex-col justify-start items-start gap-1 w-[60%]'>
        <h3 className='capitalize text-base'>{service.details.name}</h3>
        <p className='font-light text-sm'>
          Price: ₦{service.details.price}/{service.details?.min_hour}hr
          {service?.min_hour > 1 ? 's' : ''}
        </p>

        {service.details.home_service_price > 0 && (
          <p className='font-light text-sm'>
            Home service: ₦{service.details.home_service_price}/
            {service.details?.min_hour}hr
            {service.details?.min_hour > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className='flex justify-start items-center gap-4'>
        {returnServiceImagesAsString(service.details.images).map((image, i) => (
          <Image
            key={i}
            src={image}
            width={60}
            height={60}
            className='h-[60px] w-[60px] rounded-md object-cover object-center'
          />
        ))}
      </div>
    </section>
  )
}
