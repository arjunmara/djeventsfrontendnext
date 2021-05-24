
import {useRouter} from 'next/router'
import {API_URL} from '@/config/index'
import Layout from '@/components/Layout'
export default function EventPage({evt}) {
  const router = useRouter()
  return (
    <Layout title="Events">
      <h1>{evt.name}</h1>
      <h3>{router.query.slug}</h3>
    </Layout>
  );
}

export async function getStaticPaths(){
  const res = await fetch(`${API_URL}/api/events`)
  const events = await res.json()


  const paths = events.map(evt => (
    {params: {slug: evt.slug}}
  ))
  return {
    paths,
    fallback: true
  }
}


export async function getStaticProps ({params:{slug}}){
  const res = await fetch(`${API_URL}/api/events/${slug}`)
  const events = await res.json()
  return {
    props:{
      evt: events[0]
    },
    revalidate: 1
  }
}


// export async function getServerSideProps ({query:{slug}}){
//   const res = await fetch(`${API_URL}/api/events/${slug}`)
//   const events = await res.json()
//   return {
//     props:{
//       evt: events[0]
//     }
//   }
// }
