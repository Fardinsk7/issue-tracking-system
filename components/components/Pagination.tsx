import React from "react";

import classNames from "classnames";

import {
  Pagination as Pagin,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  maxPageCount: number;
  handleClick: (type: string, pageNumber: number) => void;
}

function Pagination({ currentPage, maxPageCount, handleClick }: PaginationProps) {
  return (
    <Pagin className="mt-3 mr-2 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleClick("prev", currentPage - 1)}
            className={classNames({
              "cursor-pointer": currentPage > 1,
              "text-border_primary hover:bg-transparent": currentPage === 1,
            })}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => handleClick("", currentPage)}
            className={classNames({
              "cursor-pointer": true,
            })}
          >
            {currentPage}<span className="text-gray-400">/{maxPageCount}</span>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => handleClick("next", currentPage + 1)}
            className={classNames({
              "cursor-pointer": currentPage <= maxPageCount,
              "text-border_primary hover:bg-transparent": currentPage === maxPageCount,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagin>
  );
}

export default Pagination;
