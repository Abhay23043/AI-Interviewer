import React from 'react'

import Navbar from '../components/Navbar'


import Footer from '../components/Footer';
import HomeBody from '../components/HomeBody';




const Home = () => {

  return (
    <div className='home-body'>
      <Navbar />

      <HomeBody />

      <Footer />

    </div >


  )
}

export default Home