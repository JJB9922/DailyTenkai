import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import 'material-icons/iconfont/material-icons.css';
import MapComponent from './components/Map';


export default function Home() {

  return (
    <main className="min-h-screen bg-shironeri dark:bg-kachi">
      <div className='flex flex-row items-center justify-center py-14 gap-32 w-screen'>
        <ThemeToggle/>
        <img src="/Logo.png" alt="Logo" className="w-8 h-8 mr-2 dark:invert" />
        <h1 className='text-2xl text-kachi dark:text-shironeri'>Daily Tenkai</h1>
      </div>

      <div className='flex flex-col items-center gap-4 text-kachi dark:text-shironeri'>
        <p>Give Daily Tenkai a location, and it'll calculate the best 10,000 step route for you to take.</p>
        <p>Nail your health goals...</p>
        <div className='flex flex-row'>
        <span className="material-icons-outlined mr-4">task_alt</span>
        <p>Reach 10k Steps!</p>
        </div>


        <div className='mb-32 w-2/3 md:px-24'>
        <MapComponent />
        </div>

        </div>
    </main>
  );
}
