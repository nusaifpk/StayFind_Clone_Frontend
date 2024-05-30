import React, { useEffect, useState } from 'react';
import './AdminHome.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import adminInstance from '../../../aaxios_instance/AdminAxios';

const AdminHome = () => {

    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [propertyCount, setPropertyCount] = useState(0);

    useEffect(() => {
        if(!localStorage.getItem('adminToken')){
            navigate('/admin_login')
        }
    },[])

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await adminInstance.get(`/api/admin/user`);
                setUserCount(response.data.dataCount);
            } 
            catch (error) {
                console.error("Error fetching user count: ", error);
            }
        }
        
        const fetchPropertyCount = async () => {
            try{
                const response = await adminInstance.get(`/api/admin/properties`)
                setPropertyCount(response.data.dataCount);
            }
            catch(error){
                console.error("Error fetching property count: ", error);
            }
        }
        
        fetchUserCount();
        fetchPropertyCount();
    }, []);

    return (
        <div className='admin_home'>
            <div><Sidebar /></div>
            <div className="main_card">
                <div>
                    <Card 
                        className='admin_card'
                         >
                        <Card.Header>Hi Admin,<br/>
                          <h5>Welcome to StayFind...</h5>
                        </Card.Header>
                          
                    </Card>
                    <Card 
                        className='admin_card'
                        title='Go to users page'
                        onClick={() => navigate('/user')} >
                        <Card.Header><i className="fas fa-users" />  USERS</Card.Header>
                        <Card.Body>
                            <Card.Title>TOTAL USERS</Card.Title>
                            <Card.Text><h2>{userCount}</h2></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card 
                        className='admin_card'
                        title='Go to properties page'
                        onClick={() => navigate('/properties_list')} >
                        <Card.Header> <i className="fas fa-building" />  PROPERTIES</Card.Header>
                        <Card.Body>
                            <Card.Title>TOTAL PROPERTY</Card.Title>
                            <Card.Text><h2>{propertyCount}</h2></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card 
                        className='admin_card'
                        title='Go to booking page'
                        onClick={() => navigate('/trips')} >
                        <Card.Header><i className="fas fa-calendar-check" />  BOOKING</Card.Header>
                        <Card.Body>
                            <Card.Title>TOTAL BOOKING</Card.Title>
                            <Card.Text><h2>Total</h2></Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
