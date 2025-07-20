import { useEffect, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {  useNavigate, useParams } from "react-router";
import { getOneListing } from "../services/listingService";
import {
  useQuery,
} from '@tanstack/react-query'
import debug from "debug";
import { faker } from '@faker-js/faker';
import { Navigate } from "react-router";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const log = debug("list:One Listing Page");

const OneListingPage = () =>{
    const { user } = useContext(UserContext);
    const {listingId} = useParams()
    const navigate = useNavigate()

    const [isAgent, setAgent] = useState(false)

    useEffect(() => {
      if (user?.userrole === "agent") {
        setAgent(true);
      }
    }, [user]);
    
      const { isPending, isError, data, error }  = useQuery({ 
        queryKey: ['listings', listingId], 
        queryFn: () => getOneListing(listingId),
      })

      if (isPending) {
        return <span className="loading loading-spinner text-warning loading-xl" ></span>
      }
    
      if (isError) {
        log("error", error.name)
        return <span> {error.message}</span>
      }

      const {address,agent_id,bathroom,bedroom,description,id,nearestmrt,price,propertyname,status,timestamptz,town,typeoflease,unitsize} = data.listing

    return(
        <>
          <div key={id}>
            <div>
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
              >
              {data.images.map((image)=>(
              <SwiperSlide ><img width="500px" height="500px" key={image.id} src={image.imageurl} alt={propertyname}></img></SwiperSlide>
            ))}
            </Swiper>
            </div>
              <div>
            <p>
            {propertyname}
            </p>
            <p>
            Address: {address}
            </p>
            </div>
            <div>
            <p>
            Unit Size: {unitsize}m2
            </p>
            <p>
            {bedroom} bed
            </p>
            <p>
            {bathroom} bath
            </p>
            </div>
            <div>
            {price}
            </div>
          </div>
          <div>
          <p>
            Town: {town}
            </p>
            <p>
            Nearest MRT: {nearestmrt}
            </p>
            </div>
          <div>
          <div>
          <div>
            {user && 
            <div>
            <button name="favBtn" type="button" id={id}>Fav</button>
            </div>}
            </div>
            <div>
            {isAgent && 
            <div>
            <button name="editBtn" type="button" id={id} onClick={() => navigate(`/listings/${listingId}/edit`)}>Edit Listing</button>
            </div>}
            </div>
          <img width="150px" height="150px" src={data.agent[0].profilephoto} alt={data.agent[0].displayname}></img>
            
          <img width="150px" height="150px" src={faker.image.personPortrait()} alt={data.agent[0].displayname}></img>
          </div>
            <div>
            <p>{data.agent[0].displayname}</p>
            <p>Agent License ID: {data.agent[0].licenseid}</p>
            <p>Contact Number: {data.agent[0].contactnumber}</p>
            <p>Join on {data.agent[0].timestamptz}</p>
            </div>
            </div>
      </>
    )
}

export default OneListingPage