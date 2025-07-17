import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getAllListings } from "../services/listingService";
import {
  useQuery,
} from '@tanstack/react-query'
import debug from "debug";

const log = debug("list:Listings Page");

const ListingPage = () =>{
  const { user } = useContext(UserContext);

    const navigate = useNavigate();
    
      const { isPending, isError, data, error }  = useQuery({ 
        queryKey: ['listings'], 
        queryFn:  () => getAllListings()
      })
  
      log(data)

      if (isPending) {
        return <progress />
      }
    
      if (isError) {
        log("error", error.name)
        return <span> {error.message}</span>
      }

     
    return(
<>
      {data.map((item,index)=>(
          <div>
            <div>{item.images[0].imageurl}</div>
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
            <button name="detBtn" id={item.id} onClick={navigate(`/listings/${item.id}`)}>See details</button>
            </div>
            {user && 
            <div>
            <button name="favBtn" id={item.id}>Fav</button>
            </div>}
            </div>
          </div>
      ))}
      </>
    )
}

export default ListingPage