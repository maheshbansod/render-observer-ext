import { useEffect, useState } from 'react';
import { Switch } from './Switch';

interface Config {
  borderColor: string;
  borderWidth: string;
  borderStyle: string;
  highlightDuration: number;
}

const defaultConfig: Config = {
  borderColor: '#1E90FF',
  borderWidth: '2px',
  borderStyle: 'solid',
  highlightDuration: 500,
};

export const PopupView = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [hasConfigChanged, setHasConfigChanged] = useState(false);

  useEffect(() => {
    // Query current state when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getState' }, (response) => {
          setIsEnabled(response?.isObserving || false);
          if (response?.config) {
            setConfig(response.config);
          }
        });
      }
    });
  }, []);

  const handleToggle = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { 
            action: 'toggle', 
            isEnabled: !isEnabled,
            config: !isEnabled ? config : undefined // Send config only when enabling
          },
          (response) => {
            setIsEnabled(response?.isObserving || false);
            setHasConfigChanged(false);
          }
        );
      }
    });
  };

  const updateConfig = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'updateConfig', config },
          () => {
            setHasConfigChanged(false);
          }
        );
      }
    });
  };

  const handleConfigChange = (key: keyof Config, value: string | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasConfigChanged(true);
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

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Configuration</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Border Color</label>
            <input
              type="color"
              value={config.borderColor}
              onChange={(e) => handleConfigChange('borderColor', e.target.value)}
              className="mt-1 w-full h-8 rounded border"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Border Width</label>
            <input
              type="text"
              value={config.borderWidth}
              onChange={(e) => handleConfigChange('borderWidth', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Border Style</label>
            <select
              value={config.borderStyle}
              onChange={(e) => handleConfigChange('borderStyle', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Duration (ms)</label>
            <input
              type="number"
              value={config.highlightDuration}
              onChange={(e) => handleConfigChange('highlightDuration', parseInt(e.target.value))}
              className="mt-1 w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {isEnabled && hasConfigChanged && (
          <button
            onClick={updateConfig}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Apply Changes
          </button>
        )}
      </div>
    </div>
  );
}; 