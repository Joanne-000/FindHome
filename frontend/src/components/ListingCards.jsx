import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import debug from "debug";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import no_image from "../assets/no_image.png";

const log = debug("list:Listings Page");

const ListingCards = ({ data, handleFav }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <div className="card shadow-xl flex flex-row flex-wrap justify-center gap-4 p-4">
        {data.map((item) => (
          <div key={item.id} className="card bg-base-200 w-80 m-3 shadow-lg">
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
    </>
  );
};

export default ListingCards;
