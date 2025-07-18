import { useEffect, useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import { getOneListing, createListing ,updateListing,deleteListing} from "../services/listingService";

import {
  useMutation,
} from '@tanstack/react-query'
import debug from "debug";

const log = debug("list:Listing form")

const ListingForm = ({listingId}) => {
  const { user } = useContext(UserContext);
  const userId = user.id;
  const isEditing = listingId ? true : false;
  log("listingId",listingId)

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
  }=formData

  const {
    imageurl1,imageurl2,imageurl3,imageurl4,imageurl5
  }= images

  useEffect(() => {
    const fetchListingDetails = async () => {
      const listingDet = await getOneListing(listingId);
      log("in useeffect",listingDet)
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
        {imageurl1: listingDet?.images[0].imageurl},
        {imageurl2: listingDet?.images[1].imageurl},
        {imageurl3:listingDet?.images[2].imageurl},
        {imageurl4:listingDet?.images[3].imageurl},
        {imageurl5: listingDet?.images[4].imageurl})
    };
    fetchListingDetails();
  }, [listingId]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      imageurls: Object.values(images),
    }));
  }, [images]);

  const createMutation = useMutation({
    mutationFn: ({ userId, formData })=>createListing(userId, formData),
    onSuccess: (data)=>{
      log("createMut",data)
      navigate(`/listings`)
    },
    onError:(error)=>{log(error.message)}
})
    
    const updateMutation = useMutation({
      mutationFn: ({ userId, listingId, formData }) => updateListing(userId, listingId, formData),
      onSuccess: (data)=>{
        log("updMut",data)
        navigate(`/listings`)
      },
      onError:(error)=>{log(error.message)}})

      const deleteMutation = useMutation({
        mutationFn: ({ userId, listingId }) => deleteListing(userId, listingId),
        onSuccess: ()=>{
          navigate(`/listings`)    
        },
        onError:(error)=>{log(error.message)}})
  
    if (createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) {
      return <progress />
    }

    if (createMutation.isError) {
      log("error", createMutation.error.name)
      return <span>{createMutation.error.message}</span>
    }
    if ( updateMutation.isError) {
      return <span>{updateMutation.error.message}</span>
    }
    if ( deleteMutation.isError) {
      return <span>{deleteMutation.error.message}</span>
    }

    // if (createMutation.isError) {
    //   log("error", createMutation.error.name)
    //   const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    //   const clearTimeOut = () => clearTimeout(timeout)
    //   return clearTimeOut, <span>{createMutation.error.message}</span>
    // }
    // if ( updateMutation.isError) {
    //   const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    //   const clearTimeOut = () => clearTimeout(timeout)
    //   return clearTimeOut, <span>{updateMutation.error.message}</span>
    // }
    // if ( deleteMutation.isError) {
    //   const timeout = setTimeout(() => navigate("/signin"),(1000*5))
    //   const clearTimeOut = () => clearTimeout(timeout)
    //   return clearTimeOut, <span>{deleteMutation.error.message}</span>
    // }

    const handleAddImage = () =>{
      setImages(images.push(""))
      
    }
  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };
  const handleChangeImg = (evt) => {
    setMessage("");
    setImages({ ...images, [evt.target.name]: evt.target.value });
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(isEditing ){
      log("userId formData listingId",userId,listingId,formData)
      log("updateMutation",updateMutation.mutate({ userId, listingId,formData }))

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

  // const handleNA = (evt) => {
  //   evt.preventDefault();
  //   log("inside handle delete 1")
  //   setIsDelete(true)
  //   log("inside handle delete formData",formData)
  //   setFormData({
  //     ...formData,
  //     status: "not available" // Update only status
  //   })
  //     log("inside should delete", formData)
  //     deleteMutation.mutate({ listingId,formData })
  //   };


  return (
    <>
    <div>
      <h1>
        {isEditing ? "Edit listing" : "Create a new listing"}
      </h1>
      <p >Fields marked with * are required</p>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
      <div >
              <label>Property Name *: 
              <input
                type="text"
                id="propertyname"
                value={propertyname}
                name="propertyname"
                onChange={handleChange}
                required
                />
              </label>
            </div>
          <div >
          <label >Address *:
          <textarea
            type="text"
            id="address"
            value={address}
            name="address"
            onChange={handleChange}
            required
            />
          </label>
        </div>
            <div >
        <label >Price *: $ 
        <input
          type="number"
          id="price"
          value={price}
          name="price"
          onChange={handleChange}
          required
          />
        </label>
      </div>
            <div>
              <label >Town *:
                <select value={town} type="text"
                id="town" 
                name="town"
                onChange={handleChange}
                required>
                  {SGtown.map((item,index)=>(
                    <option name={item} key={index}>{item}</option>
                  ))}
                </select>
            </label>
            </div>              
            <div >
              <label >Nearest MRT *:
              <input
                type="text"
                id="nearestmrt"
                value={nearestmrt}
                name="nearestmrt"
                onChange={handleChange}
                required
              />
              </label>
            </div>
        <div >
          <label >Unit Size *:
          <input
            type="number"
            id="unitsize"
            value={unitsize}
            name="unitsize"
            onChange={handleChange}
          />m2
          </label>
        </div>
        <div >
          <label >Bedroom *:
          <input
            type="number"
            id="bedroom"
            value={bedroom}
            name="bedroom"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
        <label >Bathroom *:
          <input
            type="number"
            id="bathroom"
            value={bathroom}
            name="bathroom"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
        <label >Type of Lease *:
          <input
            type="text"
            id="typeoflease"
            value={typeoflease}
            name="typeoflease"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
        <label >Description *:
        <textarea
            type="text"
            id="description"
            value={description}
            name="description"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
        <label >Status *:
          <input
            type="text"
            id="status"
            value={status}
            name="status"
            onChange={handleChange}
          />
          </label>
        </div>
        <div >
            <button type="button" onClick={()=>handleAddImage()}>
              Add more images
            </button>
            </div>
            <div >
  <label >
    Image URL :
    <textarea
      type="url"
      id={`imageurl1`}
      value={imageurl1}
      name={`imageurl1`}
      onChange={handleChangeImg}
    />
  </label><br/>
  <label >
    Image URL :
    <textarea
      type="url"
      id={`imageurl2`}
      value={imageurl2}
      name={`imageurl2`}
      onChange={handleChangeImg}
    />
  </label><br/>
  <label >
    Image URL :
    <textarea
      type="url"
      id={`imageurl3`}
      value={imageurl3}
      name={`imageurl3`}
      onChange={handleChangeImg}
    />
  </label><br/>
  <label >
    Image URL :
    <textarea
      type="url"
      id={`imageurl4`}
      value={imageurl4}
      name={`imageurl4`}
      onChange={handleChangeImg}
    />
  </label><br/>
  <label >
    Image URL :
    <textarea
      type="url"
      id={`imageurl5`}
      value={imageurl5}
      name={`imageurl5`}
      onChange={handleChangeImg}
    />
  </label>
</div>
        {isEditing ? (
          <div >
            <button type="submit" >
              Update Listing
            </button>
            <button type="button" onClick={handleDelete} disabled={isDeleting }>
              Delete Listing
            </button>
            <button  type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        ) : (
          <div >
            <button
              type="submit"
            >
              Create Listing
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        )}
      </form>
      {!isEditing && (
        <Link to="/login">
          Already have an account? Login Here
        </Link>
      )}
    </div>
    </>
  );
};

export default ListingForm;
