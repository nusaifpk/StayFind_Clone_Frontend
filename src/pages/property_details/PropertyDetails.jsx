import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PropertyDetails.css';
import Button from 'react-bootstrap/esm/Button';
import { differenceInCalendarDays } from "date-fns";
import { toast } from 'react-hot-toast';
import userInstance from '../../aaxios_instance/UserAxios';
import Rating from '@mui/material/Rating';
import tempLogo from '../../assets/temporary-profile.png'
import FavoriteIcon from '@mui/icons-material/Favorite';



const PropertyDetails = () => {

  const finalDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'short' }).format(new Date());
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const [property, setProperty] = useState(null);
  const [overallrating, setOverallrating] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [checkIn, setCheckIn] = useState(finalDate);
  const [checkOut, setCheckOut] = useState('');
  const [guest, setGuest] = useState(1);
  const [model, setModel] = useState(false);
  const [favorites, setFavorites] = useState([]);

  let numOfNights = 0;
  if (checkIn && checkOut) {
    numOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await userInstance.get(`/api/users/properties/${id}`);
        setProperty(response.data.data);

        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await userInstance.get(`/api/users/properties/${id}/review`);
        setReviews(response.data.data);
        setReviewCount(response.data.dataCount);
        setOverallrating(response.data.overallRating)
        console.log(response);
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchProperty();
    fetchReviews();
  }, [id]);

  const toggleModel = () => {
    setModel(!model);
  }

  const handleCopyLink = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url)
      .then(() => {
        toast('URL Copied!', {
          icon: '🔗',
        });
      })
      .catch((error) => {
        console.log("Error copy url...!", error);
      });
  }

  const handleShareWhatsApp = () => {
    const txt = "Hey, Check this property : ";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(txt + url)}`;
    window.open(whatsappUrl);
    navigator.clipboard.writeText(url);
  };

  const handleSave = async (id) => {
    try {
      let updatedFavorites = [...favorites];
      if (updatedFavorites.includes(id)) {
        updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
        await userInstance.delete(`/api/users/wishlist/${userId}`, { data: { propertyId: id } });
        localStorage.removeItem('favorites', JSON.stringify(updatedFavorites));
        toast("Item removed...");
      } else {
        updatedFavorites.push(id);
        await userInstance.post(`/api/users/wishlist/${userId}`, { propertyId: id });
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        toast.success("Item added to wishlist...❤︎");
      }

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while toggling favorite.");
      }
    }
  };

  const totalAmount = property ? (property.price * numOfNights + numOfNights * 100 + numOfNights * 480 + numOfNights * 413).toLocaleString() : 0;

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      toast.error("Required dates to proceed...!");
    } else if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-Out date must be after the Check-In date");
    } else {
      navigate(`/confirm/${id}?guest=${guest}&checkIn=${checkIn}&checkOut=${checkOut}&numOfNights=${numOfNights}&totalAmount=${totalAmount}`);
    }
  };


  return (
    <div className='property_details_container'>
      {property ? (
        <div className='property_details'>
          <div className='test'>
            <div className='share_fav'>
              <p onClick={toggleModel}><i className='fas fa-share' /> Share</p>
              {model && (
                <div className="model">
                  <div className="overlay" onClick={toggleModel}>
                    <div className="model-content">
                      <h1>Share this place</h1>
                      <div className='model_details'>
                        <div className="model_details_left">
                          <img src={property.images[0]} alt="property" />
                        </div>
                        <div className="model_details_right">
                          <h1><b>{property.name}</b></h1>
                          <p><i className="fas fa-bed" /> {property.bedroom} Bedrooms</p>
                          <p><i className="fas fa-bath" /> {property.bathroom} Bathrooms</p>
                          <p>₹{property.price.toLocaleString()}/- <span>night</span></p>
                        </div>
                      </div>
                      <hr />
                      <div className='model_details_functions'>
                        <p onClick={handleCopyLink}><i className='fas fa-copy' /><span>&nbsp;Copy Link</span></p>
                        <p onClick={handleShareWhatsApp}><i className='fas fa-comment' /><span>&nbsp;Whatsapp Now</span></p>
                      </div>
                      <button className='close-model' onClick={toggleModel}>X</button>
                    </div>
                  </div>
                </div>
              )}
              <span
                style={{ cursor: "pointer" }}
                className={favorites.includes(property._id) ? "red" : "black"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(property._id);
                }}
              >
                <FavoriteIcon style={{height:"18px"}} />
                {favorites.includes(property._id) ? "Saved" : "Save"}
              </span>

            </div>
          </div>
          <div className="image-grid">
            <img className='image-grid-col-2 image-grid-row-2' src={property.images[0]} alt="" />
            <img src={property.images[1]} alt="" />
            <img src={property.images[2]} alt="" />
            <img src={property.images[3]} alt="" />
            <img src={property.images[4]} alt="" />
          </div>
          <h3>{property.name}</h3>
          <h5 style={{ textAlign: "start" }}>★{overallrating}</h5>
          <p className='property_location'><i className='fas fa-map-marker-alt' /> {property.location}</p>
          <p className="description"><i className="fas fa-users" /> {property.guest} Guests
            • <i className="fas fa-bed" /> {property.bedroom} Bedrooms
            • <i className="fas fa-bath" /> {property.bathroom} Bathrooms
          </p>
          <hr className='main_hr' />
          <div className='hero'>
            <div className="hero_left">
              <div className='section_container'>
                <h4 className='about_place'>About this place</h4>
                <p>{property.description}</p>
              </div>
              <hr />
              <div className='section_container'>
                <h4 className='about_place'>What this place offers</h4>
                <p><i className='fas fa-utensils' />Kitchen </p>
                <p><i className='fas fa-wifi' />Wifi</p>
                <p><i className='fas fa-swimming-pool' />Pool</p>
                <p><i className='fas fa-car' />Free Parking</p>
              </div>
            </div>
            <div className="hero_right">
              <div className="payment_container">
                <div className='payment_card'>
                  <h1>₹{property.price.toLocaleString()}/- <span>night</span></h1>
                  <hr />
                  <div className='date_section'>
                    <div className="check_in">
                      <label>Check-in</label>
                      <input type="date" min={finalDate} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </div>
                    <div className="check_out">
                      <label>Check-out</label>
                      <input type="date" min={finalDate} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                  </div>
                  <div className='booking_count'>
                    <label>Number of Guest:&nbsp;</label>
                    <input type="number" value={guest} min={1} max={property.guest} onChange={(e) => setGuest(e.target.value)} />
                  </div>
                  <hr />
                </div>
                <div className='price_details'>
                  {numOfNights > 0 && (
                    <div className='total_price'>
                      <p>{property.price.toLocaleString()} x {numOfNights} nights <span>₹{(numOfNights * property.price).toLocaleString()}/-</span></p>
                      <p>Cleaning fee <span>₹{(numOfNights * 100).toLocaleString()}/-</span></p>
                      <p>StayFind Service fee <span>₹{(numOfNights * 480).toLocaleString()}/-</span></p>
                      <p>Taxes <span>₹{numOfNights * 413}/-</span></p>
                      <hr />
                      <b> <p>Toatal (INR) <span>₹{totalAmount}/-</span></p></b>
                    </div>
                  )}
                </div>
                <Button onClick={handleReserve} variant='danger'>
                  RESERVE
                </Button>
              </div>
            </div>
          </div>
          <h2 className='review_text'>{reviewCount} Reviews</h2>
          <div className='review_grid'>
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(review.createdAt));
                const userProfileImg = review.userId.profileImg || tempLogo
                return (
                  <div className="review_section" key={review._id}>
                    <div className='profile_head'>
                      <div className='profile_image_wrapper'>
                        <img src={userProfileImg} alt={review.userId.username} />
                      </div>
                      <div className='profile_name_loc'>
                        <h6>{review.userId.username}</h6>
                        <p>India</p>
                      </div>
                    </div>

                    <p className='review_date'>
                      <Rating name="read-only" value={review.rating} size='small' readOnly sx={{ fontSize: '12px' }} />
                      &nbsp;•&nbsp;<span style={{ fontSize: "14px" }}> <b>{reviewDate}</b></span>
                    </p>
                    <p className='review'>{review.review}</p>
                  </div>
                );
              })
            ) : (
              <p>Be the first reviewer by booking this property</p>
            )}
          </div>

          <hr />
          <div className='remember_section'>
            <h2>Thinks You should know</h2>
            <div className='remember_grid'>
              <div>
                <h3>House Rules</h3>
                <p>Check-in after 12 pm</p>
                <p>Check-out before 11 am</p>
                <p>{property.guest} guest maximum</p>
              </div>
              <div>
                <h3>Safety & Property</h3>
                <p>Carbon monoxide alarm not reported</p>
                <p>Smoke alarm not reported</p>
              </div>
              <div>
                <h3>Cancellation Policy</h3>
                <p>This reservation is non-refundable.</p>
                <p>Review the Host’s full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading property details...</p>
      )}
    </div>
  );
};

export default PropertyDetails;
