import React, { useState, useEffect } from 'react';
import BlurText from './BlurText';
import FallingText from './FallingText';


const Home = () => {
const [isAnimating, setIsAnimating] = useState(true);
  
  const handleAnimationComplete = () => {
  console.log('Animation completed!');
  // Set a timeout to restart the animation after 20 seconds
  setTimeout(() => {
    setIsAnimating(true);
  }, 6000);
};

useEffect(() => {
  if (isAnimating) {
    // Simulate the start of the animation
    console.log('Animation started');
    // Set isAnimating to false after the animation delay
    setTimeout(() => {
      setIsAnimating(false);
      console.log('Animation completed');
    }, 150); // Assuming the animation duration is 150ms
  }
}, [isAnimating]);
  return (
    <div>
      <BlurText
  text="Welcome To HighxBrand !"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8 w-100"
/>
<hr />
<FallingText 
  text={`Highxbrand India Pvt Ltd's CRM streamlines business operations with efficient lead management and a seamless employee leave system, ensuring productivity and workflow optimization.`}
  highlightWords={["Highxbrand", "lead", "leave", "productivity", "seamless", "optimization"]}
  highlightClass="highlighted"
  trigger="hover"
  backgroundColor="transparent"
  wireframes={false}
  gravity={0.56}
  fontSize="2rem"
  mouseConstraintStiffness={0.9}
/>
    </div>
  )
}

export default Home
