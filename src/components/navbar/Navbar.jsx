import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../../assets/stayfind.png";
import "./Navbar.css";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary main_navbar">
      <Container fluid>
        <Navbar.Brand>
          <img
            style={{ maxHeight: "40px", cursor: "pointer" }}
            src={logo}
            alt=""
            onClick={() => navigate('/')}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="NavbarScroll" />
        <Navbar.Collapse id="NavbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link onClick={() => navigate('/')}>HOME</Nav.Link>
            <Nav.Link onClick={() => navigate('/properties')}>PROPERTIES</Nav.Link>
            <Nav.Link onClick={() => navigate('/about')}>ABOUT</Nav.Link>
            <Nav.Link onClick={() => navigate('/contact')}>CONTACT</Nav.Link>
          </Nav>
          <Nav
            className="my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {!username && (
              <Nav.Link onDoubleClick={() => navigate('/admin')} onClick={() => navigate('/login')}>Login</Nav.Link>
            )}

            {username && (
              <NavDropdown title={<b>{username} <i className='fas fa-caret-down' /></b>} id="NavbarScrollingDropdown" >
                <>
                  <NavDropdown.Item onClick={() => navigate('/profile')}>My Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/wishlist')}>Wishlist</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/trip')}>Trip</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/booking')}>Booking</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}><i className='fas fa-sign-out-alt' /> Logout</NavDropdown.Item>
                </>
              </NavDropdown>
            )}
            <Nav.Link><i className='fas fa-headset' /></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
