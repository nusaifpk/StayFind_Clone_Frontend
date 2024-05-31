import React, { useEffect } from 'react'
import './Trip.css'
import { useNavigate } from 'react-router-dom'

const Trip = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className='trip_container'>
      <h1>Trips</h1>
      <hr />
      <div className='main_trip'>
        <h5> No saves yet</h5>
        <p>As you search, click the heart icon to save your favourite places and Experiences to a trip</p>
        <button className='explore_btn' onClick={() => navigate('/properties')}>Start Exploring</button>
      </div>
    </div>
  )
}

export default Trip