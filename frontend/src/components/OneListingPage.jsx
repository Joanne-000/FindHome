import { useEffect, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useParams } from "react-router";
import { getOneListing } from "../services/listingService";
import { checkFavourite } from "../services/favouriteService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Navigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { AxiosError } from "axios";

const log = debug("list:One Listing Page");

const OneListingPage = () => {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isAgent, setAgent] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    if (user?.userrole === "agent") {
      setAgent(true);
    }
  }, [user]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["listings", listingId],
    queryFn: () => getOneListing(listingId),
  });

  const favMutation = useMutation({
    mutationFn: ({ userId, listingId }) => checkFavourite(userId, listingId),
    onSuccess: (data) => {
      log("createFavMut", data);
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.err);
      } else {
        setMessage("An unknown error occurred.");
      }
    },
  });

  const handleFav = (e) => {
    log(e.currentTarget.id);
    const listingId = e.currentTarget.id;
    favMutation.mutate({ userId, listingId });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <h1 className="loading loading-spinner items-center text-warning loading-xl"></h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center">
        <h1 className="text-xl p-3 font-bold text-center text-neutral mb-4">
          {" "}
          Something went wrong. <br /> <span>
            {error?.response?.data?.err}
          </span>{" "}
        </h1>
      </div>
    );
  }

  const {
    address,
    agent_id,
    bathroom,
    bedroom,
    description,
    id,
    nearestmrt,
    price,
    propertyname,
    status,
    timestamptz,
    town,
    typeoflease,
    unitsize,
  } = data.listing;

  return (
    <>
      <p>{message}</p>
      {isLoading ? (
        <div className="flex justify-center">
          <h1 className="loading loading-spinner items-center text-warning loading-xl"></h1>
        </div>
      ) : (
        ""
      )}
      {isError ? (
        <h1 className="text-xl p-3 font-bold text-center text-neutral mb-4">
          {" "}
          {error?.response?.data?.err || "Something went wrong."}
        </h1>
      ) : (
        ""
      )}
      {data && (
        <div className="min-h-screen bg-base-100 p-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:gap-6">
            <div className="w-full lg:w-[70%] bg-base-200 rounded-xl shadow-lg p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold">{propertyname}</h1>
                  <p className="text-lg text-gray-700 mt-1">{address}</p>
                </div>

                <div className="flex gap-2">
                  {user && (
                    <button
                      className="btn btn-warning btn-sm"
                      name="favBtn"
                      type="button"
                      id={id}
                      onClick={handleFav}
                    >
                      ❤️ Fav
                    </button>
                  )}
                  {isAgent && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/listings/${listingId}/edit`)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>

              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="rounded-xl overflow-hidden"
              >
                {data.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <img
                      src={image.imageurl}
                      alt={propertyname}
                      className="w-full h-[400px] object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="bg-base-100 p-4 rounded-lg shadow-sm text-lg font-semibold">
                💰 Price: ${price}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-base-100 p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
                  📍 <span className="font-semibold">Town:</span> {town}
                </div>
                <div className="bg-base-100 p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
                  🚇 <span className="font-semibold">Nearest MRT:</span>{" "}
                  {nearestmrt}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-base-100 p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
                  🏠 <span className="font-semibold">Unit Size:</span>{" "}
                  {unitsize} m²
                </div>
                <div className="bg-base-100 p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
                  🛏️ <span className="font-semibold">Bedrooms:</span> {bedroom}
                </div>
                <div className="bg-base-100 p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
                  🛁 <span className="font-semibold">Bathrooms:</span>{" "}
                  {bathroom}
                </div>
              </div>

              <div className="bg-base-100 p-4 rounded-lg shadow-sm text-lg font-semibold">
                📄 Type of Lease: {typeoflease}
              </div>

              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <p className="text-lg">
                  <span className="font-semibold">Description:</span>{" "}
                  {description}
                </p>
              </div>

              <div className="text-sm text-gray-500 italic">
                📅 Posted on: {new Date(timestamptz).toLocaleDateString()}
              </div>
            </div>

            <div className="hidden lg:block lg:w-[5%]"></div>

            <div className="w-full lg:w-[25%] bg-base-200 rounded-xl shadow-lg p-6 flex flex-col items-center text-center space-y-6">
              <img
                src={data.agent[0].profilephoto}
                alt={data.agent[0].displayname}
                className="w-32 h-32 object-cover rounded-full border"
              />
              <p className="text-2xl font-bold">{data.agent[0].displayname}</p>
              <div className="space-y-2 text-sm text-left w-full text-gray-700">
                <p>
                  📇 <span className="font-semibold">License ID:</span>{" "}
                  {data.agent[0].licenseid}
                </p>
                <p>
                  📞 <span className="font-semibold">Contact:</span>{" "}
                  {data.agent[0].contactnumber}
                </p>
                <p>
                  🗓️ <span className="font-semibold">Joined on:</span>{" "}
                  {new Date(data.agent[0].timestamptz).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OneListingPage;
