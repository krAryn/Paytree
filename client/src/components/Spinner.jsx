import React from 'react'
import {HashLoader} from 'react-spinners'

const Spinner = () => {
  return (
    <div className='flex justify-center items-center h-[100vh]'>
      <HashLoader size={150} color={'green'} />
    </div>
  )
}

export default Spinner
