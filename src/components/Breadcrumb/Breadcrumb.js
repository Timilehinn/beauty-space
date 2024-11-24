import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Breadcrumb = () => {
  const pathname = usePathname()

  // Split the pathname into segments
  const pathnames = pathname.split('/').filter((x) => x)

  // If the pathnames array is empty, return null (no breadcrumb to show)
  if (pathnames.length === 0) return null

  return (
    <nav className='breadcrumb'>
      <ol className='flex justify-start items-center gap-3 list-none'>
        {pathnames.map((value, index) => {
          const href = '/' + pathnames.slice(0, index + 1).join('/')
          const isLast = index === pathnames.length - 1

          return (
            <li
              key={index}
              className='flex justify-start items-center gap-3 capitalize'
            >
              {index !== 0 && <span>/</span>}
              {isLast ? (
                <span className='text-lightgrey'>
                  {decodeURIComponent(value)}
                </span>
              ) : (
                <Link href={href}>
                  <span className='hover:text-primary'>
                    {decodeURIComponent(value)}
                  </span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
