import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RxCross2 } from "react-icons/rx";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user) || {};
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1000,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const storeImage = async (file) => {
    const storage = getStorage(app); // Ensure to use app instance
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Error", {
        description: "Please select at least one image.",
      });
      return;
    }
    if (files.length + formData.imageUrls.length > 6) {
      toast.error("Error", {
        description: "Max 6 images allowed.",
      });
      return;
    }

    setUploading(true);
    setLoading(true);
    setImageUploadError("");
    setUploadProgress(0); // Reset progress for new upload

    try {
      const urls = await Promise.all([...files].map(storeImage));
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (error) {
      toast.error("Error", {
        description: "Image upload failed (Max 2MB per image)",
      });
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (formData.imageUrls.length < 1) {
      toast.error("Error", {
        description: "Please select at least one image.",
      });
      return;
    }

    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error("Error", {
          description: data.message,
        });
      }
      toast.success("Success", {
        description: `${data.name} created successfully`,
      });
      navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error("Error", {
        description: error.message,
      });
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-4 rounded-lg"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              placeholder="Description"
              className="border p-4 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-4 rounded-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sale"
                  name="listingType"
                  className="w-5 h-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <label htmlFor="sale" className="text-lg">
                  Sell
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rent"
                  name="listingType"
                  className="w-5 h-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent" className="text-lg">
                  Rent
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 h-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <label htmlFor="parking" className="text-lg">
                  Parking Spot
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 h-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <label htmlFor="furnished" className="text-lg">
                  Furnished
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="20"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <label htmlFor="bedrooms" className="text-lg">
                  Bedrooms
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="20"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <label htmlFor="bathrooms" className="text-lg">
                  Bathrooms
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="100"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col">
                  <label htmlFor="regularPrice" className="text-lg">
                    Price in PKR
                  </label>
                  <span className="text-xs text-gray-600">
                    {formData.type === "rent"
                      ? "(Monthly Rent)"
                      : "(Sale Price)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-lg font-semibold">
              Images:
              <span className="block text-sm font-normal text-gray-600 mt-1">
                The first image will be the cover (max 6)
              </span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading
                ? `Uploading ${Math.round(uploadProgress)}%`
                : "Upload"}
            </button>
            {imageUploadError && (
              <p className="text-red-600 mt-2">{imageUploadError}</p>
            )}
            <div className="flex gap-4 flex-wrap mt-4">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="flex items-center">
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
              <span>Please wait...</span>
            </div>
          ) : (
            "Create Listing"
          )}
        </button>
      </form>
    </main>
  );
}
