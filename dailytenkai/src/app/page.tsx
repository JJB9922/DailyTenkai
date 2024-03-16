import ThemeToggle from 'tailwind-easy-theme-switcher';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white dark:bg-black">
     <ThemeToggle/>
    </main>
  );
}
