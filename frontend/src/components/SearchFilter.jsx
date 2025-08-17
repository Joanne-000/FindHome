import { useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import debug from "debug";

const log = debug("list:Filter Search");

const SearchFilter = ({ setSearch, setFilters }) => {
  const [input, setInput] = useState("");
  const [inputFilters, setInputFilters] = useState({
    propertyType: "",
    maxPrice: "",
    postedDate: "",
    bedrooms: "",
    location: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const bedrooms = searchParams.get("bedrooms");
    const location = searchParams.get("location");
    const keywords = searchParams.get("keywords");

    setInputFilters({ maxPrice, propertyType, bedrooms, location });
    setInput(keywords);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    log(e.target.value);
    setInput(e.target.value);
  };

  const handleSearch = () => {
    log("inside handle search");
    setSearchParams(() => {
      const newParams = new URLSearchParams(prev);
      newParams.set("search", input);
      return newParams;
    });
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
    const newParams = new URLSearchParams(searchParams);
    Object.entries(inputFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
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
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
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
    </>
  );
};

export default SearchFilter;
