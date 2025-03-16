import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DemoApp } from './components/DemoApp';

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DemoApp />
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Made with ♥ by Light</p>
          <div className="mt-4">
            <a href="https://github.com/maheshbansod/render-observer-ext" className="text-blue-400 hover:text-blue-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
