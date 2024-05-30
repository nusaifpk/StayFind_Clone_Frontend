import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import './AdminTrips.css';


const AdminTrips = () => {
  
  return (
    <div className='trip_list_container'>
      <Sidebar />
      <div className='main_content'>
        <h1 className='trip_header'>Trips List</h1>
      </div>
    </div>

  );
}

export default AdminTrips;
