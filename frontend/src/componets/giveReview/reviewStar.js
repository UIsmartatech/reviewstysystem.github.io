import React, { useState } from 'react';
import Star  from "@mui/icons-material/Star";
import { styled } from '@mui/material/styles';

const ReviewStar = ({ criterion, onRatingChange }) => {
  const[rating,setRating]= useState(null);
  const[hover,setHover]= useState(null)

  const criteria = ['Performance', 'Ability', 'Caring', 'Lovely']; // List of criteria

  const handleClick = (ratingValue) => {
    setRating(ratingValue);
    onRatingChange(criterion, ratingValue);
  };


  return (
  <div>        
                             
      {[... Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
         <label  key={ratingValue}>
            <input type="radio" 
            name="rating" 
            className="d-none"
            value={ratingValue}
            onClick={() => handleClick(ratingValue)} 
            />
             <Star className="Star"  
               sx={{
                color: ratingValue <= (hover || rating) ? '#ffc106' : '#e4e5e9',
              }}
              onMouseEnter={()=> setHover(ratingValue)} 
              onMouseLeave={()=> setHover(null)}
            />
        </label>
      
        );
       
       })}
       
    </div>
  );
};

export default ReviewStar;