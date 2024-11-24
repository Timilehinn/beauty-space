import BookingCheckout from '../../../../../components/bookings/Checkout'
import { cookies } from 'next/headers'

export async function generateMetadata({ params }) {
  const id = params?.id
  const cookieStore = cookies()
  const token = cookieStore.get('user_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json())

  // Parse the HTML description (assuming it's in the format '<p>Welcome to bobtech</p>')
  const htmlDescription = res?.data?.description || '' // Replace with the actual description

  return {
    title: `${res?.data?.name} | Get access to the best and affordable ${
      res?.category?.name + 's'
    }`,
    description: htmlDescription.slice(0, 300) || 'No description available',
  }
}

export default function Page({ params }) {
  return <BookingCheckout id={params.id} />
}
