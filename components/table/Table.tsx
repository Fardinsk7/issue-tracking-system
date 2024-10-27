"use client";

import React from "react";

import classNames from "classnames";
import Loader from "../loaders/Loader";

interface TableProps {
  data: any;
  columns: any;
  loading?: boolean;
  handleClick?: (row: any) => void;
}

function Table({ data, columns, loading, handleClick }: TableProps) {
  return (
    <div className="h-[450px] w-full overflow-y-scroll overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-20">
          <tr>
            {columns.map((column: any, i: number) => (
              <th
                key={i}
                className="bg-bg_accent text-[14px] first:border-l first:rounded-tl-[4px] last:border-r last:rounded-tr-[4px] py-3 font-normal text-zinc-800 text-left border-y border-border_primary z-20 whitespace-nowrap"
              >
                <p
                  className={classNames({
                    "pr-3 pl-2 border-l-2 border-border_primary": i !== 0,
                    "px-3": i === 0,
                    "text-zinc-700": true,
                  })}
                >
                  {column.headerName}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border border-border_primary">
          {!loading && data && data?.map((row: any, i: number) => (
            <tr
              key={i}
              onClick={() => handleClick && handleClick(row)}
              className={classNames({
                "cursor-pointer hover:bg-zinc-200": handleClick,
              })}
            >
              {columns.map((column: any, j: number) => (
                <td
                  key={j}
                  className="font-normal text-sm py-3 border-b border-border_primary whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  <p className="pl-3 text-[14px] text-zinc-700">
                    {typeof column.getCellValue === "function"
                      ? column.getCellValue(column.field, row)
                      : row[column.field]}
                  </p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="h-[450px] w-full flex justify-center items-center">
          <Loader />
        </div>
      )}

      {data?.length === 0 && (
        <div className="w-full text-zinc-700 text-center h-[300px] flex justify-center items-center">
          <p>No Data Available</p>
        </div>
      )}
    </div>
  );
}

const MemoizedTable = React.memo(Table);

MemoizedTable.displayName = "Table";

export default MemoizedTable;
