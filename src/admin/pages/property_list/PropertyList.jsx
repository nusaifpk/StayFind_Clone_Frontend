import React, { useEffect, useState } from 'react';
import './PropertyList.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import adminInstance from '../../../aaxios_instance/AdminAxios';

const PropertyList = () => {

  const navigate = useNavigate()
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('')

  useEffect(() => {
    if(!localStorage.getItem('adminToken')){
        navigate('/admin_login')
    }
  },[])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await adminInstance.get(`/api/admin/properties`);
        setProperties(response.data.data);
      } catch (error) {
        console.log("Error fetching data ", error);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const searchedProperties = properties.filter(property => property.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='property_list_container'>
      <Sidebar />
      <div className="property_list_content">
        <h2>View Properties</h2>
        <input type="search" placeholder='Search here...' value={search} onChange={handleSearch} className='search_input' />
        <div className="property_list">
          {searchedProperties.length > 0? (
          searchedProperties.map((property) => (
            <div key={property._id} className="property_item">
              <div className="property_images" style={{ backgroundImage: `url(${property.images[0]})` }}></div>
              <div className="property_details">
                <h3 className="property_name">{property.name}</h3>
                <p className='property_location'><i className='fas fa-marked'/>{property.location}</p>
                <p className="property_info"><i className="fas fa-users"/> {property.guest} Guests 
                • <i className="fas fa-bed"/> {property.bedroom} Bedrooms
                • <i className="fas fa-bath"/> {property.bathroom} Bathrooms
                </p>
                <div className="property_price">
                  <p className="new_price">₹{property.price.toLocaleString()}/- <span className='span_price'>night</span></p>
                </div>
                <div className="navigate_buttons">
                  <Button variant='success' className='navigate_button' onClick={()=> navigate(`/properties_list/${property._id}?name=${property.name}`)}>View Product</Button>
                </div>
              </div>
            </div>
          )) ):( <p><center>No properties found...</center></p>)
        }
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
