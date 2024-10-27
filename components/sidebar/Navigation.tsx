"use client"

import React from "react";

import Link from "next/link";

import classNames from "classnames";

import SidebarItem from "./SidebarItem";
import Logo from "../icons/Logo";

import { useAppSelector } from "@/redux/store";

function Navigation() {
  const sidebarToggle = useAppSelector((state) => state.sidebarToggle.value);

  return (
    <nav
      className={classNames({
        "max-md:hidden flex flex-col gap-4 px-2 sm:py-4": true,
        "pl-3 w-[210px] items-start": sidebarToggle,
        "items-center w-[55px]": !sidebarToggle
      })}
    >
      <Link href="#" className="flex">
        {/* <Logo /> */}
        {sidebarToggle ? <span className="text-sm text-zinc-500 ml-3 text-center">Issue Tracking App</span> : <></>}
      </Link>

      <SidebarItem />
    </nav>
  );
}

export default Navigation;
