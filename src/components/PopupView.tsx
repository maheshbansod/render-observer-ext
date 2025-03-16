import { useEffect, useState } from 'react';
import { Switch } from './Switch';

export const PopupView = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Query current state when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getState' }, (response) => {
          setIsEnabled(response?.isObserving || false);
        });
      }
    });
  }, []);

  const handleToggle = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'toggle', isEnabled: !isEnabled },
          (response) => {
            setIsEnabled(response?.isObserving || false);
          }
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DOM Mutation Visualizer
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Visualize DOM changes in real-time with elegant highlights
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Visualization</span>
            <p className="text-sm text-gray-500">
              {isEnabled ? 'Currently watching DOM changes' : 'Click to start visualizing'}
            </p>
          </div>
          <Switch checked={isEnabled} onChange={handleToggle} />
        </div>
      </div>
    </div>
  );
}; 