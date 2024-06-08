import './App.css';
import 'react-loading-skeleton/dist/skeleton.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { Routes, Route } from "react-router-dom"
import Home from './pages/home/Home';
import Registration from './pages/registration/Registeration';
import OtpVerification from './pages/otp_verification/OtpVerification';
import Login from './pages/login/Login';
import Property from './pages/properties/Property';
import { Toaster } from 'react-hot-toast';
import PropertyDetails from './pages/property_details/PropertyDetails';
import AdminHome from './admin/pages/admin_home/AdminHome';
import Footer from './components/footer/Footer';
import AddProperty from './admin/pages/add_property/AddProperty';
import AdminLogin from './admin/pages/admin_login/AdminLogin';
import PropertyList from './admin/pages/property_list/PropertyList';
import Wishlist from './pages/wishlist/Wishlist';
import EditProperty from './admin/pages/edit_property/EditProperty';
import UserList from './admin/pages/user_list/UserList';
import AdminPropertyDetails from './admin/pages/property_details/AdminPropertyDetails';
import Confirm from './pages/confirm/Confirm';
import About from './components/about-us/About';
import NavBar from './components/navbar/Navbar';
import Trip from './pages/trips/Trip';
import ProfilePage from './pages/profile/Profile';
import Contact from './components/contact_us/Contact';
import Booking from './pages/booking_page/Booking';
import AdminBooking from './admin/pages/booking_list/AdminBooking';
import Categories from './admin/pages/categories/Categories';
import Review from './pages/review_rating/Review';



function App() {

  const removeNavbar = [
    'admin_login',
    '/admin',
    '/add_property',
    '/edit_property',
    '/user',
    '/properties_list',
    '/properties_details',
    '/booking_list',
    '/categories'
  ];

  const currentPath = window.location.pathname;
  const isAdminPath = removeNavbar.some((path) => currentPath.startsWith(path));


  return (
    <div className="App">
      <Toaster position='top-center' autoClose={2000} />

      {!isAdminPath && <NavBar />}

      <Routes>

        {/* USER */}
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/otpverification' element={<OtpVerification />} />
        <Route path='/login' element={<Login />} />
        <Route path='/properties' element={<Property />} />
        <Route path='/properties/:id' element={<PropertyDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/confirm/:propertyId' element={<Confirm />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/review' element={<Review />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/trip' element={<Trip />} />
        <Route path='/profile' element={<ProfilePage />} />

        {/* ADMIN */}
        <Route path='/admin_login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/add_property' element={<AddProperty />} />
        <Route path='/edit_property/:id' element={<EditProperty />} />
        <Route path='/user' element={<UserList />} />
        <Route path='/properties_list' element={<PropertyList />} />
        <Route path='/properties_list/:id' element={<AdminPropertyDetails />} />
        <Route path='/booking_list' element={<AdminBooking />} />
        <Route path='/categories' element={<Categories />} />


      </Routes>

      {!isAdminPath && <Footer />}

    </div>
  );
}

export default App;
