'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from 'react-google-login'
import { useTranslation } from 'react-i18next'
import Cookies from 'universal-cookie'
import { confirmAlert } from 'react-confirm-alert'

const LoginGithub = dynamic(() => import('react-login-github'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

import CustomAlert from '../../CustomComponents/CustomAlert'
import useCookieHandler from '../../../hooks/useCookieHandler'
import PasswordChange from '../../authComponents/PasswordChange'
import DeactivatePrompt from '../../authComponents/DeactivatePrompt'
import DoubleFactorAuth from '../../authComponents/DoubleFactorAuth'
import DoubleFactorAuthPrompt from '../../authComponents/DoubleFactorAuthPrompt'

import { getAccountType, getUserInfo } from '../../../redux/admin_user'

import { refreshTokenSetup } from '../../../utils/refreshToken'

import { BiChevronRight } from 'react-icons/bi'

import './addOn.scss'

export default function LoginAndSecurity() {
  const router = useRouter()
  const { t } = useTranslation()
  const cookies = new Cookies()
  const { token } = useCookieHandler('user_token')
  const clientId = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`

  const [toUpdatePassword, setToUpdatePassword] = useState(false)
  const [disablingAccount, setDisablingAccount] = useState(false)

  const [popUp2faAuth, setPopUp2faAuth] = useState(false)

  const [alertWatcher, setAlertWatcher] = useState({
    statement: '',
    value: false,
  })

  const userData = useSelector(getUserInfo)
  const accountType = useSelector(getAccountType)

  const socialDisconnection = async (provider) => {
    if (!token) return
    confirmAlert({
      title: 'Confirm to submit',
      message: `Are you sure you want to proceed with Disconnecting your ${provider}`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              //   const token = cookies.get('user_token')

              if (!token) {
                return
              }

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${userData.id}/deactivate/social-login`,
                {
                  method: 'POST',
                  headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    provider: provider,
                  }),
                }
              )
              const data = await res.json()
              if (!data?.status) {
                toast.error('Not able to disconnect. Try again.')
                return
              }
              toast.success(provider + ' disconnected successfully')
              setTimeout(() => {
                router.refresh()
              }, 3000)
            } catch (error) {
              toast.error(
                'Not able to disconnect.Try Checking your network connection.'
              )
              return
            }
          },
        },
        {
          label: 'No',
          onClick: () => null,
        },
      ],
    })
  }

  const onSuccess = (res) => {
    socialConnectionActivate(
      'google',
      res.profileObj.googleId,
      userData?.email,
      res.profileObj?.email
    )
    refreshTokenSetup(res)
  }

  const onSuccessGit = async (response) => {
    try {
      let access_token = await getAccessToken(response?.code)
      let userId = await getUser(access_token)
      socialConnectionActivate('github', userId?.id, userData?.email)
    } catch (error) {}
  }

  const onFailureGit = (response) => {}

  const getUser = async (accessToken) => {
    try {
      const res = await fetch(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await res.json()
      if (data) {
        return {
          id: data?.id,
        }
      }
    } catch (error) {
      return null
    }
  }

  const getAccessToken = async (code) => {
    if (!code) {
      return
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/oauth/users`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            code,
          }),
        }
      )
      const data = await res.json()
      if (data.data.length) {
        let str = data.data[0]
        let mySubString = str.split(/[=&]/)
        return mySubString[1]
      }
      return null
    } catch (error) {
      return null
    }
  }

  const { signIn } = useGoogleLogin({
    onSuccess,
    // onFailure,
    clientId,
    isSignedIn: false,
    accessType: 'offline',
  })

  const socialConnectionActivate = async (provider, provider_id, email) => {
    if (!token) return
    confirmAlert({
      title: 'Confirm to submit',
      message: `Are you sure you want to proceed with connecting your ${provider}`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const token = cookies.get('user_token')

              if (!token) {
                setAlertWatcher({
                  statement: `Not authenticated!!!`,
                  value: true,
                })
                return
              }

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${userData.id}/activate/social-login`,
                {
                  method: 'POST',
                  headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    provider: provider,
                    provider_id: provider_id,
                    email: email,
                  }),
                }
              )
              const data = await res.json()
              if (!data?.status) {
                toast.error('Not able to connect. Try again.')
                return
              }
              toast.success(provider + ' connected successfully')
              setTimeout(() => {
                router.refresh()
              }, 3000)
            } catch (error) {
              toast.error(
                'Not able to disconnect.Try Checking your network connection.'
              )
              return
            }
          },
        },
        {
          label: 'No',
          onClick: () => null,
        },
      ],
    })
  }

  const initQrCode2fa = async () => {
    const token = cookies.get('user_token')
    if (!token) {
      return
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/settings`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            sms: false,
            twofa: false,
          }),
        }
      )
      const data = await res.json()
      router.refresh()

      if (data?.status !== true) {
        return
      }
      toast.success('QrCode for 2FA is deactivated successfully.')
    } catch (error) {}
  }

  return (
    <main className='flex flex-col justify-start items-start gap-10 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
      {alertWatcher?.value && (
        <CustomAlert watcher={alertWatcher} setWatcher={setAlertWatcher} />
      )}

      {popUp2faAuth && (
        <DoubleFactorAuthPrompt
          setPopUp2faAuth={setPopUp2faAuth}
          getQR_Code={initQrCode2fa}
          modalText={
            'Enter your password to proceed with authentication deactivation'
          }
        />
      )}

      {disablingAccount && (
        <DeactivatePrompt setDisablingAccount={setDisablingAccount} />
      )}

      <div className='flex flex-col gap-3 w-full'>
        <h2 className='font-medium text-lg'>{t('Login')}</h2>

        <form className='w-full flex flex-col justify-start items-start gap-5 border border-gray rounded-md p-5 '>
          <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={userData?.email}
              disabled
              className='h-12 border border-gray w-full outline-none rounded-md indent-2'
            />
          </div>

          <hr className='w-full border-gray' />

          <div className='flex justify-between items-center gap-3 w-full'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='password'>Password</label>
              <Link href='/forgetpassword'>
                <p className='text-primary text-sm underline'>
                  {t('Forgot your password?')}
                </p>
              </Link>
            </div>

            <button
              type='button'
              onClick={() => setToUpdatePassword(!toUpdatePassword)}
              className='text-primary cursor-pointer'
            >
              {toUpdatePassword ? 'Cancel' : 'Update'}
            </button>
          </div>

          <hr className='w-full border-gray' />

          {accountType !== 'Staff' && accountType !== 'Manager' && (
            <div className='flex justify-between items-center w-full'>
              <div className='flex flex-col gap-1'>
                <span className='text-purple'>De-activate account</span>
                <p className=''>
                  {t('Permanently delete your BeautySpace account.')}
                </p>
              </div>

              <button
                type='button'
                onClick={() => setDisablingAccount(!disablingAccount)}
                className='text-3xl'
              >
                <BiChevronRight />
              </button>
            </div>
          )}

          {toUpdatePassword && <PasswordChange />}
        </form>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <h2 className='text-lg font-medium'>{t('Social Account')}</h2>

        <section className='w-full flex flex-col justify-start items-start gap-5 border border-gray rounded-md p-5 '>
          <div className='flex flex-col justify-start items-start gap-3 w-full'>
            <div className='flex justify-between w-full'>
              <div className='flex flex-col gap-1'>
                <p>Github</p>
                <label htmlFor='name' className='text-sm'>
                  {t(
                    userData?.provider == 'github' ||
                      userData?.social_account?.provider == 'github'
                      ? 'Connected'
                      : 'Not Connected'
                  )}
                </label>
              </div>
              <div
                onClick={() =>
                  (userData?.provider == 'github' ||
                    userData?.social_account?.provider == 'github') &&
                  socialDisconnection('github')
                }
                className='text-primary cursor-pointer'
              >
                {userData?.provider == 'github' ||
                userData?.social_account?.provider == 'github' ? (
                  'Diconnect'
                ) : (
                  <LoginGithub
                    redirectUri={`${process.env.NEXT_PUBLIC_WEBSITE_URL_DEV}/login`}
                    clientId={`${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
                    onSuccess={onSuccessGit}
                    onFailure={onFailureGit}
                    buttonText='Connect'
                  />
                )}
              </div>
            </div>
          </div>

          <hr className='w-full border-gray' />

          <div className='flex justify-between items-start w-full'>
            <div className='flex flex-col gap-1'>
              <p>Google</p>
              <label htmlFor='name' className='text-sm'>
                {t(
                  userData?.provider == 'google' ||
                    userData?.social_account?.provider == 'google'
                    ? 'Connected'
                    : 'Not Connected'
                )}
              </label>
            </div>

            <button
              type='button'
              onClick={() =>
                userData?.provider == 'google' ||
                userData?.social_account?.provider == 'google'
                  ? socialDisconnection('google')
                  : signIn()
              }
              className='text-primary cursor-pointer'
            >
              {userData?.provider == 'google' ||
              userData?.social_account?.provider == 'google'
                ? 'Disconnect'
                : 'Connect'}
            </button>
          </div>
        </section>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <h2 className='text-lg font-medium'>
          {t('Two-Factor Authentication')}
        </h2>

        <DoubleFactorAuth />
      </div>
    </main>
  )
}
