"use client";
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../components/authComponents/ResetPasswordComp'), { ssr: false, })

// export const metadata = {
//   title: 'BeautySpace NG | Reset Password',
//   description:
//     'Reset your BeautySpace NG password to continue exploring top beauty and wellness services in your area. Follow our easy steps to regain access to your account.',
//   keywords: [
//     'BeautySpace NG reset password',
//     'reset BeautySpace account password',
//     'forgot BeautySpace password',
//     'recover BeautySpace account',
//     'BeautySpace password assistance',
//     'change BeautySpace password',
//     'BeautySpace account recovery',
//     'BeautySpace password reset process',
//     'BeautySpace login help',
//     'BeautySpace password recovery steps',
//     'access BeautySpace account',
//     'BeautySpace password help',
//     'secure BeautySpace account',
//   ],
// }

export default function Page() {
  return <Dynamic />
}
