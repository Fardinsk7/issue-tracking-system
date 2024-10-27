"use client";

import React from "react";

import debounce from "lodash.debounce";

import SearchInput from "../components/SearchInput";

interface FleetsFilterProps {
  handleSearchVehicle: (searchTerm: string) => void;
}

function FleetsFilter({ handleSearchVehicle }: FleetsFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const debouncedhandleSearchVehicle = debounce((value: string) => {
    handleSearchVehicle(value);
    setSearchTerm(value);
  }, 600);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedhandleSearchVehicle(e.target.value.toUpperCase());
  };

  return (
    <div>
      <div className="mb-3">
        <SearchInput
          placeHolder="Search by Vehicle Number"
          searchTerm={searchTerm}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}

export default FleetsFilter;
