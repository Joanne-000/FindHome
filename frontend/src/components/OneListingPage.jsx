import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {  useParams } from "react-router";
import { getOneListing } from "../services/listingService";
import {
  useQuery,
} from '@tanstack/react-query'
import debug from "debug";
import { faker } from '@faker-js/faker';

const log = debug("list:One Listing Page");

const OneListingPage = () =>{
  const { user } = useContext(UserContext);
const {listingId} = useParams()
log("user",user)

const [isAgent, setAgent] = useState(false)

if(user && user.userrole === "agent"){
  setAgent(true)
}
    log("listingId",listingId)

      const { isPending, isError, data, error }  = useQuery({ 
        queryKey: ['listings',listingId], 
        queryFn:  () => getOneListing(listingId)
      })
  

      log(data)

      if (isPending) {
        return <progress />
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
              <img width="200px" height="200px" src={data.images[0].imageurl} alt={propertyname}></img>
              <img width="200px" height="200px" src={faker.image.url()} alt={data.agent[0].displayname}></img>
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
            <button name="editBtn" type="button" id={id}>Edit Listing</button>
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