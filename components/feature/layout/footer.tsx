import { buttonVariants } from "@/components/ui/button";
import clsx from "clsx";
import {
  Home,
  User,
  ChartNoAxesColumn,
  Calendar,
  Newspaper,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const Footer = async () => {
  return (
    <footer className="p-2 fixed bottom-0 left-0 right-0 bg-background max-w-lg m-auto border-t border-accent">
      <Carousel className="bg-background">
        <CarouselContent className="flex justify-around">
          <CarouselItem className="flex-1">
            <Link
              href="/user/"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <Home size={16} />
            </Link>
          </CarouselItem>
          <CarouselItem className="flex-1">
            <Link
              href="/user/dates"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <Calendar size={16} />
            </Link>
          </CarouselItem>
          <CarouselItem className="flex-1">
            <Link
              href="/user/credits"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <ChartNoAxesColumn size={16} />
            </Link>
          </CarouselItem>
          <CarouselItem className="flex-1">
            <Link
              href="/user/newspaper"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <Newspaper size={16} />
            </Link>
          </CarouselItem>
          <CarouselItem className="flex-1">
            <Link
              href="/user/forms"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <ClipboardList size={16} />
            </Link>
          </CarouselItem>
          <CarouselItem className="flex-1">
            <Link
              href="/user/profile"
              className={clsx(
                buttonVariants({ variant: "outline" }),
                "w-full flex justify-center"
              )}
            >
              <User size={16} />
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </footer>
  );
};
