import { useState } from 'react';

export default function PasswordGenerator({ onUsePassword }) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeLookalikes) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 15000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Password Generator</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4"
          />
          Include Numbers
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4"
          />
          Include Symbols
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={excludeLookalikes}
            onChange={(e) => setExcludeLookalikes(e.target.checked)}
            className="w-4 h-4"
          />
          Exclude Look-alikes (i, l, 1, L, o, 0, O)
        </label>
      </div>

      <button
        onClick={generatePassword}
        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
      >
        Generate Password
      </button>

      {password && (
        <div className="space-y-2">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-lg break-all text-gray-800 dark:text-white">
            {password}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            {onUsePassword && (
              <button
                onClick={() => onUsePassword(password)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Use This Password
              </button>
            )}
          </div>
          {copied && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Password will be cleared from clipboard in 15 seconds
            </p>
          )}
        </div>
      )}
    </div>
  );
}