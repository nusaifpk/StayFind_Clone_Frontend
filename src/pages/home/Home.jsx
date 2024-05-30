import React, { useState, useEffect } from 'react';
import './Home.css';
import Features from '../../components/features/Features';
import ContactUs from '../../components/contact_us/Contact';
import cities from '../../assets/all_cities';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Home = () => {
  
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [placeholder, setPlaceholder] = useState(0);
  const placeholderText = ['Search "Idukki"', 'Search "Munnar"', 'Search "Pool"', 'Search "Ponnani"'];

  const handleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  const locationUrl = process.env.REACT_APP_LOCATION_FETCH_URL;

  //Get Location
  const handleGLocByGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`${locationUrl}/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
              const placeName = data.address.county;
              setInputValue(placeName); 
            })
            .catch(error => console.error("Error fetching location: ", error));
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };
  
  //Get Location By Mic
  const handleGLocByMic = () => {
    toast("Mic is now on...",{
      autoClose:5000
    });
    
    const recognition = new window.webkitSpeechRecognition();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputValue(transcript);
    };
    recognition.start();
    setTimeout(() => {
      recognition.stop();
      toast.dismiss(); 
    }, 5000);
  };

  const handleSearch = () => {
    if(inputValue.trim() !== ''){ 
      let searchUrl = `/properties?location=${inputValue}`;
      if (category !== 'all') {
        searchUrl += `&category=${category}`;
      }
      navigate(searchUrl);
    } else if (category !== 'all') {
      navigate(`/properties?category=${category}`);
    }
  };

  const handleEnter = (e) => {
    if(e.key === 'Enter'){
      handleSearch();
    }
  };

  useEffect(() => {
    if (inputValue === '') {
      setSuggestions([]);
      return;
    }
    const filteredCities = cities.filter((city) =>
      city.city.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredCities.slice(0, 5));
  }, [inputValue]);

  useEffect(() => {
    const changePlaceholder = () => {
      setPlaceholder((prev) => (prev + 1) % placeholderText.length);
    };
    const timer = setTimeout(changePlaceholder, 2500);
    return () => clearTimeout(timer);
  }, [placeholder, placeholderText]);

  return (
    <>
      <section className="home_section">
        <div className="home">
          <h1>We compare hotel prices from 100s of sites.</h1>
          <p>We’ll do the searching. You do the saving.</p>
          <div className="search_container">
            <select name="Property" onChange={handleCategoryChange}>
              <option value="all">Category All</option>
              <option value="pool">Pool</option>
              <option value="lake">Lake</option>
              <option value="farm">Farm</option>
              <option value="room">Room</option>
            </select>
            <i className="fas fa-search" style={{ paddingLeft: '20px', paddingRight: '0px' }} />
            <input
              type="text"
              placeholder={placeholderText[placeholder]}
              value={inputValue}
              onChange={handleChange}
              onKeyPress={handleEnter}
              className="location_input"
              list="city-suggestions"
            />
            <datalist id="city-suggestions">
              {suggestions.map((city) => (
                <option key={city.id} value={`${city.city}, ${city.state}`} />
              ))}
            </datalist>
            <i className="fas fa-map-marker-alt i_icons" onClick={handleGLocByGPS} />
            <i className="fas fa-microphone i_icons" onClick={handleGLocByMic} />
            <button className="search_button" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>

      <section className="features_section">
        <div>
          <Features />
        </div>
      </section>

      <section>
        <ContactUs />
      </section>
    </>
  );
};

export default Home;
