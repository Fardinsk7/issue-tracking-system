"use client";

import React from "react";

import classNames from "classnames";

import { Menu, X } from "lucide-react";

import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store";

import { toggle } from "@/redux/features/sidebar-toogle-slice";

function Hamburger() {
  const dispatch = useDispatch();

  const sidebarToggle = useAppSelector((state) => state.sidebarToggle.value);

  const handleToggle = () => {
    dispatch(toggle());
  };

  return (
    <div className={classNames({
      "ml-[160px] relative z-[100]": sidebarToggle
    })}>
      {sidebarToggle ? (
        <X
          className={classNames({
            "cursor-pointer hover:text-accent": true,
          })}
          onClick={handleToggle}
        />
      ) : (
        <Menu
          className={classNames({
            "cursor-pointer hover:text-accent": true,
          })}
          onClick={handleToggle}
        />
      )}
    </div>
  );
}

export default Hamburger;