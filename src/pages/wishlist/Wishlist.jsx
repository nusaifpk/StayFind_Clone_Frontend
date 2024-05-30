import React, { useEffect, useState } from 'react';
import './Wishlist.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-hot-toast';
import userInstance from '../../aaxios_instance/UserAxios';
import Swal from 'sweetalert2';

const Wishlist = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      navigate('/');
    }
  }, [navigate]);

  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await userInstance.get(`/api/users/wishlist/${userId}`);
        setWishlist(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWishlist();
  }, [userId]);

  const handleDeleteSingle = async (id) => {
    try {
      await userInstance.delete(`/api/users/wishlist/${userId}`, { data: { propertyId: id } });
      localStorage.removeItem('favorites');
      setWishlist(wishlist.filter((item) => item._id !== id));
      toast.success('Property removed..');
    } catch (error) {
      console.log("Error removing from wishlist: ", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await userInstance.delete(`/api/users/wishlist/all/${userId}`);
      localStorage.removeItem('favorites');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Removed all properties",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        setWishlist([]);
      }, 1000); 
    } catch (error) {
      console.log("Error removing all properties from wishlist: ", error);
    }
  };

  return (
    <div className='main_wishlist'>
      <h1>Wishlist</h1>
      <hr />
      <div className='button_div'>
            {wishlist.length > 0 && 
                <Button variant='danger' onClick={handleDeleteAll} className='remove_all_button'>Remove All&nbsp;<i className='fas fa-trash' /></Button>
            }
        </div>
      <div className="wishlist">
        {wishlist.length > 0 ? (
          wishlist.map((property) => (
            <div key={property._id} className="wishlist_card">
              <div className="card_img_container">
                <img src={property.images[0]} className='wishlist_image' alt={property.name} />
              </div>
              <div className="details">
                <h3 className="name">{property.name}</h3>
                <p className='property_location'><i className='fas fa-map-marker-alt' /> {property.location}</p>
                <p className="description"><i className="fas fa-users" /> {property.guest} Guests
                  • <i className="fas fa-bed" /> {property.bedroom} Bedrooms
                  • <i className="fas fa-bath" /> {property.bathroom} Bathrooms
                </p>
                <div className="price">
                  <span className="new-price">₹{property.price.toLocaleString()}/- <span className='span_price'>night</span></span>
                </div>
                <div className='btn_section'>
                  <Button variant='primary' style={{ width: "120px" }} onClick={() => navigate(`/properties/${property._id}?name=${property.name}&location=${property.location}`)}>
                    <i className='fas fa-trash' />&nbsp;View
                  </Button>
                  <Button variant='danger' style={{ width: "120px" }} onClick={() => handleDeleteSingle(property._id)}>
                    <i className='fas fa-trash' />&nbsp;Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='empty_wishlist'>
            <h5>No saves yet</h5>
            <p>As you search, click the heart icon to save your favourite places and Experiences to a wishlist</p>
            <button className='explore_btn' onClick={() => navigate('/properties')}>Start Exploring</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
