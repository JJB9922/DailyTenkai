import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import 'material-icons/iconfont/material-icons.css';
import MapComponent from './components/Map';

export default function Home() {
  return (
    <main className="md:h-screen h-full w-screen bg-shironeri dark:bg-kachi px-4 py-8 overflow-auto">
      <div className='flex flex-col items-center justify-center mb-8'>
        <div className='flex flex-row items-center justify-between w-full'>
          <ThemeToggle />
          <img src="/Logo.png" alt="Logo" className="w-8 h-8 ml-2 dark:invert" />
        </div>
        <h1 className='text-2xl text-center text-kachi dark:text-shironeri'>Daily Tenkai</h1>
      </div>

      <div className='text-kachi dark:text-shironeri text-center mb-8'>
        <p>Give Daily Tenkai a location, and it will calculate a 10,000 step route for you to take.</p>
        <p>Simply plug the output address into your phone or GPS, then head there and back.</p>
      </div>

      <div className='mb-8'>
        <MapComponent />
      </div>

      <div className='flex justify-center dark:text-shironeri'> 
      <p>Any feedback?</p>
      <a className="underline gap-4 ml-4" href='mailto:jjb9922@protonmail.com'>Email me here.</a>
      
      </div>
      <div className='flex justify-center mt-32'> 
        <iframe id='kofiframe' src='https://ko-fi.com/jjb9922/?hidefeed=true&widget=true&embed=true&preview=true' height='600' title='jjb9922'></iframe>
      </div>
    </main>
  );
}
