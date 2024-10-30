import React, { useEffect, useState } from "react";
import "./Homey.css";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import userInstance from "../../aaxios_instance/UserAxios";
import { useNavigate } from "react-router-dom";
import cities from "../../assets/all_cities";
import { toast } from 'react-hot-toast';

const Homey = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [placeholder, setPlaceholder] = useState(0);
  const placeholderText = ['Search "Idukki"', 'Search "Munnar"', 'Search "Pool"', 'Search "Ponnani"'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await userInstance.get("/api/users/categories");
        setCategories(response.data.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const locationUrl = process.env.REACT_APP_LOCATION_FETCH_URL;

  // Get Location
  const handleGLocByGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`${locationUrl}/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
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

  // Get Location By Mic
  const handleGLocByMic = () => {
    toast("Mic is now on...", {
      autoClose: 5000
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
    const searchValue = selectedSuggestion || inputValue;
    if (searchValue.trim() !== '') {
      let searchUrl = `/properties?location=${searchValue}`;
      if (selectedCategory !== 'all') {
        searchUrl += `&category=${selectedCategory}`;
      }
      navigate(searchUrl);
    } else if (selectedCategory !== 'all') {
      navigate(`/properties?category=${selectedCategory}`);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
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
    setSuggestions(filteredCities.slice(0, 6));
  }, [inputValue]);

  useEffect(() => {
    const changePlaceholder = () => {
      setPlaceholder((prev) => (prev + 1) % placeholderText.length);
    };
    const timer = setTimeout(changePlaceholder, 2500);
    return () => clearTimeout(timer);
  }, [placeholder, placeholderText]);

  return (
    <div>
      <section>
        <div className="text_area">
            <h4>We compare hotel prices from 100s of sites</h4>
            <p>We’ll do the searching. You do the saving.</p>
        </div>

        <div className="search_box">
          <FormControl className="formcontrol">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            freeSolo
            value={selectedSuggestion}
            onChange={(event, newValue) => {
              setSelectedSuggestion(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={suggestions.map((city) => `${city.city}, ${city.state}`)}
            renderInput={(params) => (
              <TextField style={{minWidth:"400px"}}
                {...params}
                className="seachcontrol"
                type="search"
                label={<><i className="fas fa-search iug" />&nbsp;&nbsp;{placeholderText[placeholder]}</>}
                onKeyPress={handleEnter}
                variant="outlined"
              />
            )}
          />
          <Button variant="contained" className="search_btn" onClick={handleSearch}>Search</Button>
        </div>
      </section>
    </div>
  );
};

export default Homey;
