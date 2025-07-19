import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getAllListings } from "../services/listingService";
import {
  useQuery,
} from '@tanstack/react-query'
import debug from "debug";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const log = debug("list:Listings Page");

const ListingsPage = () =>{
  const { user } = useContext(UserContext);

    const navigate = useNavigate();
    
      const { isPending, isError, data, error }  = useQuery({ 
        queryKey: ['listings'], 
        queryFn:  () => getAllListings()
      })
  
      if (isPending) {
        return <progress />
      }
    
      if (isError) {
        log("error", error.name)
        return <span> {error.message}</span>
      }

     
    return(
<>
      {data.map((item)=>(
          <div key={item.id}>
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
              {(item.images).map((image)=>(
              <SwiperSlide ><img width="500px" height="500px" key={image.id} src={image.imageurl} alt={item.propertyname}></img></SwiperSlide>
            ))}
            </Swiper>
            </div>
            <div>
            {item.propertyname}
            </div>
            <div>
            <div>
            {item.unitsize}m2
            </div>
            <div>
            {item.bedroom} bed
            </div>
            <div>
            {item.bathroom} bath
            </div>
            </div>
            <div>
            {item.price}
            </div>
            <div>
            <div>
            <button name="detBtn" type="button" id={item.id} onClick={() => navigate(`/listings/${item.id}`)}>See details</button>
            </div>
            {user && 
            <div>
            <button name="favBtn" type="button" id={item.id}>Fav</button>
            </div>}
            </div>
          </div>
      ))}
      </>
    )
}

export default ListingsPage