import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading]=useState(true);
  const BACKEND_URL = "https://admin-panel-ez0l.onrender.com";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(response);
        setLoading(false);
        setUsers(response.data.users);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/users/block/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.message);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, blocked: true } : user
        )
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to block user");
    }
  };
  const handleUnblock = async (userId) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/users/unblock/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.message);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, blocked: false } : user
        )
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to block user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(response.data.message);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <>
        <div
          role="status"
          className="h-screen pb-40 w-full flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Users</h2>
      {users.length==0?<h2 className="text-2xl">No users are subscribed to the bot currently.</h2>:null}
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border"
          >
            <div>
              <p className="text-gray-700 font-medium">({user.chatId})</p>
              <p className="text-sm text-gray-500">
                Status: {user.blocked ? "Blocked" : "Active"}
              </p>
            </div>
            <div className="space-x-2">
              {user.blocked ? (
                <button
                  onClick={() => handleUnblock(user._id)}
                  className="px-3 py-1 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(user._id)}
                  className="px-3 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Block
                </button>
              )}
              <button
                onClick={() => handleDelete(user._id)}
                className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
