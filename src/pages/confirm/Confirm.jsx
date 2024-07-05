import React, { useEffect, useState } from 'react'
import "./Confirm.css"
import Select from 'react-select';
import options from '../../assets/all_payment_options';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import userInstance from '../../aaxios_instance/UserAxios';
import { SyncLoader } from 'react-spinners';

const Confirm = () => {

  const navigate = useNavigate()
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams()
  const [property, setProperty] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentAddress, setPaymentAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const StayfindEmail = process.env.REACT_APP_EMAIL_USER
  const StayfindPhone = process.env.REACT_APP_PHONE_NUMBER
  const RazorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID

  const guest = searchParams.get('guest')
  const numOfNights = searchParams.get('numOfNights')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  //why total_amount not called
  const total_amount = searchParams.get('totalAmount')

  const CurrentDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(new Date());
  const CurrentTime = new Intl.DateTimeFormat('en-CA', { timeStyle: 'short' }).format(new Date());

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await userInstance.get(`/api/users/properties/${propertyId}`);
        setProperty(response.data.data);
      }
      catch (error) {
        console.error('Error fetching property details:', error);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const totalAmount = property ? property.price * numOfNights + numOfNights * 100 + numOfNights * 480 + numOfNights * 413 : 0;

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value)
  }

  const sendPaymentSuccessEmail = async (
    userId,
    email,
    amount,
    currency,
    receipt,
    customerName,
    hotelName,
    bookingId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    paymentDate, 
    paymentTime,
    customerSupportEmail,
    customerSupportPhone) => {
    try {
      console.log(`Sending email to ${email} with amount ${amount}, currency ${currency}, receipt ${receipt}`);
      const response = await userInstance.post(`/api/users/payment/success`, {
        userId,
        email,
        amount,
        currency,
        receipt,
        customerName,
        hotelName,
        bookingId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        paymentDate,
        paymentTime,
        customerSupportEmail,
        customerSupportPhone
      });
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  const handlePayment = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Login required to proceed with the payment.');
      navigate('/login');
      return;
    }

    setLoading(true)
    setTimeout(async () => {
      try {
        const userId = localStorage.getItem('userId')
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        const phone = localStorage.getItem('phone');
        const receipt = `RCPT_${Date.now()}`;

        const response = await userInstance.post(`/api/users/payment`, {
          amount: totalAmount * 100,
          currency: "INR",
          receipt
        });

        const { data } = response.data;

        const options = {
          key: RazorpayKey,
          amount: data.amount,
          currency: data.currency,
          name: "Stay Find",
          description: "Test Transaction",
          image: property.images[0],
          booking_id: data.id,
          handler: async (response) => {
            if (response.razorpay_payment_id) {
              await sendPaymentSuccessEmail(userId, email, totalAmount, "INR", receipt, name, property.name, data.id, formatDate(checkIn), formatDate(checkOut), guest, formatDate(CurrentDate), CurrentTime, StayfindEmail, StayfindPhone);
              navigate(`/review?propertyId=${propertyId}`)
            } else {
              toast.error("Payment failed or incomplete. Please try again.");
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzPay = new window.Razorpay(options);
        rzPay.open();

      }
      catch (error) {
        console.error('Payment failed:', error);
        toast.error("Payment failed. Please try again.");
      }
      finally {
        setLoading(false)
      }
    }, 2000);
  };





  return (
    <div className='payment_page_container'>
      <h1><i className='fas fa-chevron-left' style={{ cursor: "pointer" }} onClick={() => navigate(`/properties/${property._id}?name=${property.name}&location=${property.location}`)} /> Confirm and Pay</h1>
      {property ? (
        <div className='hero_payment'>
          <div className='hero_payment_left'>
            <div>
              <h2>Your trip</h2>
              <div className='trip_section'>
                <p>Dates</p>
                <p><u>Edit</u></p>
              </div>
              <p>{formatDate(checkIn)} - {formatDate(checkOut)}</p>
              <div className='trip_section'>
                <p>Days</p>
                <p><u>Edit</u></p>
              </div>
              <p>{numOfNights}</p>
              <div className='trip_section'>
                <p>Guest</p>
                <p><u>Edit</u></p>
              </div>
              <p>{guest}</p>
            </div>
            <hr />
            <div className='pay_section'>
              <h2>Pay with</h2>
              <div className='payment_icons'>
                <img className='visa' src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="" />
                <img className='rupay' src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="" />
                <img className='upi' src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png" alt="" />
              </div>
            </div>
            <div className='payment_option'>
              <Select placeholder='Choose Your Payment' options={options} value={paymentMethod} onChange={handlePaymentMethod} required />
              <input type="text" value={paymentAddress} onChange={(e) => setPaymentAddress(e.target.value)} placeholder='Virtual Payment Address' required />
            </div>
            <div className='sub_text'>
              <p>E.g. yourusername@bank</p>
            </div>
          </div>


          <div className='hero_payment_right'>
            <div className='payment_card_section'>
              <div className='payments_card'>
                <div className='card_content_left'>
                  <img className='property_image' src={property.images[0]} alt="" />
                </div>
                <div className='card_content_right'>
                  <h3>{property.name}</h3>
                  <p><i className='fas fa-map-marker-alt' /> {property.location}</p>
                </div>
              </div>
              <hr />
              <div className='price_details'>
                <h2>Price Details</h2>
                <div className='total_price'>
                  <p>{property.price.toLocaleString()} x {numOfNights} nights <span>₹{(numOfNights * property.price).toLocaleString()}/-</span></p>
                  <p>Cleaning fee <span>₹{numOfNights * 100}/-</span></p>
                  <p>StayFind Service fee <span>₹{numOfNights * 480}/-</span></p>
                  <p>Taxes <span>₹{numOfNights * 413}/-</span></p>
                  <hr />
                  <b> <p>Total (INR) <span>₹{totalAmount.toLocaleString()}/-</span></p></b>
                  <Button style={{ width: '100%' }} variant='danger' onClick={handlePayment}>{loading ? (
                    <SyncLoader color="#fff" loading={loading} size={5} style={{ alignItems: "center" }} />
                  ) : <div>Request to Book</div>}</Button>
                </div>

              </div>

            </div>
          </div>
        </div>
      ) : (<p> property not found ...!</p>)}
    </div>
  )
}

export default Confirm