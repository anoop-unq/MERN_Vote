import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

import HomePage from './HomePage';
// import Navbar from './Navbar';

const Home = () => {
 

  return (
    <div>
     {/* <Navbar /> */}
      <HomePage />
    </div>
  );
};

export default Home;