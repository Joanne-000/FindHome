import { useContext ,useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getAllFavourites,createFav ,checkFavourite} from "../services/favouriteService";
import {
  useQuery,
  useMutation,
  useQueryClient ,
} from '@tanstack/react-query'
import debug from "debug";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { AxiosError } from "axios";


const log = debug("list:Fav Page");

const FavPage = () =>{
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("")
  const userId = user.id
  const navigate = useNavigate();
  const queryClient = useQueryClient()
    
      const { isPending, isError, data, error }  = useQuery({ 
        queryKey: ['favourites'], 
        queryFn:  () => getAllFavourites(userId)
      })
  
      const favMutation = useMutation({
              mutationFn: ({ userId, listingId })=>checkFavourite(userId, listingId),
              onSuccess: (data)=>{
                log("createFavMut",data)
                queryClient.invalidateQueries({ queryKey: ['favourites'] })
              },
              onError:(error)=>{  
              if (error instanceof AxiosError) {
                setMessage(error.response?.data?.err);
              } else {
                // Fallback for unexpected error types
                setMessage("An unknown error occurred.");
              }}
          })

      if (isPending) {
        return <span className="loading loading-spinner text-warning loading-xl" ></span>
      }
      if (isError) {
        log("error", error.response?.data?.err)
        return <span> {error.response?.data?.err}</span>
      }
       const handleFav = (e) =>{
          log(e.target.id)
          const listingId = e.target.id
          favMutation.mutate({userId,listingId})
       }
     
      //  log(data)
       
    return(
    <>
      <p>{message}</p>
      {data && data.map((item)=>(
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
            <button name="favBtn" type="button" id={item.id} onClick={handleFav}>Fav</button>
            </div>}
            </div>
          </div>
      ))}
      </>
    )
}

export default FavPage