import { useEffect, useState } from 'react';
import { Switch } from './Switch';
import { ConfigurationForm } from './ConfigurationForm';
import { Config } from '../types/Config';


const dummyDefaultConfig: Config = {
  borderColor: '#1E90FF',
  borderWidth: '2px',
  borderStyle: 'solid',
  highlightDuration: 500,
  zIndex: 999999,
  ignoredSelectors: [],
};

export const PopupView = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [config, setConfig] = useState<Config>(dummyDefaultConfig);
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
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setHasConfigChanged(true);
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-5">
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
              {isEnabled ? 'Watching DOM changes' : 'Click to start visualizing'}
            </p>
          </div>
          <Switch checked={isEnabled} onChange={handleToggle} />
        </div>
      </div>

      <ConfigurationForm
        config={config}
        onConfigChange={handleConfigChange}
        showApplyButton={isEnabled && hasConfigChanged}
        onApply={updateConfig}
      />

    </div>
  );
}; 