import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  getServiceData,
  setServiceData,
} from '../../../redux/createWorkspaceSlice'

import Render from './Render'

// Assuming BLAHtml is imported from another file or defined in this file
const BLAHtml = `  <!DOCTYPE html
 PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <title>file_1705157836097</title>
 <meta name="author" content="Temidayo Akeredolu" />
 <style type="text/css">
 </style>
</head>
<body>
 <p style="padding-top: 3pt;text-indent: 0pt;text-align: left;">This Service Level Agreement (SLA) is
   made and entered into as of [Agreement Date]</p>
 
 <h1 style="font-size:22px">BETWEEN</h1>
 
 <p class="s1" style="text-indent: 0pt;line-height: 112%;text-align: justify;"><b>TRYBOOKINGS NIGERIA
   LIMITED</b><span class="p">, with a principal place of business at <b>Gracelane Block 8B Vip Gardens Boystown, Ipaja
   Lagos 100278</b> and hereinafter referred to as
     &quot;Client&quot;.</span></p>
 
 <h1 style="font-size:22px">AND</h1>
 
 <p style="text-indent: 0pt;line-height: 112%;text-align: justify;"><b>[Provider Name]</b>, with a principal
   place of business at <b>[Provider Address]</b> and hereinafter referred to as &quot;Provider&quot;.</p>
 
 <p class="s1" style="text-indent: 0pt;line-height: 112%;text-align: justify;">WHEREAS <span
     class="s2">the CLIENT is a company incorporated under the Laws of the Federal Republic of Nigeria and particularly
     the Company and Allied Matters Act through the Corporate Affairs Commission as a limited liability company.</span>
 </p>
 
 <p class="s1" style="text-indent: 0pt;text-align: left;">WHEREAS <span class="s2">the CLIENT is
     engaged in the business of;</span></p>
 
     <p class="s3" style="line-height: 111%;text-align: left;">1. Improving the
       quality of everyday life by leveraging technology to provide an innovative platform to;</p>
    
         <p class="s3" style="padding-left: 10pt;text-align: left;">a. deliver innovative, convenient
           and affordable online services to consumers,</p>
       
       
         <p class="s3" style="padding-top: 1pt;padding-left: 10pt;text-align: left;">b. help businesses
           grow as they use the platform to reach and serve their consumers.</p>
 
 <p class="s1" style="text-indent: 0pt;text-align: justify;">WHEREAS <span class="s2">the CLIENT
     wishes to improve its services and hereby secures the services of (name)</span></p>
 <p class="s2" style="padding-top: 1pt;text-indent: 0pt;text-align: justify;">as a SERVICE PROVIDER
   and for this agreement, they shall both be referred to as “The Parties”</p>
 
 <p class="s1" style="text-indent: 0pt;line-height: 113%;text-align: justify;">WHEREAS <span
     class="s2">the Parties now declare that this agreement shall repeal all other previously existing agreements
     between the Parties both written and Oral.</span></p>
 
 <p class="s1" style="text-indent: 0pt;line-height: 112%;text-align: justify;">NOW THEREFORE <span
     class="s2">in consideration of the covenants contained herein, and in connection with such collaboration of the
     business concept and technology, and in consideration for a mutually agreeable framework that shall serve as the
     foundation for the Parties to successfully deliver on the object of the service level agreement, the undersigned
     hereby agree as follows:</span></p>
 <h1 style="padding-top: 3pt;font-size:22px">1.0. SERVICES</h1>
 
       <p style="padding-top: 1pt;padding-left: 5pt;text-align: left;">Provider will provide the
         following services to Client (the &quot;Services&quot;):</p>
         <p style="padding-top: 2pt;padding-left: 5pt;text-align: left;"><b>[Categories]</b></p>
         <p style="padding-left: 5pt;text-indent: 0pt;text-align: left;">2.0. <b>INTELLECTUAL PROPERTY</b></p>
         <p
           style="padding-top: 1pt;padding-left: 23pt;text-indent: -18pt;line-height: 112%;text-align: justify;">
           2.1. Ownership: All rights, title, and interest in and to all intellectual property ("IP") rights developed or created by Provider in connection with the performance of the Services, including but not limited to software, designs, algorithms, source code, documentation, and know-how (collectively, the "Deliverables"), shall vest exclusively in Client upon full payment of all fees due under this Agreement.
         </p>
         <p style="padding-left: 23pt;text-indent: -18pt;line-height: 112%;text-align: justify;">
           2.2. Assignment: Provider now irrevocably assigns and transfers to Client all rights, title, and interest in and to the Deliverables, to the full extent permitted by law. This includes, but is not limited to, all copyright, patent, trademark, trade secret, and other intellectual property rights in and to the Deliverables.
         </p>
         <p style="padding-left: 23pt;text-indent: -18pt;line-height: 112%;text-align: justify;">
           2.3. Assistance: Provider agrees to cooperate with Client in obtaining and registering any copyrights, patents, trademarks, or other intellectual property rights in and to the Deliverables, as instructed by Client and at Client's expense.
         </p>
         
         <h1 style="font-size:22px">3.0 CONFIDENTIALITY</h1>
         <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">
           Both parties agree to hold in confidence all Confidential Information of the other party, which is defined as any information disclosed by one party to the other that is not publicly known and is marked as confidential or should reasonably be considered confidential under the circumstances.
         </p>
         
         <h1 style="font-size:22px">4.0 SERVICE LEVELS</h1>
         <p style="padding-top: 1pt;padding-left: 21pt;text-indent: -17pt;text-align: left;">4.1. The following service levels apply to the Services:</p>
         <p style="padding-left: 20pt;text-align: left;">4.1.1. IT and Design Services:</p>
         <p style="padding-left: 30pt;text-align: left;">a. Uptime: Guaranteed percentage of time the service is available (e.g., 99.9%, 99.5%).</p>
         <p style="padding-left: 30pt;text-align: left;">b. Response time: Average time it takes to respond to an incident (e.g., 1 hour, 15 minutes).</p>
         <p style="padding-left: 30pt;text-align: left;">c. Resolution time: Average time it takes to resolve an incident (e.g., 4 hours, 2 days).</p>
         <p style="padding-left: 30pt;line-height: 111%;text-align: left;">d. Patch deployment: Percentage of devices patched within a specific timeframe (e.g., 95% within 24 hours).</p>
         <p style="padding-left: 30pt;text-align: left;">e. Data backup and recovery: Time to restore data after a failure (e.g., 4 hours, 1 business day).</p>
         <p style="padding-left: 20pt;text-align: left;">4.1.2. Software as a Service (SaaS):</p>
         <p style="padding-left: 30pt;text-align: left;">a. Feature updates: Minimum frequency of new feature releases (e.g., quarterly, monthly).</p>
         <p style="padding-left: 30pt;text-align: left;">b. Bug fixes: Time to fix critical bugs (e.g., same day, within 24 hours).</p>
         <p style="padding-left: 30pt;text-align: left;">c. API uptime: Guaranteed percentage of time the API is available (e.g., 99.9%, 99.5%).</p>
         <p style="padding-left: 30pt;text-align: left;">d.Data security: Compliance with specific security standards (e.g., SOC 2, HIPAA).</p>
         
         <h1 style="padding-left: 5pt;text-indent: 0pt;text-align: left;font-size:22px">5.0 FEES AND PAYMENT</h1>
         <p style="padding-top: 1pt;padding-left: 22pt;text-indent: -17pt;text-align: left;">5.1. A fee of 5% per booking shall be applicable after the conclusion of the one-month complimentary trial period, and such fee is subject to modification, which may occur under the following circumstances:</p>
         <p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">a. High booking volumes</p>
         <p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">b. Changes in the company's fee policy</p>
         <p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">c. Inflation</p>
         
    
         <p style="padding-top: 1pt;padding-left: 21pt;text-indent: -17pt;text-align: left;">5.2. The fee shall be as scheduled below</p>
             <p style="padding-top: 1pt;padding-left: 31pt;text-indent: -10pt;text-align: left;">a. The client possesses the entitlement to unilaterally withdraw funds from their account at any time.</p>
             <p style="padding-top: 1pt;padding-left: 32pt;text-indent: -11pt;text-align: left;">b. Withdrawals are permissible solely in relation to services that have been duly rendered by the client.</p>
         
 
     <h1 style="font-size:22px; ">TERM AND TERMINATION</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">This
       Agreement shall commence on the Effective Date and shall continue for a period of <b>[Term]</b>, unless earlier
       terminated as provided herein. This Agreement may be terminated by either party upon <b>[Notice period]</b> written
       notice to the other party.</p>
     
     <h1 style="font-size:22px">DISCLAIMER OF WARRANTIES</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">The services
       and deliverables provided herein are with warranty both express or implied. Provider proclaims all warranties,
       express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a
       particular purpose, and non-infringement.</p>
     
     <h1 style="font-size:22px">LIMITATION OF LIABILITY</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">In no event
       shall the provider liability be limited for any indirect, incidental, consequential, special, or exemplary
       damages arising out of or in connection with this agreement, whether based on contract, tort, strict liability,
       or otherwise.</p>
     
     <h1 style="font-size:22px">DISPUTE RESOLUTION</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">Any dispute
       arising out of or relating to this Agreement shall be settled using mediation by the rules of the Institute of
       Chartered Mediators and Conciliators. The mediation shall be conducted in Ibadan, Oyo State and the mediated
       agreement shall be final and binding.</p>
     <h1 style="font-size:22px">GOVERNING LAW</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">This
       Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
     
     <h1 style="font-size:22px">ENTIRE AGREEMENT</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">This
       Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and
       supersedes all prior or contemporaneous communications, representations, or agreements, whether oral or written.
     </p>
     
     <h1 style="font-size:22px">NOTICES</h1>
     <p style="padding-top: 1pt;text-indent: 0pt;line-height: 112%;text-align: justify;">All notices
       and other communications hereunder shall be in writing and shall be deemed to have been duly given when
       delivered personally, sent by certified or registered mail, return receipt requested, or sent by overnight
       courier service to the addresses set forth above.</p>
     
     <h1 style="font-size:22px">SEVERABILITY</h1>
 <p style="text-indent: 0pt;line-height: 112%;text-align: left;">If any <b>provision
   </b>of this Agreement is held to be invalid or unenforceable, such provision shall be struck off and the remaining
   provisions shall remain in full force and effect</p>
</body>
</html> `

