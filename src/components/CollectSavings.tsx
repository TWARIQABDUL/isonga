import { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

interface CollectSavingsProps {
  setShowColectionForm: (show: boolean) => void;
}

function CollectSavings({ setShowColectionForm }: CollectSavingsProps) {
  const baseUrl = import.meta.env.VITE_API_URL_DEV;
  const { refreshData } = useData();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (query.length < 3) return;

    const fetchUsers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
        const res = await axios.get(`${baseUrl}/users/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (err) {
        console.error('Error searching users', err);
      }
    };

    const debounce = setTimeout(fetchUsers, 500);  // Debounce to reduce requests

    return () => clearTimeout(debounce);
  }, [query]);
const handleSubmit = async () => {
  if (isSubmitting) return;
  const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
  if (!selectedUser || !amount || !token) {
    alert("Select a user, enter amount, and make sure you're logged in.");
    return;
  }

  setIsSubmitting(true);
  try {
    const res = await axios.post(
      `${baseUrl}/savings`,
      {
        userIdNumber: selectedUser.idNumber,
        amount: Number(amount),
        target: 100
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Payment Successful:", res.data);
    alert("Payment successful!");
    refreshData();
    setAmount('');
    setQuery('');
    setSelectedUser(null);
    setShowColectionForm(false);
  } catch (error) {
    console.error("Payment failed:", error);
    alert("Payment failed. Check console.");
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Collect Weekly Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by ID or Name
            </label>
            <input
              type="text"
              placeholder="Type user ID or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {users.length > 0 && (
              <ul className="border mt-2 rounded-lg max-h-40 overflow-y-auto">
                {users.map((user: any) => (
                  <li
                    key={user.idNumber}
                    onClick={() => {
                      setSelectedUser(user);
                      setQuery(`${user.fullName} (${user.idNumber})`);
                      setUsers([]);
                    }}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {user.fullName} ({user.idNumber})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowColectionForm(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 text-white py-2 rounded-lg ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Make Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollectSavings;
