import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import './UserList.css';
import { toast } from 'react-hot-toast';
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit"
import { CiLock, CiUnlock } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import adminInstance from '../../../aaxios_instance/AdminAxios';


const UserList = () => {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');


  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem('adminToken')){
        navigate('/admin_login')
    }
  },[])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminInstance.get(`/api/admin/user`);
        setUsers(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }
    fetchUsers();
  }, []);

  const handleBlock = async (userId, isBlocked) => {
    try {
      const url = isBlocked ? `/api/admin/user/unblock/${userId}` : `/api/admin/user/block/${userId}`
      const response = await adminInstance.put(url, {})

      setUsers((prevUser) => prevUser.map((user) => user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user))
      console.log(response.data.message);
      toast(response.data.message,"", {icon: ''});
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.message)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  } 

  const searchedUser = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='user_list_container'>
      <Sidebar />
      <div className='main_content'>
        <h1 className='user_header'>Users List</h1>
        <input type="search" placeholder='Search here..' value={search} onChange={handleSearch} className='search_input' />
        <div className='table-responsive'>
          <MDBTable responsive='sm' striped bordered>
            <MDBTableHead>
              <tr>
                <th scope='col'></th>
                {/* <th scope='col'>Name</th> */}
                <th scope='col'>Username</th>
                <th scope='col'>Email</th>
                <th scope='col'>Phone</th>
                <th scope='col'>Created</th>
                <th scope='col'>Updated</th>
                <th scope='col'>Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {searchedUser.length > 0 ? (
                searchedUser.map((user) => (
                  <tr key={user._id}>
                    <td><i className='fas fa-user' /></td>
                    {/* <td>{user.name}</td> */}
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.createdAt}</td>
                    <td>{user.updatedAt}</td>
                    <td>{user.isBlocked ? (<CiLock style={{ color: "red", cursor: "pointer" }} onClick={() => handleBlock(user._id, true)} />) : (<CiUnlock style={{ color: "green", cursor: "pointer" }} onClick={() => handleBlock(user._id, false)} />)}</td>
                  </tr>
                ))
              ) : (<p> No users found...!</p>)}
            </MDBTableBody>
          </MDBTable>
        </div>
      </div>
    </div>

  );
}

export default UserList;
