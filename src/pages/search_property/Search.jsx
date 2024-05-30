import React, { useEffect, useState } from 'react';
import '../properties/Property.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import userInstance from '../../aaxios_instance/UserAxios';

const SearchProperty = () => {

    const userId = localStorage.getItem('userId')

    const navigate = useNavigate();
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const [searchedLocation, setSearchedLocation ] = useState('')

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const locationQuery = searchParams.get('location');

                setSearchedLocation(locationQuery)

                const response = await userInstance.get(`/api/users/search?location=${locationQuery}`);
                
                const data = response.data.data;
                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, [location.search]);

    const toggleFavorite = async (id) => {
        try {
            if(!localStorage.getItem('userToken')){
                navigate('/login')
            }
            let updatedFavorites = [...favorites]
            

            if (updatedFavorites.includes(id)) {
                updatedFavorites = updatedFavorites.filter((favId) => favId !== id )
                //Remove from Wishlist
                await userInstance.delete(`/api/users/wishlist/${userId}`, { data: { propertyId: id } });
            } else {

                updatedFavorites.push(id)
                // Add to wishlist
                await userInstance.post(`/api/users/wishlist/${userId}`, { propertyId: id });    
                toast.success(`Item added to wishlist...❤︎`);
            }
            setFavorites(updatedFavorites)
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error("Oops..Property already in wishlist")
        }
    };

    return (
        <div>
            <h2 className='main_text'>Available properties in <span>&nbsp;"{searchedLocation}"</span></h2>
            <div className="property">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div key={property._id} className="card" onClick={() => navigate(`/properties/${property._id}`)}>
                           <div className="card_img_container">
                                <img src={property.images[0]} alt={property.name} className='image' />
                                <span
                                    className={favorites.includes(property._id) ? "favorite_icon red" : "favorite_icon black"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(property._id);
                                    }}>
                                    &#10084;
                                </span>
                            </div>
                            <div className="details">
                                <h3 className="name">{property.name}</h3>
                                <p className='property_location'><i className='fas fa-marked' />{property.location}</p>
                                <p className="description"><i className="fas fa-users" /> {property.guest} Guests
                                    • <i className="fas fa-bed" /> {property.bedroom} Bedrooms
                                    • <i className="fas fa-bath" /> {property.bathroom} Bathrooms
                                    {/* <p className="rating">★{property.rating.toFixed(1)}</p> */}
                                </p>
                                <div className="price">
                                    <span className="new-price">₹{property.price}/- <span className='span_price'>night</span></span>
                                </div>
                                
                            </div>
                        </div>
                    ))) : (<p>Oops.. No property found...</p>)
                }
            </div>
        </div>
    );
};

export default SearchProperty;
