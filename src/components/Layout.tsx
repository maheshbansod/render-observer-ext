import { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="popup-container bg-white" style={{ width: '320px' }}>
      <div>
        {children}
      </div>
      <footer className="text-center p-3 text-sm text-gray-500 border-t">
        Made with <span className="text-red-500">♥</span> by{' '}
        <a 
          href="https://maheshbansod.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Light
        </a>
      </footer>
    </div>
  );
}; 