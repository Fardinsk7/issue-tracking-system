import React from "react";

import Loader from "@/components/loaders/Loader";

function Loading() {
  return (
    <div className="flex justify-center items-center h-[85dvh]">
      <Loader />
    </div>
  );
}

export default Loading;
