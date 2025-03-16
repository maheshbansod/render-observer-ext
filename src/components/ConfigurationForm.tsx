import { Config } from '../types/Config';

interface ConfigurationFormProps {
  config: Config;
  onConfigChange: (key: keyof Config, value: string | number) => void;
  showApplyButton?: boolean;
  onApply?: () => void;
  applyButtonText?: string;
}

export const ConfigurationForm = ({
  config,
  onConfigChange,
  showApplyButton = false,
  onApply,
  applyButtonText = 'Apply Changes'
}: ConfigurationFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Border Color</label>
          <input
            type="color"
            value={config.borderColor}
            onChange={(e) => onConfigChange('borderColor', e.target.value)}
            className="mt-1 w-full h-8 rounded border"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Border Width</label>
          <input
            type="text"
            value={config.borderWidth}
            onChange={(e) => onConfigChange('borderWidth', e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Border Style</label>
          <select
            value={config.borderStyle}
            onChange={(e) => onConfigChange('borderStyle', e.target.value)}
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
            onChange={(e) => onConfigChange('highlightDuration', parseInt(e.target.value))}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {showApplyButton && onApply && (
        <button
          onClick={onApply}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {applyButtonText}
        </button>
      )}
    </div>
  );
}; 