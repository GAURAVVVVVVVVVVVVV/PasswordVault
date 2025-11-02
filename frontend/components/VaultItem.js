import { useState } from 'react';

export default function VaultItem({ item, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 15000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.title}</h3>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {item.url}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {item.username && (
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-gray-800 dark:text-white">
                {item.username}
              </div>
              <button
                onClick={() => copyToClipboard(item.username, 'username')}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                {copied === 'username' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}

        {item.password && (
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Password</label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono text-gray-800 dark:text-white">
                {showPassword ? item.password : '••••••••••••'}
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              <button
                onClick={() => copyToClipboard(item.password, 'password')}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                {copied === 'password' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}

        {item.notes && (
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Notes</label>
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-gray-800 dark:text-white whitespace-pre-wrap">
              {item.notes}
            </div>
          </div>
        )}
      </div>

      {copied && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          Copied! Will clear in 15 seconds
        </p>
      )}
    </div>
  );
}