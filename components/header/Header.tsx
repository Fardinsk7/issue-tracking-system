import React from "react";

import Hamburger from "../sidebar/Hamburger";
import LogoutButton from "../logout";

function Header() {
  return (
    <>
    <div className="md:ml-[58px] p-2 max-md:px-2 border-b-[1px] border-zinc-300">
      <div className="flex justify-between items-center">
        <Hamburger />

      </div>
    </div>
    </>
  );
}

export default Header;
