import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { BsArrowUpRight } from 'react-icons/bs'

const FooterComp = () => {
  const { t } = useTranslation()

  return (
    <footer
      className=' py-20 w-full shadow-1fl flex gap-10 mx-auto 3xl:w-[65%] xl:text-sm special:text-sm xl:flex-row xl:justify-between lg:text-sm lg:flex-row lg:justify-between lg:gap-5
    md:flex-col md:justify-start md:text-xl sm:text-base sm:justify-start sm:flex-col xxl:pr-[10rem] xxl:pl-[9rem] xl:pl-[9rem] xl:pr-[10rem] lg:pl-14 lg:pr-16 md:pl-8 md:pr-10 sm:pr-5 sm:pl-4'
    >
      <div className=''>
        <Link href='/' scroll={false}>
          <div className='flex justify-start items-center gap-2'>
            <Image src='/Beautyspace.svg' alt='logo' width={100} height={100} />

            <div className='flex flex-col justify-start items-start gap-3'>
              <h1 className='text-black font-bold 3xl:text-7xl lg:text-4xl md:text-2xl sm:text-2xl'>
                BeautySpace
              </h1>
              <p className='text-lightgrey 3xl:text-3xl'>
                Discover and explore beauty spaces nearby
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className='flex flex-col justify-start items-start gap-5 3xl:text-3xl 3xl:gap-10'>
        <Link href='/business'>
          <div className='hover:text-primary'> {t('For business')}</div>
        </Link>

        <Link href='/booking'>
          <div className='hover:text-primary'> {t('Search Service')}</div>
        </Link>
        <Link href='/booking'>
          <div className='hover:text-primary'> {t('Search by location')}</div>
        </Link>
        <Link href='/blog'>
          <div className='hover:text-primary'> {t('Blog')}</div>
        </Link>
        <Link href='/faq'>
          <div className='hover:text-primary'> {t('Faqs')}</div>
        </Link>
      </div>

      <div className='flex flex-col justify-start items-start gap-5 3xl:text-3xl 3xl:gap-10 '>
        <Link href='/about'>
          <div className='hover:text-primary'>{t('About Us')}</div>
        </Link>
        <Link href={'/contact'}>
          <div className='hover:text-primary'> Contact us</div>
        </Link>
        <Link href={'/privacypolicy'}>
          <div className='hover:text-primary'>Privacy Policy</div>
        </Link>
        <Link href='https://beautyspace.tawk.help/' target={'_blank'}>
          <div className='hover:text-primary'>{t('Support Center')}</div>
        </Link>
      </div>

      <div className='flex flex-col justify-start items-start gap-5 3xl:text-3xl 3xl:gap-10 '>
        <Link href='https://www.linkedin.com/company/tryspacely'>
          <div className='flex justify-start items-center gap-2 hover:text-primary'>
            <BsArrowUpRight />
            LinkedIn
          </div>
        </Link>
        <Link href='https://twitter.com/tryspacely'>
          <div className='flex justify-start items-center gap-2 hover:text-primary'>
            <BsArrowUpRight />
            Twitter/X
          </div>
        </Link>
        <Link href='https://facebook.com/tryspacely'>
          <div className='flex justify-start items-center gap-2 hover:text-primary'>
            <BsArrowUpRight />
            Facebook
          </div>
        </Link>
        <Link href='https://instagram.com/tryspacely' target={'_blank'}>
          <div className='flex justify-start items-center gap-2 hover:text-primary'>
            <BsArrowUpRight />
            Instagram
          </div>
        </Link>
      </div>
    </footer>
  )
}

export default FooterComp
