import React, { useState } from 'react';

interface TabProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

const Tabs: React.FC<TabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
                transition-all duration-200
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${
              activeTab === tab.id ? 'block' : 'hidden'
            } transition-opacity duration-200`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;