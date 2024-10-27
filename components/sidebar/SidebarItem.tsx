"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";

import classNames from "classnames";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartArea,
  faChartLine,
  faMagnifyingGlassChart,
  faPager,
  faQuestion,
  faScrewdriverWrench,
  faTruck,
  faTruckArrowRight,
  faUsers,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import { RiLoginCircleFill } from "react-icons/ri";

import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store";
import { updateUser } from "@/redux/features/user-slice";

function SidebarItem() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user.value);
  const sidebarToggle = useAppSelector((state) => state.sidebarToggle.value);

  const [isOpen, setIsOpen] = React.useState<number | null>(null);

  const iconsStyle = React.useMemo(
    () => `h-[20px] w-[20px] ${sidebarToggle ? "ml-1.5" : ""}`,
    [sidebarToggle]
  );
  const childIconsStyle = React.useMemo(
    () => `h-[18px] w-[18px] ${sidebarToggle ? "ml-1.5" : ""}`,
    [sidebarToggle]
  );

  const sideBarItems = React.useMemo(() => {
    let items = [
      {
        label: "Dashboard",
        link: "/",
        icon: (
          <FontAwesomeIcon
            icon={faChartLine}
            className={iconsStyle}
          />
        ),
      },

      
     
      
    ];



    return items;
  }, []);

  const activePath = `/${pathname.split("/")[1]}`;

  React.useLayoutEffect(() => {
    if (!user) {
      const getUserData = async () => {
        // const userData = await getUser();
        // dispatch(updateUser(userData));
      };

      getUserData();
    }
  }, []);

  return (
    <div
      className={classNames({
        "max-md:hidden mt-3 w-[100%]": true,
      })}
    >
      {sideBarItems.map((item, i) => (
        <TooltipProvider key={item.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              {
                <div
                  className={classNames({
                    "px-2 py-[4px] flex rounded-sm mb-2": true,
                    "bg-accent": activePath === item.link,
                  })}
                >
                  <Item
                    link={item.link}
                    sidebarToggle={sidebarToggle}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              }
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

function Item({
  link,
  sidebarToggle,
  icon,
  label,
}: {
  link: string;
  sidebarToggle: boolean;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={link}
      className={classNames({
        "flex items-center rounded-[2px] text-muted-foreground transition-colors hover:text-foreground-center":
          true,
        "justify-center": !sidebarToggle,
      })}
    >
      {icon}
      {sidebarToggle ? (
        <span className="text-sm hover:text-foreground text-zinc-500 ml-3">
          {label}
        </span>
      ) : (
        <></>
      )}
    </Link>
  );
}

export default SidebarItem;
