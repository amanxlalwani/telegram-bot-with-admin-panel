import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function Settings() {
  const [key, setKey] = useState("WEATHER_API_KEY");
  const [value, setValue] = useState("");
  const [inputVal, setInputVal] = useState("");
  const BACKEND_URL = "https://admin-panel-ez0l.onrender.com";
  const [isShow, setShow] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [loading, setLoading] = useState(true);
  function toggleShow() {
    console.log(isShow);

    setShow((isShow) => !isShow);
  }

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/settings/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.status == 200) {
          setValue(res.data.settings[0].value);
          setInputVal(res.data.settings[0].value);
        } else {
          toast.error(res.data.message);
        }
      });
  }, []);

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
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Update Bot Settings
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={key}
          disabled={updateMode ? false : true}
          onChange={(e) => setKey(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />

        <div className="relative">
          <input
            className="w-full px-3 pr-16  py-2  border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            type={isShow ? "text" : "password"}
            value={inputVal}
            disabled={updateMode ? false : true}
            onChange={(e) => {
              setInputVal(e.target.value);
            }}
          />
          <div
            onClick={() => {
              toggleShow();
            }}
            className="absolute cursor-pointer right-0 bottom-0 flex items-center h-full px-6"
          >
            {isShow ? (
              <svg
                className="h-4 md:h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
              </svg>
            ) : (
              <svg
                className="h-4 md:h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            )}
          </div>
        </div>

        {updateMode ? (
          <div className="flex justify-center">
            <button
              className="w-2/5 bg-green-600 text-white py-2 mx-2 rounded-lg hover:bg-green-700"
              onClick={async () => {
                const res = await axios.post(
                  `${BACKEND_URL}/settings/update`,
                  { key, value: inputVal },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                if (res.status == 200) {
                  setValue(inputVal);
                  setUpdateMode(false);
                  toast.success(res.data.message);
                } else {
                  toast.error(res.data.message);
                }
              }}
            >
              Update
            </button>
            <button
              className="w-2/5 bg-red-600 text-white mx-2 py-2 rounded-lg hover:bg-red-700"
              onClick={() => {
                setInputVal(value);
                setUpdateMode(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              className="w-2/5  bg-blue-600 text-white mx-2 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => {
                setUpdateMode(true);
              }}
            >
              Edit
            </button>
            <button
              className="w-2/5 bg-yellow-600 text-white mx-2 py-2 rounded-lg hover:bg-yellow-700"
              onClick={async () => {
                try {
                  const weather = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=${value}`
                  );
                  console.log(weather);

                  if (weather.data.cod == 200) {
                    toast.success("API Key is working properly!");
                  } else if (weather.data.cod == 401) {
                    toast.error("API Key is invalid.");
                  }
                } catch (err) {
                  if (err.response.status == 401) {
                    toast.error("API key is invalid!");
                  }
                }
              }}
            >
              Test API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
