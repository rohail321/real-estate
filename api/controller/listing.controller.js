import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errors.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, userRef: req.user.id });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing does not exist"));
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can only delete own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing Deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return;
  if (req.user.id !== listing.userRef.toString())
    return next(
      errorHandler(404, "You are not authorize to delete this listing")
    );
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const data = await Listing.findOne({ _id: req.params.id });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const allListing = await Listing.find();
    if (!allListing) return next(errorHandler("404", "There is no listing"));
    console.log(allListing);
    res.status(200).json(allListing);
  } catch (error) {
    next(error);
  }
};

export const searchListing = async (req, res, next) => {
  let {
    limit,
    startIndex,
    offer,
    furnished,
    parking,
    type,
    searchTerm,
    sort,
    order,
  } = req.query;
  try {
    limit = parseInt(limit) || 8;
    startIndex = parseInt(startIndex) || 0;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    if (type === undefined || type === "false") {
      type = { $in: ["sell", "rent"] };
    }
    searchTerm ||= "";
    sort ||= "createdAt";
    order ||= "desc";
    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    console.log(listing);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
