import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { getAllListings } from "../services/listingService";
import { checkFavourite } from "../services/favouriteService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { AxiosError } from "axios";
import no_image from "../assets/no_image.png";

const log = debug("list:Listings Page");
const ListingsPage = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const userId = user?.id;
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [inputFilters, setInputFilters] = useState({
    propertyType: "",
    maxPrice: "",
    postedDate: "",
    bedrooms: "",
    location: "",
  });

  const [filters, setFilters] = useState({
    propertyType: "",
    maxPrice: "",
    postedDate: "",
    bedrooms: "",
    location: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["listings", search, filters],
    queryFn: () => getAllListings(search, filters),
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
        // Fallback for unexpected error types
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
          Something went wrong. <br /> {error?.response?.data?.err}
          <span>{error?.response?.data?.err}</span>{" "}
        </h1>
      </div>
    );
  }

  const handleFav = (e) => {
    log(e.target.id);
    const listingId = e.target.id;
    favMutation.mutate({ userId, listingId });
  };

  const handleSearchChange = (e) => {
    log(e.target.value);
    setInput(e.target.value);
  };

  const handleSearch = () => {
    log("inside handle search");
    setSearch(input);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    log("inside handle filter");
    setFilters(inputFilters);
  };

  const handleClear = () => {
    log("inside handle clear");
    setInput("");
    setSearch("");

    setInputFilters({
      propertyType: "",
      maxPrice: "",
      postedDate: "",
      bedrooms: "",
      location: "",
    });
    setFilters({
      propertyType: "",
      maxPrice: "",
      postedDate: "",
      bedrooms: "",
      location: "",
    });
  };

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
      <div className="flex w-full flex-col lg:flex-row p-3">
        <div className="card shadow-xl bg-base-300 rounded-box w-full lg:w-1/4 p-5 space-y-4">
          {/* Search Field */}
          <div className="form-control w-full">
            <label className="label-text font-semibold mb-1">
              Quick Search keywords
              <br />
              <span className="text-sm font-normal text-base-content/70">
                in title, address, town or MRT
              </span>
              <div className="flex gap-2 mt-2">
                <input
                  name="search"
                  value={input}
                  onChange={handleSearchChange}
                  className="input input-bordered w-full"
                  placeholder="Search properties..."
                  required
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </label>
          </div>

          {/* Property Type Filter */}
          <div className="form-control w-full pt-10">
            <label className="label-text font-semibold">
              Property Type
              <select
                value={inputFilters.propertyType}
                name="propertyType"
                className="select select-bordered w-full mt-1"
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="landed">Landed</option>
                <option value="condo">Condo</option>
              </select>
            </label>
          </div>

          {/* Max Price Filter */}
          <div className="form-control w-full">
            <label className="label-text font-semibold">
              Max Price
              <input
                value={inputFilters.maxPrice}
                type="number"
                name="maxPrice"
                className="input input-bordered w-full mt-1"
                placeholder="e.g. 500000"
                onChange={handleFilterChange}
              />
            </label>
          </div>

          {/* Posted Date Filter */}
          <div className="form-control w-full">
            <label className="label-text font-semibold">
              Posted Date
              <select
                value={inputFilters.postedDate}
                name="postedDate"
                className="select select-bordered w-full mt-1"
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="today">Today</option>
                <option value="week">Within a Week</option>
                <option value="month">Within a Month</option>
                <option value="3months">Within 3 Months</option>
              </select>
            </label>
          </div>

          {/* Bedrooms Filter */}
          <div className="form-control w-full">
            <label className="label-text font-semibold">
              Bedrooms
              <select
                value={inputFilters.bedrooms}
                name="bedrooms"
                className="select select-bordered w-full mt-1"
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </label>
          </div>

          {/* Location Filter */}
          <div className="form-control w-full">
            <label className="label-text font-semibold">
              Location
              <input
                value={inputFilters.location}
                name="location"
                className="input input-bordered w-full mt-1"
                placeholder="City or Zip"
                onChange={handleFilterChange}
              />
            </label>
          </div>

          {/* Apply Filters Button */}
          <div className="pt-2">
            <button
              className="btn btn-secondary w-full"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
          <div className="pt-10 flex justify-center">
            <button className="btn btn-neutral" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>
        <div className="card shadow-xl bg-base-300 rounded-box grid h-full w-full lg:w-3/4 place-items-center">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {data.length === 0 ? (
              <p className="text-lg text-center text-neutral">
                No listings found for your search.
              </p>
            ) : (
              data.map((item) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsPage;
