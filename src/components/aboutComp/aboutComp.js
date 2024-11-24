'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createClient } from 'contentful'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CgClose } from 'react-icons/cg'

import { getAboutContent, setAboutContent } from '../../redux/indexData'

// team images
import adewale from '../../assets/teamimage/adewale.png'
import oloti from '../../assets/teamimage/tope.png'
import timi from '../../assets/teamimage/timi.png'
import mercy from '../../assets/teamimage/img4.jpeg'
import bashir from '../../assets/teamimage/img5.jpeg'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

const teamData = [
  {
    id: 1,
    img: oloti,
    position: 'Co-Founder and Chief Executive Officer',
    name: 'Temitope Olotin',
    bio: 'I am a dynamic software engineer with over 9 years of experience, dedicated to developing robust code that caters to the needs of high-volume businesses. My expertise lies in enhancing code efficiency and optimizing user experiences.\n\nNotably, I achieved a remarkable 60% increase in code efficiency for a partner portal, resulting in a significant improvement in user satisfaction by approximately 40%. As a Team Lead, I have successfully contributed to the development of high-priority features that played a crucial role in retaining valuable customers, with an impressive retention rate of around 20%. Additionally, my efforts brought in an additional 5% of new customers, contributing to the overall growth of the business. I am not only a passionate team player but also a creative thinker, constantly exploring innovative solutions to complex problems. Outside of work, I engage in various creative pursuits, including blogging and composing songs. Above all, I value quality time spent with my family, cherishing those precious moments together. With my extensive experience, enthusiasm, and diverse skill set, I am ready to make valuable contributions to your team and drive success in developing exceptional software solutions.',
  },
  {
    id: 2,
    img: adewale,
    position: 'Co-Founder and Chief Marketing Officer',
    name: 'Adewale Akintade',
    bio: 'Result Oriented Digital Marketer with 6+ years of expertise in creating and executing effective marketing strategies. Skilled in analyzing data to optimize campaigns and boost business growth. Demonstrated success in increasing brand visibility, acquiring customers, and improving online presence. Proficient in utilizing various digital channels such as social media, SEO, email marketing, and content marketing.\n\nCapable of leading teams and collaborating with stakeholders to align marketing goals with overall business objectives. Strong analytical abilities to interpret complex data and generate actionable marketing plans. Keen interest in staying updated with industry trends and emerging technologies for innovative marketing solutions. Excellent communication skills for seamless client and team collaboration. Results-driven mindset focused on achieving ROI and driving revenue growth.',
  },
  {
    id: 3,
    img: timi,
    position: 'Frontend and Mobile Developer',
    name: 'Timilehin Makinde',
    bio: 'I am a software engineer with 4+ years of experience in mobile app development, web app development, and backend programming. My main programming language is JavaScript, and I have expertise in React Native for mobile app development. Additionally, I have experience with Java, Python, and native Android app development.\n\nI am proficient in React and Node.js for web development and have worked with databases like MongoDB and PostgreSQL. I also have knowledge of AWS for cloud-based deployments. I am passionate about delivering high-quality software solutions, collaborating with teams, and providing innovative problem-solving.',
  },
  {
    id: 4,
    img: mercy,
    position: 'Frontend Developer',
    name: 'Ridwan Damilare Afolabi',
    bio: 'I am a proficient front-end developer with over two years of experience in creating modern and responsive web applications. My skillset encompasses a robust knowledge of several programming languages and tools, including JavaScript, React, Tailwind, Next.js, Redux Toolkit, Sass, and CSS. In addition, I demonstrate proficiency in the use of various web development tools and frameworks, such as Webpack, Babel, ESLint, and React Testing Library. My passion lies in designing user-friendly and accessible interfaces that cater to the needs and expectations of both clients and users.\n\nI am consistently driven by the desire to acquire knowledge of new technologies and enhance my skills. My team-oriented approach to work and ability to collaborate with other developers, designers, and stakeholders are qualities that I hold in high regard. Furthermore, I possess the capability to work independently, and efficiently manage my time and tasks.\n\nMy proficiencies include excellent communication and problem-solving skills, as well as a commitment to delivering high-quality and maintainable code. I am currently seeking a challenging and fulfilling opportunity to apply my expertise and contribute to the success of your organization.',
  },
  {
    id: 5,
    img: bashir,
    position: 'Frontend Developer Intern',
    name: 'Bashir Aremu',
    bio: 'Bashir Aremu is a full stack developer intern. As a full stack intern, I am a highly motivated and versatile individual with a passion for both front-end and back-end development. I possess a solid foundation in JavaScript programming language and react library In my role as a full stack intern, I am committed to learning and honing my skills in both front-end and back-end technologies. On the front-end, I am proficient in HTML, CSS, and JavaScript, allowing me to create visually appealing and user-friendly interfaces. I have experience with modern front-end frameworks like React and Next, enabling me to develop interactive and dynamic web applications.',
  },
]

