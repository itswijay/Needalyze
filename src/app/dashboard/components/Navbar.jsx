import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <div className="mx-auto max-w-7xl ">
      <ul className="flex justify-between items-center border-b p-5 border-gray-100">
        <li className="flex ">
          <Image
            src="/images/logos/main_favicon.png"
            width="25"
            height="25"
            alt="Needalyze-Logo"
            priority
          />
          <span className="text-lg font-semibold ml-2">Needalyze</span>
        </li>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <li>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </li>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>

            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </div>
  );
};

export default Navbar;
