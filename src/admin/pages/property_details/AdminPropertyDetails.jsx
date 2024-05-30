import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './AdminPropertyDetails.css'
import { toast } from 'react-hot-toast';
import Button from 'react-bootstrap/esm/Button'
import Sidebar from '../../components/sidebar/Sidebar'
import adminInstance from '../../../aaxios_instance/AdminAxios'

const AdminPropertyDetails = () => {
  
  const navigate = useNavigate()
  const {id} = useParams()
  const [property,setProperty] = useState(null)

  useEffect(() => {
    if(!localStorage.getItem('adminToken')){
        navigate('/admin_login')
    }
  },[])

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try{
        const response = await adminInstance.get(`/api/admin/properties/${id}`)
        setProperty(response.data.data)
        console.log(response.data.data);  
      }
      catch(error){
        console.log("Error fetching property: ",error);
      }
    }
    fetchPropertyDetails()
  },[id])


  const handleDelete = async (_id) => {
    try{      
      const confirm = window.confirm("Are you sure want to delete...?")
      if(confirm){
        await adminInstance.delete(`/api/admin/property/${_id}`)
        toast.success("Property deleted..")
        navigate('/properties_list')
      }
    }
    catch(error){
      console.log('Error deleting property: ',error);
    }
  }

  return (
    <div className='property_list_container'>
      <Sidebar />
      {property ? (
        <div className='main_content'>
          <div className='name_section'>
            <h1>{property.name}</h1>
          </div>
          <div className='image_container'>
            <img src={property.images[0]} className='property_details_image' alt="" />
          </div>
          <div className='property_info'>
            <p><i className='fas fa-marked'/><i className='fas fa-map-marker-alt'/> {property.location}</p>
            <p><i className="fas fa-users"/> {property.guest} Guests • <i className="fas fa-bed"/> {property.bedroom} Bedrooms • <i className="fas fa-bath"/> {property.bathroom} Bathrooms</p>
          </div>
          <div className="edit_delete_btns">
            <Button className='edit_btn' variant='success' onClick={() =>navigate(`/edit_property/${id}`)}><i className='fas fa-edit'/> EDIT</Button>
            <Button className='delete_btn' variant='danger' onClick={() => handleDelete(property._id)}><i className='fas fa-trash' /> DELETE</Button>
          </div>
        </div>
        ) : ( <p> NO propery Found...!</p> )}
    </div>
  );
  
}

export default AdminPropertyDetails