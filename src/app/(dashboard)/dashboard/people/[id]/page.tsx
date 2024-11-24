import PeopleDetailsComp from '../../../../../components/DashboardComp/People/PeopleDetailsComp'

export const metadata = {
  title: 'BeautySpace NG | People',
  description: 'We connect customers to beauty professionals accross Nigeria',
}

export default function Page({ params }) {
  return <PeopleDetailsComp id={params.id} />
}
