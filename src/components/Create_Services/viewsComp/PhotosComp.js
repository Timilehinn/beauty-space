import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { LiaFileUploadSolid } from 'react-icons/lia'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  getServiceData,
  setServiceData,
} from '../../../redux/createWorkspaceSlice'

export default function PhotosComp({ prev, next, action }) {
  const dispatch = useDispatch()
  const serviceData = useSelector(getServiceData)

  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [isLocalStorageDataLoaded, setIsLocalStorageDataLoaded] =
    useState(false)

  useEffect(() => {
    if (isLocalStorageDataLoaded) return

    const savedFiles = localStorage.getItem('uploadedFiles')

    if (savedFiles && action !== 'edit') {
      const parsedFiles = JSON.parse(savedFiles)
      setFiles(parsedFiles)
      dispatch(setServiceData({ photos: parsedFiles }))

      setIsLocalStorageDataLoaded(true)
    }

    if (serviceData && action === 'edit') {
      setFiles(serviceData.photos)
    }
  }, [dispatch, action, serviceData])

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files)
    const validFiles = newFiles.filter((file) =>
      ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)
    )

    if (validFiles.length !== newFiles.length) {
      toast.error('Only JPG, PNG, and SVG files are allowed.')
    }

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataURL = reader.result

        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, { url: dataURL }]
          dispatch(setServiceData({ photos: updatedFiles }))
          return updatedFiles
        })

        startUpload(file.name)
      }
      reader.readAsDataURL(file)
    })
  }

  const startUpload = (fileName) => {
    setUploadProgress((prev) => ({ ...prev, [fileName]: 'Loading' }))

    // Simulate upload delay
    setTimeout(() => {
      setUploadProgress((prev) => ({ ...prev, [fileName]: 'Completed' }))
    }, 1000)
  }

  const removeFile = (file) => {
    const updatedFiles = files.filter((f) => f.url !== file.url)
    setFiles(updatedFiles)

    const fileName = Object.keys(uploadProgress).find((name) => {
      return files.find((f) => f.url === file.url) === file
    })

    if (fileName) {
      const updatedProgress = { ...uploadProgress }
      delete updatedProgress[fileName]
      setUploadProgress(updatedProgress)
    }

    dispatch(setServiceData({ photos: updatedFiles }))
  }

  const handleProceed = () => {
    if (action !== 'edit') {
      localStorage.setItem('uploadedFiles', JSON.stringify(files))
    }
    dispatch(setServiceData({ photos: files }))
    next({ photos: files })
  }

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full border border-gray rounded-md p-5'>
      <header className='flex flex-col gap-3 w-full'>
        <h2 className='text-lg font-semibold'>Photos</h2>
        {/* <p>Upload at least 2 photos of your services</p> */}
      </header>
      <hr className='w-full border-gray' />

      <div className='flex flex-col gap-3 w-full'>
        <span>Image</span>

        <div className='w-full flex flex-col justify-start items-start gap-5'>
          <div className='flex flex-col gap-3 justify-center items-center w-full border border-dashed border-gray h-[10rem] rounded-md'>
            <LiaFileUploadSolid className='text-3xl text-primary' />
            <label htmlFor='photos' className='text-primary underline'>
              {' '}
              Click to upload
            </label>
            <span className='text-sm text-lightgrey'>
              SVG, PNG, JPG, (max. 3MB)
            </span>
            <input
              type='file'
              multiple
              id='photos'
              accept='image/jpeg,image/png,image/svg+xml'
              onChange={handleFileUpload}
              className='hidden'
            />
          </div>

          {files.length > 0 && (
            <div className='grid grid-cols-1 gap-4 w-full'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between w-full gap-5'
                >
                  <div className='flex items-center gap-2'>
                    <Image
                      src={file.url}
                      alt='Uploaded'
                      width={80}
                      height={25}
                      className='w-[120px] h-[80px] object-cover object-top rounded-md'
                    />
                    <span> Image {index + 1}</span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => removeFile(file)}
                      className='text-2xl'
                    >
                      <RiDeleteBin7Line />
                    </button>

                    <span className='flex items-center gap-2'>
                      {uploadProgress[`Image ${index + 1}`] === 'Loading' && (
                        <div role='status'>
                          <svg
                            aria-hidden='true'
                            className='w-5 h-5 text-gray animate-spin dark:text-lightgrey fill-blue-600'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                              fill='#389abf'
                            />
                            <path
                              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                              fill='#e6e6e8'
                            />
                          </svg>
                          <span className='sr-only'>Loading...</span>
                        </div>
                      )}

                      {uploadProgress[`Image ${index + 1}`] === 'Completed' && (
                        <FaCircleCheck className='text-green text-2xl' />
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
          onClick={handleProceed}
          className='rounded-full h-12 w-[150px] text-white bg-primary ring-2 ring-gray'
        >
          Next
        </button>
      </div>
    </main>
  )
}
