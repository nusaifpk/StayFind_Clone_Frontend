import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MoonLoader } from "react-spinners";
import adminInstance from '../../../aaxios_instance/AdminAxios';

const EditProperty = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin_login');
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState({
    name: '',
    category: '',
    location: '',
    guest: '',
    bedroom: '',
    bathroom: '',
    description: '',
    images: [],
    price: ''
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await adminInstance.get(`/api/admin/properties/${id}`);
        setProperty(response.data.data);
        console.log("res: ", response);
      }
      catch (error) {
        console.log("Error fetching property detail: ", error);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', property.name);
      formData.append('category', property.category);
      formData.append('location', property.location);
      formData.append('guest', property.guest);
      formData.append('bedroom', property.bedroom);
      formData.append('bathroom', property.bathroom);
      formData.append('description', property.description);

      for (let i = 0; i < property.images.length; i++) {
        formData.append('images', property.images[i]);
      }
      
      formData.append('price', property.price);

      const response = await adminInstance.put(`/api/admin/property/${id}`, formData);
      toast.success(response.data.message);
      navigate(`/properties_list`);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      toast.error("Error updating property.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/properties_list/${property._id}?name=${property.name}`);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProperty(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProperty((prevState) => ({
      ...prevState,
      images: files
    }));
  };

  return (
    <div className='property_container'>
      <div><Sidebar /></div>
      {property && (
        <div className='add_property' key={property._id}>
          <h2>Edit Property</h2>
          <form className='form'>
            <input type="text" id='name' value={property.name} onChange={handleChange} className='input_style' required />
            <input type="text" id='category' value={property.category} onChange={handleChange} className='input_style' required />
            <input type="text" id='location' value={property.location} onChange={handleChange} className='input_style' required />
            <div className='input_property_row'>
              <input type="text" id='guest' value={property.guest} onChange={handleChange} className='input_style2' required />
              <input type="text" id='bedroom' value={property.bedroom} onChange={handleChange} className='input_style2' required />
              <input type="text" id='bathroom' value={property.bathroom} onChange={handleChange} className='input_style2' required />
            </div>
            <textarea id='description' value={property.description} onChange={handleChange} className='textarea_style' required />
            <input type="file" id='images' accept='image/*' onChange={handleFileChange} className='file_input_style' multiple />
            <input type="text" id='price' value={property.price} onChange={handleChange} className='input_style' required />
            <div className='edit_delete_btn'>
              <Button variant='success' className='submit_button_style' onClick={handleSave}>Save {loading && (
                <div className='spinner-overlay'>
                  <MoonLoader color='#e15b64' loading={loading} size={40} />
                </div>
              )}</Button>
              <Button type='button' variant='danger' className='submit_button_style' onClick={handleCancel}>Exit</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProperty;
