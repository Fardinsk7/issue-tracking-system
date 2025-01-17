import React from "react";

import Sidebar2 from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
      
        <main className="md:ml-[69px] pr-2 mt-2 max-md:px-2">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
