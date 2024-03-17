
import ThemeToggle from '../components/ThemeToggle'
import 'material-icons/iconfont/material-icons.css';


export default function Home() {
  return (
    <main className="min-h-screen bg-shironeri dark:bg-kachi">
      <div className='flex flex-row items-center justify-around p-16'>
        <ThemeToggle/>
        <h1 className='text-2xl text-kachi dark:text-shironeri'>Daily Tenkai</h1>
      </div>

      <div className='flex flex-col items-center gap-4 text-kachi dark:text-shironeri'>
        <p> Give Daily Tenkai a location, and it'll calculate the best 10,000 step route for you to take.</p>
        <p>Nail your health goals...</p>
        <div className='flex flex-row'>
        <span className="material-icons-outlined mr-4">task_alt</span>
        <p>Reach 10k Steps!</p>
        </div>

      </div>
    </main>
  );
}
