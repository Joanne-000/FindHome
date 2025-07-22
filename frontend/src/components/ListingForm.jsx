import { useEffect, useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import { getOneListing, createListing ,updateListing,deleteListing} from "../services/listingService";
import { AxiosError } from "axios";

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import debug from "debug";

const log = debug("list:Listing form")

const ListingForm = ({listingId}) => {
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const isEditing = listingId ? true : false;
  log("listingId",listingId)
  const queryClient = useQueryClient()

  const [isDeleting , setIsDelete] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState({imageurl1: "https://sg1-cdn.pgimgs.com/projectnet-project/218526/ZPPHO.153261118.R800X800.jpg"},
    {imageurl2: ""},
    {imageurl3: ""},
    {imageurl4: ""},
    {imageurl5: ""})

  const [formData, setFormData] = useState({
    agent_id: userId, 
    propertyname: "Blk 234 Andrew Road", 
    address: "Blk 234 Andrew Road Singapore 334234", 
    price: "650000", 
    town: "Novena", 
    nearestmrt: "Novena", 
    unitsize: "89",
    bedroom: "3",
    bathroom: "2", 
    typeoflease: "99-year lease", 
    description: "mid level floor", 
    status: "available",
    imageurls: Object.values(images),
    });
  
  const SGtown = [
    "Ang Mo Kio",
    "Bedok",
    "Bishan",
    "Bukit Batok",
    "Bukit Merah",
    "Bukit Panjang",
    "Bukit Timah",
    "Central Area",
    "Choa Chu Kang",
    "Clementi",
    "Geylang",
    "Hougang",
    "Jurong East",
    "Jurong West",
    "Kallang",
    "Lim Chu Kang",
    "Mandai",
    "Marine Parade",
    "Novena",
    "Pasir Ris",
    "Punggol",
    "Queenstown",
    "Sembawang",
    "Sengkang",
    "Serangoon",
    "Tampines",
    "Tanglin",
    "Toa Payoh",
    "Tuas",
    "Woodlands",
    "Yishun",
  ];

  const {
    agent_id, 
    propertyname, 
    address, 
    price, 
    town, 
    nearestmrt, 
    unitsize,
    bedroom,
    bathroom, 
    typeoflease, 
    description, 
    status,
    imageurls,
  }=formData

  const {
    imageurl1,imageurl2,imageurl3,imageurl4,imageurl5
  }= images

  useEffect(() => {
    const fetchListingDetails = async () => {
      const listingDet = await getOneListing(listingId);
      log("in useeffect")
      setFormData({
        agent_id: listingDet?.agent[0].id || "",
        propertyname: listingDet?.listing.propertyname || "",
        address: listingDet?.listing.address || "",
        price: listingDet?.listing.price || "",
        town: listingDet?.listing.town || "",
        nearestmrt: listingDet?.listing.nearestmrt || "",
        unitsize: listingDet?.listing.unitsize || "",
        bedroom: listingDet?.listing.bedroom || "",
        bathroom: listingDet?.listing.bathroom || "",
        typeoflease: listingDet?.listing.typeoflease || "",
        description: listingDet?.listing.description || "",
        status: listingDet?.listing.status || "",
      });
      setImages(
        {imageurl1: listingDet?.images[0]?.imageurl || "",
        imageurl2: listingDet?.images[1]?.imageurl || "",
        imageurl3:listingDet?.images[2]?.imageurl || "",
        imageurl4:listingDet?.images[3]?.imageurl || "",
        imageurl5: listingDet?.images[4]?.imageurl || ""})
    };
    fetchListingDetails();
  }, [listingId]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      imageurls: Object.values(images).filter(url => url.trim() !== ""),
    }));
  }, [images]);

  const createMutation = useMutation({
    mutationFn: ({ userId, formData })=>createListing(userId, formData),
    onSuccess: (data)=>{
      log("createMut",data)
      navigate(`/listings`)
      queryClient.invalidateQueries({ queryKey: ['listings'] })

    },
    onError:(error)=>{  
    if (error instanceof AxiosError) {
    setMessage(error.response?.data?.err);
    } else {
      // Fallback for unexpected error types
      setMessage("An unknown error occurred.");
    }}
})

  const updateMutation = useMutation({
    mutationFn: ({ userId, listingId, formData }) => updateListing(userId, listingId, formData),
    onSuccess: (data)=>{
      log("updMut",data)
      navigate(`/listings/${listingId}`)
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
    onError:(error)=>{
      if (error instanceof AxiosError) {
      setMessage(error.response?.data?.err);
    } else {
      // Fallback for unexpected error types
      setMessage("An unknown error occurred.");
    }}})

  const deleteMutation = useMutation({
    mutationFn: ({ userId, listingId }) => deleteListing(userId, listingId),
    onSuccess: ()=>{
      navigate(`/listings`)    
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
    onError:(error)=>{  if (error instanceof AxiosError) {
      setMessage(error.response?.data?.err);
    } else {
      // Fallback for unexpected error types
      setMessage("An unknown error occurred.");
    }}})
    
    if (createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) {
      return <span className="loading loading-spinner text-warning loading-xl" ></span>
    }

    const handleAddImage = () =>{
      setImages(prev => ({
        ...prev,
        [`imageurl${Object.keys(prev).length + 1}`]: ""
      }));
    }

    const handleChange = (evt) => {
      setMessage("");
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };
    const handleChangeImg = (evt) => {
      setMessage("");
      setImages({ ...images, [evt.target.name]: evt.target.value });
    };

  // const handleImageChange = (e, index) => {
  //   const newImages = [...images];
  //   newImages[index] = e.target.value;
  //   setImages(newImages);
  // };
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(isEditing ){
      log("formData",formData)
      updateMutation.mutate({ userId, listingId,formData })
    } else{
      log("userId formData",userId,formData)
    createMutation.mutate({userId, formData})
    }
  };
 
  const handleDelete = (evt) => {
    evt.preventDefault();
    log("inside handle delete 1")
    setIsDelete(true)
      deleteMutation.mutate({ userId, listingId })
    };

    if (!user) {
      const timeout = setTimeout(() => navigate("/signin"),(1000*5))
      const clearTimeOut = () => clearTimeout(timeout)
      return clearTimeOut, (
        <div className="flex justify-center">
          <p>You are not signed in. You will be directing to sign in page soon...</p>
        </div>
    )}
    
    return (
      <div className="min-h-screen bg-base-100 p-6">
  <div className="max-w-5xl mx-auto bg-base-200 rounded-xl shadow p-8 space-y-6">
    <h1 className="text-3xl font-bold">
      {isEditing ? "Edit Listing" : "Create a New Listing"}
    </h1>
    <p className="text-sm text-gray-500">Fields marked with * are required.</p>
    <p className="pb-4 text-xl text-center text-red-500">{message?<span className="font-bold">Warning: </span>:""}{message}</p>

    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Row 1: Property Name + Address */}
      <div className="grid md:grid-cols-2 gap-6">
        <label className="form-control w-full">
          <span className="label-text font-semibold">Property Name *</span>
          <input
            type="text"
            name="propertyname"
            value={propertyname}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text font-semibold">Address *</span>
          <textarea
            name="address"
            value={address}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </label>
      </div>

      {/* Row 2: Price + Town + MRT */}
      <div className="grid md:grid-cols-3 gap-6">
        <label className="form-control">
          <span className="label-text font-semibold">Price *</span>
          <input
            type="number"
            name="price"
            value={price}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text font-semibold">Town *</span>
          <select
            name="town"
            value={town}
            onChange={handleChange}
            className="select select-bordered"
            required
          >
            {SGtown.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text font-semibold">Nearest MRT *</span>
          <input
            type="text"
            name="nearestmrt"
            value={nearestmrt}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>
      </div>

      {/* Row 3: Unit Size, Bedrooms, Bathrooms */}
      <div className="grid md:grid-cols-3 gap-6">
        <label className="form-control">
          <span className="label-text font-semibold">Unit Size (m²) *</span>
          <input
            type="number"
            name="unitsize"
            value={unitsize}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text font-semibold">Bedrooms *</span>
          <input
            type="number"
            name="bedroom"
            value={bedroom}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text font-semibold">Bathrooms *</span>
          <input
            type="number"
            name="bathroom"
            value={bathroom}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>
      </div>

      {/* Row 4: Lease Type + Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <label className="form-control">
          <span className="label-text font-semibold">Type of Lease *</span>
          <input
            type="text"
            name="typeoflease"
            value={typeoflease}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text font-semibold">Status *</span>
          <input
            type="text"
            name="status"
            value={status}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </label>
      </div>

      {/* Row 5: Description */}
      <div>
        <label className="form-control">
          <span className="label-text font-semibold">Description *</span>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </label>
      </div>

      {/* Row 6: Image URLs */}
      <div className="space-y-4">
        <p className="font-semibold">Image URL</p>

        {Object.values(images).map((url,index) => (
          <div>
          <label key={index+1} className="form-control">
            <span className="label-text">Image URL {index+1}:</span>
            <textarea
              type="url"
              name={`imageurl${index+1}`}
              value={url}
              onChange={handleChangeImg}
              className="textarea textarea-bordered  w-full"
            />
          </label>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleAddImage}
        >
          ➕ Add More Images
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Listing" : "Create Listing"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete Listing
          </button>
        )}
      </div>
    </form>
  </div>
</div>

    );
    
};

export default ListingForm;
