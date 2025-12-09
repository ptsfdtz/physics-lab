import React from 'react';
import { NavLink } from 'react-router-dom';
import { physicsMenu } from '../../menu/physicsMenu';
import type { MenuItem } from '../../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

const SidebarItem: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="mb-1">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${depth > 0 ? 'pl-6' : ''}`}
        >
          <span className="flex items-center">
            {depth === 0 && <span className="mr-2 text-blue-500 font-bold">#</span>}
            {item.label}
          </span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      ) : (
        <NavLink
          to={item.path || '#'}
          className={({ isActive }) =>
            `block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            } ${depth > 0 ? 'pl-8' : ''}`
          }
        >
          {item.label}
        </NavLink>
      )}

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children!.map((child, index) => (
            <SidebarItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11458"
            width="24"
            height="24"
          >
            <path
              d="M115.264853 526.098773l33.629867-129.831253 99.689813 9.268907-6.956373 184.331946L45.738667 635.077973l25.494186 105.470294 165.771947-38.253227-9.2928 222.585173 107.8272 4.62336 10.42432-252.70272 96.223573-23.185066-25.51808-105.49248-64.904533 15.071573 5.802667-148.36736 67.213653 5.778773 8.113493-108.95872-70.705493-5.79072L373.792427 55.466667l-110.13632-4.6336-10.42432 245.746346-75.35104-6.946133 39.40864-151.857493-105.49248-27.830614L9.796267 498.292053l105.468586 27.80672z m440.50432-187.777706l39.430827-100.857174 304.872107 33.619627-34.786987 550.618453-113.604267 63.74912 55.635627 93.91104 136.787627-77.663573 27.828906-44.055893 40.56576-631.768747-48.677546-57.956693-325.741227-35.9424 26.673493-68.39296L563.882667 23.017813l-108.95872 275.88608 100.845226 39.417174z m-5.804373 556.42112l132.164267-506.586454-105.490774-26.651306-132.143786 505.407146 105.470293 27.830614z m195.915093-86.954667l111.291734-427.74528-105.49248-27.828907-111.26784 427.767467 105.468586 27.80672z"
              fill="#ffffff"
              p-id="11459"
            ></path>
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">Physics Lab</h1>
          <p className="text-xs text-gray-500">Visualization Platform</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {physicsMenu.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-400">
        v1.0.0 © {new Date().getFullYear()} Physics Lab
      </div>
    </aside>
  );
};
