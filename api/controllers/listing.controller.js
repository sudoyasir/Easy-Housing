import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler("Listing not found", 404));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler("You can delete your own listings!", 401));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler("Listing not found", 404));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler("You can update your own listings!", 401));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
