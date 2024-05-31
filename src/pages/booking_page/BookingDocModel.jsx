import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import stayfindLogo from '../../assets/stayfind.png'; 

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 5,
  },
  subheader: {
    fontSize: 12,
    marginBottom: 5,
  },
  content: {
    fontSize: 10,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

const Name = localStorage.getItem('name')
const Phone = localStorage.getItem('phone')
const Email = localStorage.getItem('email')

const BookingDocument = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Image src={stayfindLogo} style={styles.logo} />
          <Text style={styles.subheader}>Booking Details</Text>
        </View>
        <View style={styles.content}>
          <Text><strong>Name:</strong> {Name}</Text>
          <Text><strong>Phone:</strong> {Phone}</Text>
          <Text><strong>Email:</strong> {Email}</Text>
          <Text><strong>Hotel Name:</strong> {booking.hotelName}</Text>
          <Text><strong>Booking ID:</strong> {booking.bookingId}</Text>
          <Text><strong>Check-in Date:</strong> {booking.checkInDate}</Text>
          <Text><strong>Check-out Date:</strong> {booking.checkOutDate}</Text>
          <Text><strong>Number of Guests:</strong> {booking.numberOfGuests}</Text>
          <Text><strong>Amount:</strong> ₹{booking.amount}/- {booking.currency}</Text>
          <Text><strong>Payment Date:</strong> {booking.paymentDate}</Text>
          <Text><strong>Payment Time:</strong> {booking.paymentTime}</Text>
          <Text><strong>Receipt:</strong> {booking.receipt}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default BookingDocument;
