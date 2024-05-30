import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact'
import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import logo from '../../../assets/stayfind.png'
import { toast } from 'react-hot-toast';

const Sidebar = () => {

    const handleLogout = () => {
        toast.success('logged out success')
        localStorage.removeItem('adminToken')
    }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "scroll initial", borderRight:"1px solid rgba(0, 0, 0, 0.12)"}}>
        <CDBSidebar textColor="black" backgroundColor="#fff">
            <CDBSidebarHeader prefix={<i className='fa fa-bars fa-large'></i>}>
                <NavLink to='/admin' style={{ color: "inherit" }}><img src={logo} className="img_logo"  alt="" /></NavLink>
            </CDBSidebarHeader>
            <CDBSidebarContent className='sidebar-content'>
                <CDBSidebarMenu>
                    <NavLink to='/admin' activeClassName= "activeClicked" title='Home'>
                        <CDBSidebarMenuItem icon='home'>Home</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to='/user' activeClassName= "activeClicked" title='Users'>
                        <CDBSidebarMenuItem icon='users'>Users</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to='/properties_list' activeClassName= "activeClicked" title='Properties'>
                        <CDBSidebarMenuItem icon='building'>Properties</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to='/add_property' activeClassName= "activeClicked" title='Add Property'>
                        <CDBSidebarMenuItem icon='plus-circle'>Add Property</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to='/trips' activeClassName= "activeClicked" title='Trips'>
                        <CDBSidebarMenuItem icon='bell'>Trips</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to='/' activeClassName= "activeClicked" title='Logout' onClick={handleLogout}>
                        <CDBSidebarMenuItem icon='door-open'>Logout</CDBSidebarMenuItem>
                    </NavLink>
                </CDBSidebarMenu>
            </CDBSidebarContent>
            <CDBSidebarFooter className='footer'></CDBSidebarFooter>
        </CDBSidebar>
    </div>
  )
}

export default Sidebar