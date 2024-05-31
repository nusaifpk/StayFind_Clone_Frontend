import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import './Booking.css';
import { useNavigate } from 'react-router-dom';
import userInstance from '../../aaxios_instance/UserAxios';
import BookingDocument from './BookingDocModel';
import stayfind from '../../assets/stayfind.png';
import Swal from 'sweetalert2';

const Booking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const Name = localStorage.getItem('name');
  const Phone = localStorage.getItem('phone');
  const Email = localStorage.getItem('email');

  const fetchBookings = async () => {
    try {
      const response = await userInstance.get(`/api/users/booking/${userId}`);
      setBookings(response.data.data);
    } catch (error) {
      console.log("Error while fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmClick = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You can't recover that after deleted...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#dc3545",
      confirmButtonColor: "#28a745"
    });
  };

  const handleDelete = async (booking) => {
    const bookingId = booking._id;
    console.log("Booking ID:", bookingId);
    try {
      const confirmResult = await handleConfirmClick();
      if (confirmResult.isConfirmed) {
        await userInstance.put(`/api/users/booking/${userId}`, { bookingId: bookingId });
        Swal.fire("Deleted", "Your file has been deleted", 'success');
        console.log("Booking deleted successfully.");
        setTimeout(() => {
          fetchBookings();
        }, 1000);
      } else {
        console.log("Deletion canceled.");
        Swal.fire("Cancelled", "Your booking is not deleted", 'error');
      }
    } catch (error) {
      console.log("Error deleting booking:", error);
    }
  };

  return (
    <div className='booking_container'>
      <h1>Bookings</h1>
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div key={index} className="bill-container">
            <div className='booking_header'>
              <img src={stayfind} alt="" className='logo' />
              <h1>Kinfra, Calicut, India</h1>
              <p>{process.env.REACT_APP_PHONE_NUMBER} - {process.env.REACT_APP_EMAIL_USER} - www.stayfind.com</p>
            </div>
            <hr />
            <h5>BILL TO</h5>
            <div>
              <div>
                <p><strong>Name:</strong> {Name}</p>
                <p><strong>Phone:</strong> {Phone}</p>
                <p><strong>Email:</strong> {Email}</p>
              </div>
              <div className="bill-details">
                <p><strong>Hotel Name:</strong> {booking.hotelName}</p>
                <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                <p><strong>Number of Guests:</strong> {booking.numberOfGuests}</p>
                <p><strong>Amount:</strong> ₹{booking.amount}/- {booking.currency}</p>
                <p><strong>Payment Date:</strong> {booking.paymentDate}</p>
                <p><strong>Payment Time:</strong> {booking.paymentTime}</p>
                <p><strong>Receipt:</strong> {booking.receipt}</p>
              </div>
              <button onClick={() => handleDelete(booking)} className='Wish_Dlete_button'>Delete</button>
              <PDFDownloadLink document={<BookingDocument booking={booking} />} fileName={`booking_invoice_${booking.bookingId}.pdf`}>
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : 'Download'
                }
              </PDFDownloadLink>
            </div>
          </div>
        ))
      ) : (
        <div className='main_booking'>
          <h5>No bookings yet</h5>
          <p>As you search, click the heart icon to save your favourite places and experience a good booking</p>
          <button className='explore_btn' onClick={() => navigate('/properties')}>Start Exploring</button>
        </div>
      )}
    </div>
  );
};

export default Booking;
