import {useEffect} from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import Newsletter from '../components/Newsletter'
import { useAppContext } from '../contexts/AppContext'

const Home = () => {

  const {fetchUser} = useAppContext()

  useEffect(() => {
    fetchUser()
  }, [])

  

  return (
    <div className='main-banner'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <Newsletter />
    </div>
  )
}

export default Home
