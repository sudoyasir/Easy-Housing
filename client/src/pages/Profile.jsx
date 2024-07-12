import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "sonner";

//all imports above

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [fetchingListings, setFetchingListings] = useState(false);

  const fileRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Success", {
        description: "Profile updated successfully",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Success", {
        description: "User deleted successfully",
      });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
      dispatch(signOutUserSuccess());
      toast.success("Success", {
        description: "Signed out successfully",
      });
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  const handleShowListings = async () => {
    try {
      setFetchingListings(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
      setUserListings(data);
      toast.success("Success", {
        description: `Fetched ${data.length} listings successfully`,
      });
    } catch (error) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setFetchingListings(false);
    }
  };

  const handleListingDelete = async (listingId, listingName) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Error", {
          description: data.message,
        });
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success("Success", {
        description: `${listingName} deleted successfully`,
      });
    } catch (error) {
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700 text-center">
              Error uploading file (Image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 text-center">
              {`Uploading ${filePerc}%`}
            </span>
          ) : filePerc === 100 ? (
            <span className="text-green-700 text-center">File uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          required
        />
        <input
          type="phone"
          placeholder="Phone (+92123456789)"
          className="border p-3 rounded-lg"
          id="phone"
          defaultValue={currentUser.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Please wait...
            </>
          ) : (
            "Update"
          )}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {!userListings.length && (
        <button
          onClick={handleShowListings}
          className="text-green-700 w-full mt-5 flex justify-center items-center"
          disabled={fetchingListings}
        >
          {fetchingListings ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-green-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Fetching Listings...</span>
            </>
          ) : (
            "Show Listings"
          )}
        </button>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageUrls[0]}
                  alt="Listing Cover"
                />
              </Link>
              <Link
                className="flex-1 font-semibold text-slate-700 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleListingDelete(listing._id, listing.name)}
                  className="text-red-700 hover:opacity-95"
                >
                  <FaTrashAlt />
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 hover:opacity-95">
                    <FaEdit />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
