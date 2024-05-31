import React from 'react'
import './Footer.css'
import logo from "../../assets/stayfind.png"
import { useNavigate } from 'react-router-dom'
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

const Footer = () => {

  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='whatsapp' />
          </a>
          <a className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='facebook' />
          </a>
          <a className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='twitter' />
          </a>
          <a className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='google' />
          </a>
          <a className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='instagram' />
          </a>

        </div>
      </section>

      <section className='main_footer'>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4 '>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' className='me-3' />
                <img style={{ maxHeight: "40px", cursor: "pointer" }} src={logo} alt="" />
              </h6>
              <p className='footer_description'>
                Traveling should be about experiencing new places, not stressing over accommodations. That's where StayFind comes in. We're here to revolutionize the way you book stays by offering a seamless, stress-free experience from start to finish. Say goodbye to endless searching and hello to finding your perfect stay with ease.
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4 useful_links'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p onClick={() => navigate('/')}>Home</p>
              <p onClick={() => navigate('/properties')}>Properties</p>
              <p onClick={() => navigate('/about')}>About</p>
              <p onClick={() => navigate('/contact')}>Contact</p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4 useful_links'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>Pricing</p>
              <p>Setting</p>
              <p>Booking</p>
              <p>Help</p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon color='secondary' icon='map-marker-alt' className='me-2' />
                Kinfra, Calicut, India
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                contactstayfind@gmail.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> +91 9497630421
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-3' /> +91 9497630421
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © {year} Copyright:
        <a onClick={() => navigate('/')} className='text-reset fw-bold'>
          StayFind.com
        </a>
      </div>
    </MDBFooter>
  )
}

export default Footer