import { useContext ,useState,useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getAllFavourites ,checkFavourite} from "../services/favouriteService";
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
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const userId = user?.id
  const navigate = useNavigate();
  const queryClient = useQueryClient()
    
      const { isLoading, isError, data, error }  = useQuery({ 
        queryKey: ['favourites',search], 
        queryFn:  () => getAllFavourites(userId,search)
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

       const handleFav = (e) =>{
          log(e.target.id)
          const listingId = e.target.id
          favMutation.mutate({userId,listingId})
       }
     
       const handleSearchChange = (e) =>{
        log(e.target.value)
        setInput(e.target.value)
      }
  
      const handleSearch = () => {
        log("inside handle delete 1")
        setSearch(input);
        };

      if (!user) {
        const timeout = setTimeout(() => navigate("/signin"),(1000*5))
        const clearTimeOut = () => clearTimeout(timeout)
        return clearTimeOut, (
          <div className="flex justify-center">
            <p>You are not signed in. You will be directing to sign in page soon...</p>
          </div>
      )}
      if (isLoading) {
        return (
          <div className="flex justify-center">
            <h1 className="loading loading-spinner items-center text-warning loading-xl" ></h1>
          </div>
        );
      }

      if (isError) {
        return (
        <div className="flex justify-center">
          <h1 className="text-xl p-3 font-bold text-center text-neutral mb-4"> Something went wrong. <br/> {error?.response?.data?.err}<span>{error?.response?.data?.err}</span> </h1>
        </div>
      )}

    return(
    <>
      <h1 className="text-3xl p-3 font-bold text-center text-warning mb-4">Favourite List</h1>
      <p>{message}</p>
      {isLoading?
      <div className="flex justify-center">
      <h1 className="loading loading-spinner items-center text-neutral loading-xl" ></h1>
      </div>
      :""}
      {isError? <h1 className="text-xl p-3 font-bold text-center text-neutral mb-4"> {error?.response?.data?.err  || "Something went wrong."}</h1> : ""}
      
      <div className="flex w-full flex-col lg:flex-row">
      <div className="card shadow-xl bg-base-300 rounded-box grid h-full w-full lg:w-1/4 place-items-center">
        <div className="flex flex-row justify-center">
          <label>
            <span className="font-semibold">Search: </span>
            <input
              name="search"
              value={input}
              onChange={handleSearchChange}
              className="input input-bordered w-60%"
              required
            />
            <button type="button" className="flex btn justify-end" onClick={handleSearch}>Search</button>
          </label>
        </div>
      </div>
<div className="divider lg:divider-horizontal"></div>
      <div className="card  shadow-xl bg-base-300 rounded-box grid h-full w-full lg:w-3/4 place-items-center">
      <div className="flex flex-wrap justify-center gap-4 p-4">
      {data.length === 0 ? 
          <p className="text-lg text-center text-neutral">No listings found for your search.</p>
         : 
        data.map((item)=>(
        <div key={item.id}  className="card bg-base-200 w-96 m-3 shadow-lg">
          <div className="h-48 w-full overflow-hidden rounded-t-md">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="h-full w-full"
              >
              {(item.images).map((image)=>(
              <SwiperSlide ><img className="h-full w-full object-cover" key={image.id} src={image.imageurl} alt={item.propertyname}></img></SwiperSlide>
            ))}
            </Swiper>
            </div>
              <div className="card-body">
                <div className="card-title">
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
            <div className="card-actions justify-end">
              <div>
                <button className="btn btn-warning" name="detBtn" type="button" id={item.id} onClick={() => navigate(`/listings/${item.id}`)}>See details</button>
              </div>
              {user && 
              <div>
                <button className="btn btn-warning btn-sm" name="favBtn" type="button" id={item.id} onClick={handleFav}>❤️ Fav</button>
              </div>}
            </div>
          </div>
        </div>
      ))}
      </div>
      </div>
      </div>
      </>
    )
}

export default FavPage