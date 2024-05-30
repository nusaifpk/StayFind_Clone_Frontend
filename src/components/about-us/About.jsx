import React from 'react'
import "./About.css"
import logo from "../../assets/stayfind.png"
import { useNavigate } from 'react-router-dom'

const About = () => {
    
    const navigate = useNavigate()
    
  return (
    <div className="about_body">
        <div className='about_container'>
            <div className='about_nav'>
                <p><span onClick={() => navigate('/')}>Home</span> <i className='fas fa-arrow-right'/> About us</p>
            </div>
            <div className='logo_container'>
                <img className="logo" src={logo} alt="" />
                <h5>About Us</h5>
            </div>
            <div className='text_container'>
                <h4>✨ Why StayFind?</h4>
                <p>Traveling should be about experiencing new places, not stressing over accommodations. That's where StayFind comes in. We're here to revolutionize the way you book stays by offering a seamless, stress-free experience from start to finish. Say goodbye to endless searching and hello to finding your perfect stay with ease.</p>
                <h4>✨ What Makes StayFind Different?</h4>
                <p>At StayFind, we're more than just a booking platform. We're your trusted travel companion, dedicated to simplifying the entire process of finding accommodations. With our user-friendly interface and extensive database of properties, you'll find everything you need to plan your next adventure, all in one place.</p>
                <h4>✨ Our Mission</h4>
                <p>Our mission at StayFind is simple: to make travel planning effortless and enjoyable for everyone. Whether you're jet-setting across the globe or exploring your own backyard, we're committed to providing you with the tools and resources you need to discover the perfect stay, every time.</p>
                <h4>✨ How StayFind Works</h4>
                <p>Using StayFind is as easy as 1-2-3. Simply enter your destination, select your dates, and let us do the rest. With our advanced search filters and personalized recommendations, finding the ideal accommodation has never been easier. Plus, with secure booking and instant confirmation, you can book with confidence, knowing that your stay is guaranteed.</p>
                <h4>✨ Experience the StayFind Difference</h4>
                <p>Join the millions of travelers who rely on StayFind for their accommodation needs. Whether you're planning a weekend getaway, a family vacation, or a business trip, we're here to help you unlock unforgettable travel experiences. Discover your perfect stay with StayFind today!</p>
            </div>
        </div>
    </div>
  )
}

export default About