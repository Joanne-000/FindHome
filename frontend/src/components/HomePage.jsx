import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getTop5Listings } from "../services/authService";
import { checkFavourite } from "../services/favouriteService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { AxiosError } from "axios";
import FindHome from "../assets/FindHome.png";
import no_image from "../assets/no_image.png";

const log = debug("list:Listings Page");

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const userId = user?.id;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["listings"],
    queryFn: () => getTop5Listings(),
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

  const handleFav = (e) => {
    log(e.target.id);
    const listingId = e.target.id;
    favMutation.mutate({ userId, listingId });
  };

  return (
    <>
      <header className="card shadow-xl bg-base-300 rounded-box  flex-row items-center justify-center h-24 w-full mb-6">
        <img src={FindHome} alt="Logo" className="h-16 w-16 mr-4" />
        <h1 className="text-2xl font-semibold mb-1">
          Recently Posted Listings
        </h1>
      </header>
      <p className="text-sm text-gray-600">{message}</p>
      {isLoading ? (
        <div className="flex justify-center">
          <p className="loading loading-spinner items-center text-warning loading-xl"></p>
        </div>
      ) : (
        ""
      )}
      {isError ? (
        <p className="text-xl p-3 font-bold text-center text-neutral mb-4">
          {" "}
          {error?.response?.data?.err || "Something went wrong."}
        </p>
      ) : (
        ""
      )}
      {data && (
        <div className="card shadow-xl bg-base-300 rounded-box grid h-full w-full lg:h-3/4 place-items-center">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="card bg-base-200 w-96 m-3 shadow-lg"
              >
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
                    {item.images.length === 0 ? (
                      <SwiperSlide>
                        <img
                          className="h-full w-full object-cover"
                          src={no_image}
                          alt="no image"
                        ></img>
                      </SwiperSlide>
                    ) : (
                      item.images.map((image) => (
                        <SwiperSlide>
                          <img
                            className="h-full w-full object-cover"
                            key={image.id}
                            src={image.imageurl}
                            alt={item.propertyname}
                          ></img>
                        </SwiperSlide>
                      ))
                    )}
                  </Swiper>
                </div>
                <div className="card-body">
                  <div className="card-title">{item.propertyname}</div>
                  <div>
                    <div>{item.unitsize}m2</div>
                    <div>{item.bedroom} bed</div>
                    <div>{item.bathroom} bath</div>
                  </div>
                  <div>
                    $
                    {Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(item.price))}
                  </div>
                  <div className="card-actions justify-between">
                    <div className="text-sm text-gray-500 italic">
                      📅: {new Date(item.timestamptz).toLocaleDateString()}
                    </div>
                    <div className="flex flex-row justify-end">
                      <div className="px-3">
                        <button
                          className="btn btn-warning btn-sm"
                          name="detBtn"
                          type="button"
                          id={item.id}
                          onClick={() => navigate(`/listings/${item.id}`)}
                        >
                          See details
                        </button>
                      </div>
                      {user && (
                        <div className="px-3">
                          <button
                            className="btn btn-warning btn-sm"
                            name="favBtn"
                            type="button"
                            id={item.id}
                            onClick={handleFav}
                          >
                            ❤️ Fav
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
