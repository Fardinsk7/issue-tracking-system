import React from "react";

import Navigation from "./Navigation";

function Sidebar() {
  return (
    <aside className="md:absolute z-[101] md:h-dvh md:flex-col border-r-[1px] border-zinc-300 bg-bg_accent">
      <div className="relative max-md:h-[32px] border-secondary/[0.5] max-md:border-b-[1px]">
        <Navigation />
      </div>
    </aside>
  );
}

export default Sidebar;
