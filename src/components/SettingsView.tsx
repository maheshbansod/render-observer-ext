import { useEffect, useState } from 'react';
import { ConfigurationForm } from './ConfigurationForm';
import { Config, DefaultConfig } from '../types/Config';

// Update the pattern type
interface URLPattern {
  pattern: string;
  enabled: boolean;
}

export const SettingsView = () => {
  const [patterns, setPatterns] = useState<URLPattern[]>([]);
  const [newPattern, setNewPattern] = useState('');
  const [defaultConfig, setDefaultConfig] = useState<Config>(DefaultConfig);
  const [hasConfigChanged, setHasConfigChanged] = useState(false);

  useEffect(() => {
    // Load saved patterns and default config
    chrome.storage.sync.get(['autoEnablePatterns', 'defaultConfig'], (result) => {
      // Convert existing patterns to new format if needed
      const savedPatterns = result.autoEnablePatterns || [];
      const formattedPatterns = Array.isArray(savedPatterns) 
        ? savedPatterns.map(p => typeof p === 'string' ? { pattern: p, enabled: true } : p)
        : [];
      setPatterns(formattedPatterns);
      if (result.defaultConfig) {
        setDefaultConfig(result.defaultConfig);
      }
    });

    // Check for temp config from popup
  }, []);

  const handleConfigChange = (key: keyof Config, value: string | number) => {
    setDefaultConfig(prev => ({ ...prev, [key]: value }));
    setHasConfigChanged(true);
  };

  const saveDefaultConfig = () => {
    chrome.storage.sync.set({ defaultConfig }, () => {
      setHasConfigChanged(false);
    });
  };

  const savePatterns = (newPatterns: URLPattern[]) => {
    chrome.storage.sync.set({ autoEnablePatterns: newPatterns }, () => {
      setPatterns(newPatterns);
    });
  };

  const addPattern = () => {
    if (newPattern) {
      savePatterns([...patterns, { pattern: newPattern, enabled: true }]);
      setNewPattern('');
    }
  };

  const removePattern = (index: number) => {
    const newPatterns = patterns.filter((_, i) => i !== index);
    savePatterns(newPatterns);
  };

  const togglePattern = (index: number) => {
    const newPatterns = patterns.map((p, i) => 
      i === index ? { ...p, enabled: !p.enabled } : p
    );
    savePatterns(newPatterns);
  };

  return (
    <div className="flex flex-col gap-8 px-5 pb-5">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Auto-enable Rules
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Add URL patterns to automatically enable visualization
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            placeholder="Enter URL pattern (regex)"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addPattern}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => togglePattern(index)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pattern.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pattern.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <code className={`text-sm ${pattern.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                  {pattern.pattern}
                </code>
              </div>
              <button
                onClick={() => removePattern(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove pattern"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {patterns.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No patterns added yet
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Default Configuration
        </h2>
        <ConfigurationForm
          config={defaultConfig}
          onConfigChange={handleConfigChange}
          showApplyButton={hasConfigChanged}
          onApply={saveDefaultConfig}
          applyButtonText="Save as Default"
        />
      </div>
    </div>
  );
}; 