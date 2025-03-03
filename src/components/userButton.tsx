"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SignOutButton, useAuth, useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Position = {
  x: number;
  y: number;
};

const DraggableUserMenu = ({ user }: { user: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 10, y: 190 });
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "USER_MENU",
      item: { type: "USER_MENU", position },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          setPosition((prev) => ({
            x: Math.round(prev.x + delta.x),
            y: Math.round(prev.y + delta.y),
          }));
        }
      },
    }),
    [position],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = (e: any) => {
    if (!isDragging && !isDropdownOpen) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      //@ts-ignore
      ref={drag}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 50,
      }}
      className={cn(`select-none`)}
    >
      <div
        ref={menuRef}
        className="flex items-center gap-2 rounded-full border border-border bg-background p-1 shadow-lg transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-mutted relative my-2 ml-2 h-10 w-10 rounded-full">
          <img
            src={user?.imageUrl}
            alt="User"
            className="h-full w-full rounded-full object-cover"
          />
          <div className="absolute inset-0 rounded-full border-2 border-primary opacity-0 transition-opacity hover:opacity-100" />
        </div>

        {/* Expanding content */}
        <div
          className={cn(
            "relative flex items-center justify-between gap-2 overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "w-48 opacity-100" : "w-0 opacity-0",
          )}
        >
          <div className="min-w-[120px] pl-3">
            <p className="text-base font-medium">{user?.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger className="mr-2 rounded-full p-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring">
              <ChevronDown className="h-5 w-5 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="absolute right-0 mt-6 min-w-[210px]"
            >
              <DropdownMenuItem
                className=""
                onSelect={(event) => {
                  event.stopPropagation();
                  alert("Profile clicked");
                  setIsDropdownOpen(false);
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.stopPropagation();
                  alert("Settings clicked");
                  setIsDropdownOpen(false);
                }}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.stopPropagation();
                  signOut({ redirectUrl: "/sign-in" });
                }}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default function UserMenu() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <DndProvider backend={HTML5Backend}>
      {user && <DraggableUserMenu user={user} />}
    </DndProvider>
  );
}
