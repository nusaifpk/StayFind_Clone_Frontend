import React, { useState } from 'react';
import './Contact.css';
import { toast } from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import userInstance from '../../aaxios_instance/UserAxios';
import Swal from 'sweetalert2';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userInstance.post('http://localhost:5000/api/users/enquiry', { name, email, message });
      console.log(response);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Email sent succesfully",
        showConfirmButton: false,
        timer: 1000
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Error sending email');
    }
    setLoading(false);
  };

  const handleInputClick = () => {
    const userName = localStorage.getItem('name');
    const userEmail = localStorage.getItem('email');
    
    if (userName) setName(userName);
    if (userEmail) setEmail(userEmail);
  };

  return (
    <div className="contact_body">
      <div className="contact_container">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact_form">
          <div className="form_group">
            <label htmlFor="name" className="contact_form_label">Name:</label>
            <input
              placeholder="Name"
              className="contact_form_input"
              type="text"
              id="name"
              value={name}
              onClick={handleInputClick}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form_group">
            <label htmlFor="email" className="contact_form_label">Email:</label>
            <input
              placeholder="Email"
              className="contact_form_input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form_group">
            <label htmlFor="message" className="form_label">Message:</label>
            <textarea
              placeholder="Type your message here..."
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="contact_form_textarea"
              required
            ></textarea>
          </div>
          <button type="submit" className="contact_form_button">
            {loading ? (
              <SyncLoader color="#fff" loading={loading} size={5} />
            ) : (
              'SUBMIT'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
