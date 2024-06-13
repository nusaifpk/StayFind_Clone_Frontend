import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import "./Review.css";
import { Button } from '@mui/material';
import { PropagateLoader } from 'react-spinners';
import userInstance from '../../aaxios_instance/UserAxios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const labels = {
    1.0: 'Useless+',
    2.0: 'Poor+',
    3.0: 'Ok+',
    4.0: 'Good+',
    5.0: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const Review = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [searchParams] = useSearchParams();

    const propertyId = searchParams.get('propertyId');

    const [value, setValue] = useState(0);
    const [review, setReview] = useState('');

    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(-1);

    const handlePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(async () => {
            try {
                await userInstance.post('/api/users/review', { userId, propertyId, rating: value, review });
                toast.success("Review posted");
                navigate('/booking');
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className='review_container'>
            <div className='review_rating_section'>
                <h4>Thank you for using StayFind for your booking.</h4>
                <h5>Kindly add your review and rating for the property</h5>
                <div className="rating_section">
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Rating
                            name="hover-feedback"
                            value={value}
                            precision={1}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            icon={<StarIcon fontSize="large" />}
                            emptyIcon={<StarIcon style={{ opacity: 1, fontSize: 30 }} fontSize="inherit" />}
                            sx={{ fontSize: 40 }}
                        />

                        {value !== null && (
                            <Box sx={{ ml: 2, fontSize: 24 }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </Box>
                </div>
                <div className="review_section">
                    <textarea value={review} onChange={(e) => setReview(e.target.value)} />
                    <Button className='post_btn' variant="contained" color="success" onClick={handlePost}>
                        {loading ? (
                            <PropagateLoader color="#fff" loading={loading} size={5} />
                        ) : (
                            'POST'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Review;
