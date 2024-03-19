import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import moment from "moment";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function ListingItem({ listing }) {
  function formatPriceWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Function to calculate the time difference
  function calculateTimeDifference(updatedAt) {
    const currentTime = moment();
    const postTime = moment(updatedAt);
    const diffInMinutes = currentTime.diff(postTime, "minutes");
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[330px] md:w-[230px] lg:w-[270px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://imageio.forbes.com/specials-images/imageserve/657b29edf09ae8354c4debba/Real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is/960x0.jpg?height=474&width=711&fit=bounds"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-3 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-700 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            Rs. {formatPriceWithCommas(listing.regularPrice)}{" "}
            {listing.priceType}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds `
                : `${listing.bedrooms} Bed `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms `
                : `${listing.bathrooms} Bathroom `}
            </div>
          </div>
          <div className="text-gray-500 text-xs flex items-center gap-1">
            <AiOutlineClockCircle className="h-4 w-4" />
            <p>{calculateTimeDifference(listing.updatedAt)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
