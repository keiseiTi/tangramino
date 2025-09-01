import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center py-40'>
      <div className='text-5xl font-bold mb-10'>Let's Go Demo Page.</div>
      <Link to='/engine' className='text-blue-700 text-3xl hover:underline'>
        engine demo
      </Link>
      <Link to='/editor' className='text-blue-700 text-3xl hover:underline'>
        editor demo
      </Link>
    </div>
  );
};

export default Home;
