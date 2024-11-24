import Link from 'next/link'
import { BiError } from 'react-icons/bi'

export const metadata = {
  title: 'BeautySpace NG | Page Not Found',
  description:
    'Oops! The page you are looking for does not exist. Explore our beauty and wellness services to find what you need.',
  keywords: [
    'BeautySpace NG login',
    'manage your bookings',
    'check gift balances',
    'book spa services',
    'book massage services',
    'book makeup appointments',
    'book dental care services',
    'book haircuts',
    'beauty services login',
    'wellness services login',
    'local beauty services',
    'nearby wellness appointments',
    'exclusive beauty offers',
    'personalized beauty care',
    'appointment management',
  ],
}

export default function NotFound() {
  return (
    <main className='h-screen w-full flex flex-col justify-center items-center gap-3'>
      <BiError className='text-[8rem] text-danger' />
      <h2 className='text-4xl font-bold'>Page Not Found</h2>
      <p className='text-lightgrey'>
        Oops! Looks like you followed a bad link. If you think this is a problem
        with us, please tell us.
      </p>
      <Link href='/'>
        <div className='bg-purple h-12 px-5 rounded-md text-white flex justify-center items-center'>
          Return Home
        </div>
      </Link>
    </main>
  )
}