export default function AboutComp() {
  const dispatch = useDispatch()

  const main = useRef()
  const heroContainer = useRef()
  const aboutContent = useSelector(getAboutContent)

  const [isModalOpen, setIsModalOpen] = useState(null)

  const fetchAboutContent = async () => {
    try {
      const res = await client.getEntries({
        content_type: 'aboutContent',
      })
      dispatch(setAboutContent(res.items))
    } catch (error) {}
  }

  useEffect(() => {
    fetchAboutContent()
  }, [])

  /* The above code is using the `useEffect` hook in React to run some animations when the component
mounts. It is using the GSAP library to animate elements with class names `.heroForm` and
`.heroSlide`. */
  useGSAP(
    () => {
      gsap.fromTo(
        '.hero-section',
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.inOut',
          delay: 2,
          duration: 1.5,
        }
      )

      const boxes = gsap.utils.toArray('.team-section')

      boxes.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: -100,
          },
          {
            duration: 1,
            autoAlpha: 1,
            ease: 'power2.inOut',
            y: 0,
            stagger: 0.5,
            delay: 0.5,
            scrollTrigger: {
              id: `section-${index + 1}`,
              trigger: el,
              start: 'top center+=100',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    },
    { scope: heroContainer, main }
  )

  return (
    <main
      ref={heroContainer}
      className='flex flex-col justify-start items-start gap-8 w-full relative 3xl:w-[65%] 3xl:mx-auto 3xl:px-10 3xl:py-[10rem] '
    >
      <section className='hero-section xl:h-[35rem] lg:h-[35rem] md:h-[30rem] sm:h-[35rem] w-full relative  '>
        <section className='flex flex-col justify-center items-center gap-8 h-full absolute left-0 bottom-0 3xl:text-5xl xl:px-[10rem] lg:px-16 md:px-10 sm:px-5'>
          <h1 className='text-5xl font-semibold text-black '>
            {aboutContent[2]?.fields?.item?.fields?.title}
          </h1>
          <p className='text-black text-center mx-auto 3xl:text-3xl xl:text-lg lg:text-lg lg:px-0 lg:w-[80%] md:w-[80%] md:text-xl sm:px-5 sm:w-full sm:text-base'>
            {
              aboutContent[2]?.fields?.item?.fields?.description?.content[0]
                ?.content[0].value
            }
          </p>
        </section>
      </section>

      <section
        ref={main}
        className=' snap-x mx-auto snap-mandatory h-auto flex gap-5 overflow-scroll scrollbar-hide 3xl:w-[80%] xl:w-[70%] lg:w-[80%] md:w-[90%] sm:w-[95%]'
      >
        {teamData.map((person) => {
          return (
            <div
              key={person.id}
              onClick={() => setIsModalOpen(person)}
              className='team-section snap-start 3xl:w-[450px] xl:w-[300px] lg:w-[300px] md:w-[300px] sm:w-[300px] relative flex-shrink-0 flex flex-col items-center justify-start cursor-pointer'
            >
              <Image
                src={person.img}
                alt={person.name}
                width={250}
                height={300}
                className='rounded-3xl w-full h-[400px] object-cover object-center 3xl:h-[550px]'
              />
              <div className='flex flex-col justify-center items-center text-center gap-2 mx-auto w-[80%] bg-white rounded-xl py-2 px-5 absolute bottom-3 '>
                <h2 className='text-base font-semibold 3xl:text-3xl'>
                  {person.name}
                </h2>
                <span className='text-sm text-lightgrey 3xl:text-2xl'>
                  {person.position}
                </span>
              </div>
            </div>
          )
        })}
      </section>

      <div className='bg-[#ebf5fb] h-[25rem] flex flex-col justify-center items-center w-full'>
        <section className='team-section flex flex-col justify-center items-center gap-5 mx-auto text-center py-16 xl:w-[40%] lg:w-[60%] md:w-[70%] sm:w-[95%] '>
          <h1 className='font-semibold text-4xl 3xl:text-6xl'>
            {aboutContent?.[3]?.fields?.item?.fields?.title}
          </h1>

          <p className=' text-lightblack 3xl:text-3xl '>
            {
              aboutContent?.[3]?.fields?.item?.fields?.description?.content[0]
                ?.content[0]?.value
            }
          </p>
        </section>
      </div>

      {isModalOpen && (
        <div className='flex justify-center items-center bg-lightblack h-screen w-full fixed top-0 left-0 z-20 overflow-hidden '>
          <div
            className='flex flex-col justify-start items-start gap-5 bg-white rounded-xl w-[40%] h-[30rem]  shadow-1fl absolute overflow-y-scroll scrollbar-hide z-10 xl:p-10
          lg:p-10 lg:w-[60%] md:w-[90%] md:p-5 sm:w-[95%] sm:p-5 '
          >
            <div className='flex justify-between items-start w-full'>
              <div className='flex flex-col justify-start items-start gap-2'>
                <Image
                  src={isModalOpen.img}
                  alt={isModalOpen.name}
                  width={500}
                  height={500}
                  className='rounded-full w-[100px] h-[100px] object-cover object-center'
                />
                <h2 className='text-lg font-semibold'>{isModalOpen.name}</h2>
                <span className='text-sm text-lightgrey'>
                  {isModalOpen.position}
                </span>
              </div>

              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='text-2xl'
              >
                <CgClose />
              </button>
            </div>

            <p className=''>{isModalOpen.bio}</p>
          </div>
        </div>
      )}
    </main>
  )
}
