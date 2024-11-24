import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { BsXLg } from 'react-icons/bs'
import Image from 'next/image'

import { IoPhonePortraitOutline } from 'react-icons/io5'

import AddSmsAuth from './AddSmsAuth'
import CustomAlert from '../CustomComponents/CustomAlert'
import DoubleFactorAuthPrompt from './DoubleFactorAuthPrompt'
import InitVerifyCodePhoneNumber from './VerifyCodePhoneNumber'

import { getUserInfo } from '../../redux/admin_user'
import { CgClose } from 'react-icons/cg'

const DoubleFactorAuth = () => {
  const router = useRouter()
  const ref = useRef(null)
  const { t } = useTranslation()

  const cookies = new Cookies()

  const [qrCode, setQrCode] = useState(null)
  const [popUpSms, setPopUpSms] = useState(null)
  const [accessable, setAccessable] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const [popUp2faAuth, setPopUp2faAuth] = useState(null)
  const [mobile_number, setMobile_number] = useState(null)
  const [popUpVerifyPhoneNumber, setPopUpVerifyPhoneNumber] = useState(null)
  const [alertWatcher, setAlertWatcher] = useState({
    statement: '',
    value: false,
  })

  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [validatePasswordModal, setValidateModalPassword] = useState(false)
  const [deactivateQrModal, setDeactivateQrModal] = useState(false)

  const userData = useSelector(getUserInfo)

  const initSms2fa = async () => {
    const token = cookies.get('user_token')
    if (!token) {
      alert('Not authenticated!!!')
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
            sms: true,
            twofa: false,
          }),
        }
      )

      const data = await res.json()

      if (data?.status !== true) {
        setAlertWatcher({
          statement: data?.errors?.message,
          value: true,
        })
        return
      }
      toast.success('Sms for 2FA is set up successfully.')
    } catch (error) {}
  }

  const initQrCode2fa = async (enable) => {
    const token = cookies.get('user_token')
    if (!token) {
      alert('Not authenticated!!!')
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
            twofa: enable,
          }),
        }
      )
      const data = await res.json()

      if (data?.status === true) {
        if (enable) {
          toast.success('QrCode for 2FA is set up successfully.')
        } else {
          toast.success('QrCode for 2FA is disabled successfully.')
        }
        router.refresh()
      } else {
        setAlertWatcher({
          statement: data?.errors?.message,
          value: true,
        })
        toast.error(data?.errors?.message)
        return
      }
    } catch (error) {}
  }

  const handleAddClick = async () => {
    setPopUp2faAuth(true)
  }

  const handleDeactivateTwofa = async () => {
    setDeactivateQrModal(true)
  }

  useEffect(() => {
    isValidated && initSms2fa()
  }, [isValidated])

  const getQR_Code = async () => {
    const token = cookies.get('user_token')
    if (!token) {
      alert('Not authenticated!!!')
      return
    }
    setLoading(true)
    setModalOpen(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${userData?.id}/activate-2fa`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
          }),
        }
      )
      const data = await res.json()

      if (data?.status === true) {
        setQrCode(data?.data?.qr)
        setAccessable(true)
        setPopUp2faAuth(false)
        setLoading(false)
      } else {
        return
      }
    } catch (e) {
      toast.error('There was an error generating code.')
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (popUp2faAuth && ref.current && !ref.current.contains(e.target)) {
        setPopUp2faAuth(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [popUp2faAuth])

  return (
    <>
      {alertWatcher?.value && (
        <CustomAlert watcher={alertWatcher} setWatcher={setAlertWatcher} />
      )}

      {popUp2faAuth && (
        <DoubleFactorAuthPrompt
          setPopUp2faAuth={setPopUp2faAuth}
          popUp2faAuth={popUp2faAuth}
          // initQrCode2fa={initQrCode2fa}
          getQR_Code={getQR_Code}
        />
      )}

      {validatePasswordModal && (
        <DoubleFactorAuthPrompt
          setPopUp2faAuth={setValidateModalPassword}
          handleAddClick={handleDeactivateTwofa}
          popUp2faAuth={validatePasswordModal}
        />
      )}

      {popUpSms && (
        <AddSmsAuth
          id={id}
          setPopUpSms={setPopUpSms}
          setPopUpVerifyPhoneNumber={setPopUpVerifyPhoneNumber}
          email={userData?.email}
          setMobile_number={setMobile_number}
        />
      )}

      {!isValidated && popUpVerifyPhoneNumber && (
        <InitVerifyCodePhoneNumber
          init2FA={{ type: 'sms', popup: true }}
          emailbackup={userData?.email}
          preventNavigate={true}
          setIsValidated={setIsValidated}
          width={'100%'}
          mobile_number={mobile_number}
        />
      )}

      {!loading && qrCode && modalOpen && (
        <section className='fixed w-full h-screen top-0 left-0 bg-lightblack '>
          <div
            className='bg-white shadow-2fl rounded-lg w-[95%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col 
          justify-center items-center gap-3 p-5 lg:w-[30%]  '
          >
            <div className='flex justify-between items-center w-full'>
              <h3 className=''>Link an Authenticator</h3>
              <button
                type='button'
                onClick={() => setModalOpen(false)}
                className='py-3 px-5 rounded-lg ml-auto flex justify-end items-end'
              >
                <BsXLg />
              </button>
            </div>

            <hr className='w-full border-gray' />

            <h2 className='text-base text-left'>
              Scan this QR code in the authenticator app
            </h2>

            <Image
              src={`data:image/png;base64,${qrCode}`}
              alt='QR Code'
              width={250}
              height={250}
              className='h-[15rem] w-[15rem]'
            />

            <div className='flex flex-col justify-center items-center gap-3 w-full'>
              <p className='text-sm'>
                Have you scanned this qr code successfully?
              </p>
              <button
                type='button'
                onClick={async () => {
                  await initQrCode2fa(true)
                  setModalOpen(false)
                }}
                className='bg-primary text-white w-full h-12 rounded-full'
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {deactivateQrModal && (
        <>
          <div className='h-screen w-full overflow-hidden bg-lightblack fixed inset-0 top-0 left-0 flex justify-center items-center  '>
            <div className='flex flex-col justify-start items-start gap-5 shadow-2fl bg-white rounded-xl w-auto m-auto p-5 '>
              <div className='flex justify-between items-center w-full'>
                <h1 className='text-xl font-medium'>Disable 2FA </h1>
                <button
                  type='button'
                  onClick={() => setDeactivateQrModal(false)}
                  className='text-2xl'
                >
                  <CgClose />
                </button>
              </div>
              <hr className='w-full border-gray' />

              <p className='text-left xl:w-[80%] lg:w-[80%] md:w-full sm:w-full '>
                Are you sure you want to disable authenticator app verification?
              </p>

              <div className='flex justify-end items-center gap-4 ml-auto'>
                <button
                  type='button'
                  className='bg-transparent border border-lightgrey text-black px-5 h-12 rounded-full'
                  onClick={() => setDeactivateQrModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='bg-purple text-white px-5 h-12 rounded-full'
                  onClick={async () => {
                    await initQrCode2fa(false)
                    setDeactivateQrModal(false)
                  }}
                >
                  Yes, Disable
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {loading && (
        <section className='fixed w-full h-screen top-0 left-0 bg-lightblack'>
          <div className='bg-white shadow-2fl p-5 rounded-lg w-[30%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-3'>
            <p>Loading...</p>
          </div>
        </section>
      )}

      <main className='flex justify-between items-center gap-5 w-full border border-gray rounded-md p-5 '>
        <div className='flex items-center gap-3'>
          <span className='bg-gray h-8 w-8 rounded-full p-2'>
            <IoPhonePortraitOutline className='text-primary' />
          </span>
          <div className='flex flex-col justify-start items-start gap-1'>
            <p className='font-medium'>{t('Authentication App')}</p>
            <span className='text-lightgrey text-sm '>
              {t(
                'Use Google Authenticator to protect your account and transactions'
              )}
            </span>
          </div>
        </div>

        {userData?.settings?.twofa === true ? (
          <button
            type='button'
            onClick={() => {
              setValidateModalPassword(true)
            }}
            className='text-primary cursor-pointer'
          >
            Deactivate
          </button>
        ) : (
          <button
            type='button'
            onClick={handleAddClick}
            className='rounded-full px-5 h-10 shadow-2fl'
          >
            Add
          </button>
        )}
      </main>
    </>
  )
}

export default DoubleFactorAuth

// const DoubleFactorAuth = () => {
//   const router = useRouter()
//   const ref = useRef(null)
//   const qrCodeRef = useRef()
//   const validateScanRef = useRef()
//   const { t } = useTranslation()

//   const cookies = new Cookies()

//   const [qrCode, setQrCode] = useState(null)
//   const [popUpSms, setPopUpSms] = useState(null)
//   const [accessable, setAccessable] = useState(false)
//   const [isValidated, setIsValidated] = useState(false)
//   const [popUp2faAuth, setPopUp2faAuth] = useState(null)
//   const [mobile_number, setMobile_number] = useState(null)
//   const [popUpVerifyPhoneNumber, setPopUpVerifyPhoneNumber] = useState(null)
//   const [alertWatcher, setAlertWatcher] = useState({
//     statement: '',
//     value: false,
//   })

//   const [loading, setLoading] = useState(false)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [deactivateQrModal, setDeactivateQrModal] = useState(false)

//   const userData = useSelector(getUserInfo)

//   useEffect(() => {
//     if (userData?.settings?.twofa) {
//       qrCodeRef.current.checked = true
//       return
//     }
//   }, [])

//   /**
//    * The `initSms2fa` function is an asynchronous function that sets up SMS for two-factor
//    * authentication (2FA) by sending a POST request to a specified URL with the user token and relevant
//    * settings.
//    * @returns The `initSms2fa` function returns either an alert message if the user is not
//    * authenticated, an error message if the API call fails, or a success message if setting up SMS for
//    * 2FA is successful.
//    */
//   const initSms2fa = async () => {
//     const token = cookies.get('user_token')
//     if (!token) {
//       alert('Not authenticated!!!')
//       return
//     }
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/settings`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             token,
//             sms: true,
//             twofa: false,
//           }),
//         }
//       )

//       const data = await res.json()

//       if (data?.status !== true) {
//         setAlertWatcher({
//           statement: data?.errors?.message,
//           value: true,
//         })
//         return
//       }
//       toast.success('Sms for 2FA is set up successfully.')
//     } catch (error) {}
//   }

//   /**
//    * The function `initQrCode2fa` sets up a QR code for two-factor authentication (2FA) after checking
//    * user authentication and making a POST request to a specified endpoint.
//    * @returns The `initQrCode2fa` function returns either an alert message "Not authenticated!!!" if the
//    * user token is not found, or a success message "QrCode for 2FA is set up successfully." if the QR
//    * code for two-factor authentication is set up successfully. If there is an error during the process,
//    * no specific return value is provided.
//    */
//   const initQrCode2fa = async () => {
//     const token = cookies.get('user_token')
//     if (!token) {
//       alert('Not authenticated!!!')
//       return
//     }
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/settings`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             token,
//             sms: false,
//             twofa: true,
//           }),
//         }
//       )
//       const data = await res.json()

//       if (data?.status !== true) {
//         setAlertWatcher({
//           statement: data?.errors?.message,
//           value: true,
//         })
//         return
//       }
//       toast.success('QrCode for 2FA is set up successfully.')
//     } catch (error) {}
//   }

//   const handleChangeCheck = async (e, current) => {
//     if (current === 'validate') {
//       const checked = e.target.checked
//       if (checked) {
//         const result = await initQrCode2fa()
//         setModalOpen(false)
//         router.refresh()
//         //validateScanRef.current.checked = false;
//       }

//       return
//     }

//     if (current === 'auth') {
//       const checked = e.target.checked
//       if (checked) {
//         //smsRef.current.checked = false
//         setPopUp2faAuth(true)
//       }
//     }

//     if (current === 'sms') {
//       const checked = e.target.checked
//       if (checked) {
//         qrCodeRef.current.checked = false
//         if (!userData?.phone_number) {
//           toast.error(
//             'Please add a phone number in profile tab before you continue.'
//           )
//           setPopUpSms(true)
//           return
//         }
//         const result = await initSms2fa()
//       }
//     }
//   }

//   useEffect(() => {
//     isValidated && initSms2fa()
//   }, [isValidated])

//   const getQR_Code = async () => {
//     const token = cookies.get('user_token')
//     if (!token) {
//       alert('Not authenticated!!!')
//       return
//     }
//     setLoading(true)
//     setModalOpen(true)
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${userData?.id}/activate-2fa`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             token,
//           }),
//         }
//       )
//       const data = await res.json()

//       if (data?.status !== true) {
//         // alert('Something went wrong here')
//         return
//       }
//       setQrCode(data?.data?.qr)
//       setAccessable(true)
//       setPopUp2faAuth(false)
//       setLoading(false)
//       // setAlertWatcher({
//       //   statement: `Qr Code generated. Scan the code with an authenticator app.`,
//       //   value: true,
//       // })
//     } catch (e) {
//       toast.error('There was an error generating code.')
//     }
//   }

//   /* The `useEffect` hook you provided is setting up an event listener to detect clicks outside of a
// specific element referenced by `ref`. Here's a breakdown of what it does: */
//   useEffect(() => {
//     const checkIfClickedOutside = (e) => {
//       if (popUp2faAuth && ref.current && !ref.current.contains(e.target)) {
//         setPopUp2faAuth(false)
//       }
//     }

//     document.addEventListener('mousedown', checkIfClickedOutside)

//     return () => {
//       document.removeEventListener('mousedown', checkIfClickedOutside)
//     }
//   }, [popUp2faAuth])

//   return (
//     <>
//       {alertWatcher?.value && (
//         <CustomAlert watcher={alertWatcher} setWatcher={setAlertWatcher} />
//       )}

//       {popUp2faAuth && (
//         <DoubleFactorAuthPrompt
//           setPopUp2faAuth={setPopUp2faAuth}
//           setAccessable={setAccessable}
//           getQR_Code={getQR_Code}
//           initQrCode2fa={initQrCode2fa}
//         />
//       )}

//       {popUpSms && (
//         <AddSmsAuth
//           id={id}
//           setPopUpSms={setPopUpSms}
//           setPopUpVerifyPhoneNumber={setPopUpVerifyPhoneNumber}
//           email={userData?.email}
//           setMobile_number={setMobile_number}
//         />
//       )}

//       {!isValidated && popUpVerifyPhoneNumber && (
//         <InitVerifyCodePhoneNumber
//           init2FA={{ type: 'sms', popup: true }}
//           emailbackup={userData?.email}
//           preventNavigate={true}
//           setIsValidated={setIsValidated}
//           width={'100%'}
//           mobile_number={mobile_number}
//         />
//       )}

//       {!loading && qrCode && modalOpen && (
//         <section className='fixed w-full h-screen top-0 left-0 bg-lightblack '>
//           <div
//             className='bg-white shadow-2fl rounded-lg w-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col
//           justify-center items-center gap-3 xl:p-10 lg:p-10 md:p-10 sm:p-5  '
//           >
//             <button
//               type='button'
//               onClick={() => setModalOpen(false)}
//               className='py-3 px-5 rounded-lg ml-auto flex justify-end items-end'
//             >
//               <BsXLg />
//             </button>

//             <div className='flex flex-col justify-center items-center gap-2 text-center mx-auto xl:w-[50%] lg:w-[50%] md:w-full sm:w-full '>
//               <h2 className='text-lg font-medium'>
//                 Scan code in authenticator app
//               </h2>
//               <p className='text-lightblack text-sm '>
//                 Generate a verification code with an authenticator app, then
//                 enter a name to remember it by.
//               </p>
//             </div>

//             <Image
//               src={`data:image/png;base64,${qrCode}`}
//               alt='QR Code'
//               width={250}
//               height={250}
//               className='h-[15rem] w-[15rem]'
//             />

//             <div className='flex justify-center items-center gap-5'>
//               <input
//                 ref={validateScanRef}
//                 type='radio'
//                 onChange={(e) => handleChangeCheck(e, 'validate')}
//               />
//               <p>Have you scanned this qr code successfully?</p>
//             </div>
//           </div>
//         </section>
//       )}

//       {deactivateQrModal && (
//         <>
//           <div className='h-screen w-full overflow-hidden bg-lightblack fixed inset-0 top-0 left-0 flex justify-center items-center  '>
//             <div className='flex flex-col justify-center items-center gap-4 shadow-2fl bg-white rounded-lg w-auto m-auto xl:p-10 lg:p-10 md:p-5 sm:p-5 '>
//               <h1 className='text-xl font-semibold'>Confirm Deactivation</h1>
//               <p className='text-gray-600 mx-auto text-center xl:w-[70%] lg:w-[80%] md:w-full sm:w-full '>
//                 Are you sure you want to deactivate authentication on this
//                 account? This action cannot be undone.
//               </p>
//               <div className='flex justify-center items-center gap-4'>
//                 <button
//                   type='button'
//                   className='bg-transparent border text-black px-4 py-3 rounded-lg'
//                   onClick={() => setDeactivateQrModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type='button'
//                   className='bg-primary text-white px-4 py-3 rounded-lg'
//                   onClick={() => {
//                     setDeactivateQrModal(false)
//                     setPopUp2faAuth(true)
//                   }}
//                 >
//                   Yes, Proceed
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {loading && (
//         <section className='fixed w-full h-screen top-0 left-0 bg-lightblack'>
//           <div className='bg-white shadow-2fl p-5 rounded-lg w-[50%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-3'>
//             <p>Loading...</p>
//           </div>
//         </section>
//       )}

//       <main className='flex justify-between items-center gap-5 w-full border border-gray rounded-md p-5 '>
//         <div className='flex items-center gap-3'>
//           <span className='bg-gray h-8 w-8 rounded-full p-2'>
//             <IoPhonePortraitOutline className='text-primary' />
//           </span>
//           <div className='flex flex-col justify-start items-start gap-1'>
//             <p className='font-medium'>{t('Authentication App')}</p>
//             <span className='text-lightgrey text-sm '>
//               {t(
//                 'Use Google Authenticator to protect your account and transactions'
//               )}
//             </span>

//           </div>
//         </div>

//         {userData?.settings?.twofa === true ? (
//           <button
//             type='button'
//             onClick={(e) => setDeactivateQrModal(true)}
//             className='text-primary cursor-pointer'
//           >
//             Deactivate
//           </button>
//         ) : (
//           <button type='button' >Add</button>
//         )}

//         <input
//           ref={qrCodeRef}
//           type='radio'
//           onChange={(e) => handleChangeCheck(e, 'auth')}
//         />
//       </main>
//     </>
//   )
// }

// export default DoubleFactorAuth
