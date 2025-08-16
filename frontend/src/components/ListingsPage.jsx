import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useSearchParams } from "react-router";
import { getAllListings } from "../services/listingService";
import { checkFavourite } from "../services/favouriteService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { AxiosError } from "axios";
import ListingCards from "./ListingCards";
import SearchFilter from "./SearchFilter";

const log = debug("list:Listings Page");
const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const userId = user?.id;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    propertyType: "",
    maxPrice: "",
    postedDate: "",
    bedrooms: "",
    location: "",
  });

  const [page, setPage] = useState(Number(searchParams.get("page")));

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["listings", search, filters, page],
    queryFn: () => getAllListings(search, filters, page),
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

  const itemPerPage = 6;
  let firstPage = 1;
  let currentPage = page || 1;
  let prevPage = currentPage - 1;
  let nextPage = currentPage + 1;
  let lastPage = Math.ceil(data?.countOfTotalListings / itemPerPage);

  console.log(
    "firstPage,currentPage,prevPage,nextPage,lastPage",
    firstPage,
    currentPage,
    prevPage,
    nextPage,
    lastPage
  );
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

  const handlePage = (e) => {
    console.log(e.target.name);
    const newPage = Number(e.target.name);
    setPage(newPage);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", e.target.name);
      return newParams;
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
        <SearchFilter setSearch={setSearch} setFilters={setFilters} />
        <div className="divider lg:divider-horizontal"></div>
        <div className="card shadow-xl bg-base-300 rounded-box grid h-full w-full lg:w-3/4 place-items-center">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {data.length === 0 ? (
              <p className="text-lg text-center text-neutral">
                No listings found for your search.
              </p>
            ) : (
              <ListingCards data={data.listingswImages} handleFav={handleFav} />
            )}
          </div>
          <div className="join">
            {firstPage === currentPage ? null : (
              <>
                <button
                  className="join-item btn"
                  name={firstPage}
                  onClick={handlePage}
                >
                  {firstPage}
                </button>
              </>
            )}
            {firstPage === prevPage || currentPage === 1 ? null : (
              <>
                <button
                  className="join-item btn"
                  name={prevPage}
                  onClick={handlePage}
                >
                  {prevPage}
                </button>
              </>
            )}
            <button
              className="join-item btn btn-active"
              name={currentPage}
              onClick={handlePage}
            >
              {currentPage}
            </button>
            {nextPage > lastPage || nextPage === lastPage ? null : (
              <button
                className="join-item btn"
                name={nextPage}
                onClick={handlePage}
              >
                {nextPage}
              </button>
            )}
            {currentPage === lastPage ? null : (
              <button
                className="join-item btn"
                name={lastPage}
                onClick={handlePage}
              >
                {lastPage}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsPage;
