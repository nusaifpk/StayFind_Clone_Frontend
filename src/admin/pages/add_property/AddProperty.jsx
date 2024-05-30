import React, { useEffect, useState } from 'react'
import './AddProperty.css'
import { toast } from 'react-hot-toast';
import Button from 'react-bootstrap/esm/Button'
import Sidebar from '../../components/sidebar/Sidebar'
import { MoonLoader } from "react-spinners"
import { useNavigate } from 'react-router-dom'
import cities from "../../../assets/all_cities"
import adminInstance from '../../../aaxios_instance/AdminAxios'

const AddProperty = () => {

    const navigate = useNavigate()
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [propertyData, setPropertyData] = useState({
        name: '',
        category: '',
        location: '',
        guest: '',
        bedroom: '',
        bathroom: '',
        description: '',
        images: [],
        price: ''
    })

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'images') {
            const files = e.target.files
            const imageArray = [];
            for (let i = 0; i < files.length; i++) {
                imageArray.push(files[i])
            }
            setPropertyData((prevData) => ({
                ...prevData,
                images: imageArray,
            }))
        }
        else {
            setPropertyData((prevData) => ({
                ...prevData,
                [id]: value,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();

            formData.append('name', propertyData.name);
            formData.append('category', propertyData.category);
            formData.append('location', propertyData.location);
            formData.append('guest', propertyData.guest);
            formData.append('bedroom', propertyData.bedroom);
            formData.append('bathroom', propertyData.bathroom);
            formData.append('description', propertyData.description);

            for (let i = 0; i < propertyData.images.length; i++) {
                formData.append('images', propertyData.images[i])
            }
            
            formData.append('price', propertyData.price);

            await adminInstance.post(`/api/admin/property`,formData, {headers: {"Content-Type": "multipart/form-data"}})
            toast.success("Property added Successfully...");


            // Clear form after success
            setPropertyData({
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
            setLoading(false)
        }
        catch (error) {
            console.error("Error adding property:", error);
            toast.error("Error adding property..");
        }
    }

    useEffect(() => {
        if (propertyData.location === '') {
            setSuggestions([])
            return
        }
        const filteredCities = cities.filter((city) =>
            city.city.toLowerCase().includes(propertyData.location.toLowerCase())
        );
        setSuggestions(filteredCities.slice(0, 5))
    }, [propertyData.location])

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            navigate('/admin_login')
        }
    }, [])


    return (
        <div className='property_container'>
            <div><Sidebar /></div>
            <div className='add_property'>
                <h2>Add Property</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <input type="text" id='name' placeholder='Name' value={propertyData.name} onChange={handleChange} className='input_style' required />
                    <select id='category' value={propertyData.category} onChange={handleChange} className='input_style' required>
                        <option value="" disabled hidden className='select_placeholder'>Select</option>
                        <option value="cabin">Cabin</option>
                        <option value="farm">Farm</option>
                        <option value="lake">Lake</option>
                        <option value="pool">Pool</option>
                        <option value="room">Room</option>
                    </select>
                    <input type="text" id='location' list='location-list' placeholder='Location' value={propertyData.location} onChange={handleChange} className='input_style' required />
                    <datalist id='location-list'>
                        {suggestions.map((city) => (
                            <option key={city.id} value={`${city.city}, ${city.state}`}></option>
                        ))}
                    </datalist>
                    <div className='input_property_row'>
                        <input type="text" id='guest' placeholder='Guest' value={propertyData.guest} onChange={handleChange} className='input_style2' required />
                        <input type="text" id='bedroom' placeholder='Bedroom' value={propertyData.bedroom} onChange={handleChange} className='input_style2' required />
                        <input type="text" id='bathroom' placeholder='Bathroom' value={propertyData.bathroom} onChange={handleChange} className='input_style2' required />
                    </div>
                    <textarea id='description' placeholder='Description' value={propertyData.description} onChange={handleChange} className='textarea_style' required />
                    <input type="file" id='images' accept='image/*' onChange={handleChange} className='file_input_style' required multiple />
                    <input type="text" id='price' placeholder='Price' value={propertyData.price} onChange={handleChange} className='input_style' required />
                    <Button type='submit' variant='success' className='submit_button_style'>Add property {loading && (
                        <div className='spinner-overlay'>
                            <MoonLoader color='#e15b64' loading={loading} size={40} />
                        </div>
                    )}</Button>
                </form>
            </div>
        </div>
    )
}

export default AddProperty