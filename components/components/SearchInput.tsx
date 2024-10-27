import React from "react";

import debounce from "lodash.debounce";

import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  placeHolder: string;
  searchTerm: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeHolder,
  searchTerm,
  handleChange,
}) => {
  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder={placeHolder}
        onChange={handleChange}
        className="outline-none w-full h-9.5 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 placeholder-gray-500 border border-border_primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FaSearch className="w-4.5 h-4.5 text-accent" />
      </div>
    </div>
  );
};

const MemoizedSearchInput = React.memo(SearchInput);

MemoizedSearchInput.displayName = "SearchInput";

export default MemoizedSearchInput;
