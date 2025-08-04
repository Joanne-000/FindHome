import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getTop5Listings } from "../services/authService";
import { checkFavourite } from "../services/favouriteService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { AxiosError } from "axios";
import ListingCards from "./ListingCards";

const log = debug("list:Listings Page");

const TopFavouriteCard = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const userId = user?.id;

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
        <div className="mt-10 card shadow-xl bg-base-300 rounded-box grid h-full w-full lg:h-3/4 place-items-center">
          <div className="card shadow-xl bg-base-150 rounded-box  flex-row items-center justify-center h-24 w-full mb-6">
            <h1 className="text-xl font-semibold mb-1">
              Top Favourite Listings
            </h1>
          </div>
          <ListingCards data={data} handleFav={handleFav} />
        </div>
      )}
    </>
  );
};

export default TopFavouriteCard;
