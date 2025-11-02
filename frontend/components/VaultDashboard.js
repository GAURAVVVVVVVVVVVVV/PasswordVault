import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PasswordGenerator from './PasswordGenerator';
import VaultItem from './VaultItem';
import { encryptData, decryptData } from '../utils/crypto';

export default function VaultDashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  useEffect(() => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  setDarkMode(isDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  fetchItems();
}, []);

  useEffect(() => {
    const filtered = items.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(searchLower) ||
             item.username.toLowerCase().includes(searchLower) ||
             item.url.toLowerCase().includes(searchLower);
    });
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('darkMode', String(newMode));
  
  if (newMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  console.log('Dark mode:', newMode); // Debug log
};

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const encryptedItems = await res.json();
      const decryptedItems = encryptedItems.map(item => ({
        ...decryptData(item.encryptedData, item.iv),
        _id: item._id
      }));

      setItems(decryptedItems);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleSaveItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const { encrypted, iv } = encryptData(formData);

      const url = editingItem 
        ? `http://localhost:5000/api/vault/${editingItem._id}`
        : 'http://localhost:5000/api/vault';
      
      const method = editingItem ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encryptedData: encrypted, iv })
      });

      setFormData({ title: '', username: '', password: '', url: '', notes: '' });
      setShowAddForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url,
      notes: item.notes
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/vault/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleUsePassword = (password) => {
    setFormData({ ...formData, password });
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              🔐 My Vault
            </h1>
            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingItem(null);
                setFormData({ title: '', username: '', password: '', url: '', notes: '' });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              + Add New Item
            </button>
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              🎲 Generate Password
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Password Generator */}
        {showGenerator && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <PasswordGenerator onUsePassword={handleUsePassword} />
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => setShowGenerator(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Generate
                </button>
              </div>
              <input
                type="text"
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveItem}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({ title: '', username: '', password: '', url: '', notes: '' });
                  }}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vault Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No items match your search' : 'No items in vault. Add your first password!'}
            </div>
          ) : (
            filteredItems.map(item => (
              <VaultItem
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}