export default function ServiceAgreement({ prev, next, action }) {
  const dispatch = useDispatch()
  const serviceData = useSelector(getServiceData)
  const [agreement, setAgreement] = useState('')

  useEffect(() => {
    const savedAgreement = localStorage.getItem('agreement')
    if (savedAgreement) {
      dispatch(setServiceData(JSON.parse(savedAgreement)))
    }

    const businessAddress = serviceData.address || ''
    const businessName = serviceData.name || ''
    const categories = serviceData.category || ''
    const agreementDate = new Date().toLocaleDateString()

    const replacements = {
      '[Agreement Date]': agreementDate,
      '[Client Address]': businessAddress,
      '[Provider Name]': businessName,
      '[Provider Address]': businessAddress,
      '[Categories]': categories,
      '[Term]': '1 year',
      '[Notice period]': '30 days',
    }

    let updatedAgreement = BLAHtml

    for (const [placeholder, value] of Object.entries(replacements)) {
      updatedAgreement = updatedAgreement.split(placeholder).join(value)
    }

    setAgreement(updatedAgreement)
  }, [dispatch])

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full '>
      <h2 className='font-semibold text-lg'>
        BeautySpaceng Service Level Agreement
      </h2>

      <Formik
        initialValues={{ agreement: serviceData.agreement || false }}
        validationSchema={Yup.object().shape({
          agreement: Yup.bool().oneOf(
            [true],
            'Accept Terms & Conditions is required'
          ),
        })}
        onSubmit={(values) => {
          if (action !== 'edit') {
            localStorage.setItem('agreement', JSON.stringify(values))
          }
          next(values)
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className='w-full h-[80vh] flex flex-col justify-between items-start gap-5 border border-gray rounded-md p-5 overflow-auto scrollbar-hide'>
            <div className='flex flex-col justify-start items-start gap-8 w-full'>
              <Render html={agreement} />

              <div className='flex items-center justify-start gap-3'>
                <Field
                  type='checkbox'
                  name='agreement'
                  checked={serviceData.agreement || false}
                  onChange={(e) => {
                    dispatch(
                      setServiceData({
                        ...serviceData,
                        agreement: e.target.checked,
                      })
                    )
                    setFieldValue('agreement', e.target.checked)
                  }}
                />
                <label htmlFor='agreement'>
                  I accept the terms and conditions
                </label>
              </div>

              {errors.agreement && touched.agreement && (
                <span className='text-danger text-sm'>{errors.agreement}</span>
              )}
            </div>

            <div className='flex items-center gap-5 ml-auto'>
              <button
                onClick={() => prev(serviceData)}
                className='rounded-full h-12 w-[150px] text-black border border-lightgrey '
              >
                Prev
              </button>

              <button
                type='submit'
                className='rounded-full h-12 w-[150px] text-white bg-primary ring-2 ring-gray'
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  )
}
