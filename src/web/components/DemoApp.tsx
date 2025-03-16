import { useState } from 'react';
import { motion } from 'framer-motion';

export const DemoApp = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (text.trim()) {
      setItems([...items, text]);
      setText('');
    }
  };

  return (
    <div id="demo" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Try It Live!</h2>
          <p className="text-gray-600">
            Install the extension and interact with this demo to see renders highlighted in real-time
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 text-center">
            <button
              onClick={() => setCount(c => c + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Count: {count}
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Add an item"
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {items.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-gray-50 rounded"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 