import React, { useEffect, useState } from 'react';
import './Property.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import cities from '../../assets/all_cities';
import userInstance from '../../aaxios_instance/UserAxios';
import { TextField, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Property = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [overallRating, setOverallRating] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [suggestions, setSuggestions] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('userToken');

    const handleExploreButton = () => {
        setSearch('');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userInstance.get(`/api/users/properties/`);
                setProperties(response.data.data);
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                setFavorites(storedFavorites);

                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const locationQuery = searchParams.get('location');
        const categoryQuery = searchParams.get('category');
        if (locationQuery) {
            setSearch(locationQuery);
        }
        if (categoryQuery) {
            setCategory(categoryQuery);
        }
    }, [location.search]);

    useEffect(() => {
        if (search.trim() === '') {
            setSuggestions([]);
            return;
        }

        const filteredCities = cities.filter((city) =>
            city.city.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filteredCities.slice(0, 5));
    }, [search]);

    const toggleFavorite = async (id) => {
        try {
            if (!userToken) {
                toast.error("Login required...!");
                navigate('/login');
                return;
            }

            let updatedFavorites = [...favorites];
            if (updatedFavorites.includes(id)) {
                updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
                await userInstance.delete(`/api/users/wishlist/${userId}`, { data: { propertyId: id } });
                toast("Item removed ...");

                localStorage.removeItem('favorites', JSON.stringify(updatedFavorites));
            } else {
                updatedFavorites.push(id);
                await userInstance.post(`/api/users/wishlist/${userId}`, { propertyId: id });
                toast.success("Item added to wishlist...❤︎");

                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
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

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredProperties = properties.filter(property => {
        const matchesLocation = property.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || property.category === category;
        return matchesLocation && matchesCategory;
    });

    const indexOfLastProperty = currentPage * itemsPerPage;
    const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='main_property_container'>
            <h2 className='main_text'>Available Now</h2>
            <TextField type="search" list='city-suggestions' value={search} onChange={handleSearch} className='search_property' label="Search Location" variant="outlined" />
            <datalist id="city-suggestions">
                {suggestions.map((city) => (
                    <option key={city.id} value={`${city.city}, ${city.state}`} />
                ))}
            </datalist>
            <div className="property">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="card">
                            <div className="skeleton" />
                            <div className="details">
                                <div className="skeleton-details" />
                                <div className="skeleton-text" />
                                <div className="skeleton-text" />
                            </div>
                        </div>
                    ))
                ) : currentProperties.length > 0 ? (
                    currentProperties.map((property) => (
                        <div key={property._id} className="card" onClick={() => navigate(`/properties/${property._id}?name=${property.name}&location=${property.location}`)}>
                            <div className="card_img_container">
                                <img src={property.images[0]} alt={property.name} className='image' />
                                <IconButton
                                    className={favorites.includes(property._id) ? "favorite_icon red" : "favorite_icon black"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(property._id);
                                    }}
                                    aria-label="add to favorites"
                                >
                                    <FavoriteIcon />
                                </IconButton>
                            </div>
                            <div className="details">
                                <h3 className="name">{property.name}</h3>
                                <h6>★{property.overallRating}</h6>
                                <p className='property_location'><i className='fas fa-map-marker-alt' /> {property.location}</p>
                                <p className="description"><i className="fas fa-users" /> {property.guest} Guests
                                    • <i className="fas fa-bed" /> {property.bedroom} Bedrooms
                                    • <i className="fas fa-bath" /> {property.bathroom} Bathrooms
                                </p>
                                <div className="price">
                                    <span className="new-price">₹{property.price.toLocaleString()}/- <span className='span_price'>night</span></span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='no_properties'>
                        <p>No properties found...</p>
                        <button className='explore_btn' onClick={handleExploreButton}>EXPLORE OTHER</button>
                    </div>
                )}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredProperties.length / itemsPerPage) }).map((_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)} className="page-link">{index + 1}</button>
                ))}
            </div>
        </div>
    );
};

export default Property;

