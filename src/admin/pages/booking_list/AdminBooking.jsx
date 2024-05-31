import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import './AdminBooking.css';
import adminInstance from '../../../aaxios_instance/AdminAxios';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await adminInstance.get('/api/admin/bookings');
        setBookings(response.data.data.map(booking => ({
          ...booking,
          checkInDate: formatDate(booking.checkInDate),
          checkOutDate: formatDate(booking.checkOutDate),
          paymentDate: formatDate(booking.paymentDate),
        })));
        console.log(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const searchedUser = bookings.filter(booking => {
    const NameCheck = booking.user.name.toLowerCase().includes(search.toLowerCase());
    const BookingIdCheck = booking.bookingId.includes(search)
    return NameCheck || BookingIdCheck;
  })

  return (
    <div className='booking_list_container'>
      <Sidebar />
      <div className='main_content'>
        <h1 className='booking_header'>Booking List</h1>
        <input type="search" placeholder='Search here..' value={search} onChange={handleSearch} className='search_input' />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className='booking_table'>
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>User Details</th>
                <th>Hotel Name</th>
                <th>Booking ID</th>
                <th>CheckIn Date</th>
                <th>CheckOut Date</th>
                <th>Reciept ID</th>
                <th>Amount Paid</th>
                <th>Payment Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {searchedUser.map((booking, index) => (
                <tr key={booking._id} className='booking_row'>
                  <td>{index + 1}</td>
                  <td><strong>{booking.user.name}</strong><br />{booking.user.email}<br />{booking.user.phone}</td>
                  <td>{booking.hotelName}</td>
                  <td>{booking.bookingId}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td>{booking.receipt}</td>
                  <td><strong>₹{booking.amount}/-</strong></td>
                  <td>{booking.paymentDate} <br /> {booking.paymentTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminBooking;
