import React, { useState, useEffect } from 'react';

const ProfileCard = ({
  name,
  position,
  image,
  onPrevious,
  onNext,
  fetchImageUrl,
}) => {
  const [animationState, setAnimationState] = useState(''); // For fade-in/out animation
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track image load state

  // Handle previous button click
  const handlePrevious = () => {
    setAnimationState('fade-out');
    setIsImageLoaded(false); // Reset loading state for image
    setTimeout(() => {
      onPrevious(); // Update to the previous profile
      setAnimationState('fade-in');
    }, 300); // Matches the animation duration
  };

  // Handle next button click
  const handleNext = () => {
    setAnimationState('fade-out');
    setIsImageLoaded(false); // Reset loading state for image
    setTimeout(() => {
      onNext(); // Update to the next profile
      setAnimationState('fade-in');
    }, 300); // Matches the animation duration
  };

  // Handle image loading state
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Dynamically resolve image URL
  const resolvedImageUrl = image.startsWith('https') ? image : fetchImageUrl?.(image);

  return (
    <div className="relative lg:row-span-2 flex flex-col bg-gray-100 rounded-lg shadow bg-white h-[500px]">
      {/* Header */}
      <div className="absolute top-0 left-0 bg-bfpNavy w-full p-4 text-white rounded-t-lg">
        <h4
          className={`text-xl font-semibold transition-transform duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {name || 'Unknown'}
        </h4>
        <p
          className={`text-sm transition-transform duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {position || 'Position Unavailable'}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 mt-16 text-black">
        <h3 className="text-lg font-medium ">Personnel</h3>
        <p className="text-sm">Swipe to view different personnel profiles.</p>
      </div>

      {/* Image */}
      <div className="relative flex items-center justify-center">
        <img
          className={`h-56 w-56 sm:h-56 sm:w-56 sm:rounded-full lg:h-72 lg:w-72 rounded-full object-cover transition-all duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          } ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
          src={resolvedImageUrl}
          alt={`Personnel`}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between p-4">
        <button
          className="text-sm text-white bg-gray px-5 py-3 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-hoverBtn"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="text-sm text-white bg-bfpNavy px-5 py-3 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-hoverBtn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;