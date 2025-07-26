import Wrapper from "../util/Wrapper";
import Arrow from "../assets/arrow.svg?react";
import { Link } from "react-router-dom";

const Body = (props) => {
  return (
    <Wrapper className="flex flex-col flex-1 w-full md:justify-between md:flex-row ">
      <div className="flex flex-col pt-8 w-[15rem] mb:pt-36 2xl:w-[30rem] lg:w-[25rem] md:w-[20rem] ">
        <h1 className="text-5xl leading-9 tracking-tighter md:text-6xl md:leading-12 lg:leading-14 lg:text-7xl 2xl:text-8xl 2xl:leading-22 xl:leading-16 font-regular grad">
          <span className="block pt-2">Discover</span>
          <span className="block pb-5">the wonders of space</span>
        </h1>
        <p className="text-xs font-light lg:pt-4 md:text-sm lg:leading-5 lg:text-base xl:text-xl">
          <span className="block text-a">
            A cosmic convergence of code, creativity, and
          </span>
          <span className="block text-white">
            curiosity, where minds ignite, ideas orbit, and
          </span>
          <span className="text-a">
            innovation takes flight among the stars
          </span>
        </p>
        <div className="block pt-6 md:hidden">
          <h1 className="text-3xl leading-7 text-white font-extralight">
            <span className="block">November</span>
            27th ,2025
          </h1>
          <p className="text-xs font-light lg:text-xl xl:text-lg 2xl:text-xl text-a">
            Nit, trichy
          </p>
        </div>
      </div>
      <div className="flex-col items-center justify-end hidden pb-8 md:flex md:pb-12 ">
        {/* UPDATED DISCOVER EVENT BUTTON */}
        <Link
          to="/events"
          className="relative flex flex-col items-center justify-center w-24 h-24 p-4 overflow-hidden text-sm font-light leading-4 text-white transition-colors duration-300 ease-in-out border border-white rounded-full cursor-pointer group md:text-base md:w-28 md:h-28 hover:border-white"
        >
          <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-300 ease-in-out origin-center transform scale-0 bg-white rounded-full group-hover:scale-100"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Arrow className="w-10 h-10 text-white transition-colors duration-300 ease-in-out md:w-14 md:h-14 group-hover:text-neutral-800" />
            <span className="text-white transition-colors duration-300 ease-in-out group-hover:text-neutral-800">
              Discover
            </span>
            <span className="text-white transition-colors duration-300 ease-in-out group-hover:text-neutral-800">
              event
            </span>
          </div>
        </Link>
      </div>

      {/* mobile */}
      <div className="absolute left-0 right-0 flex flex-col items-center justify-end pb-8 top-7/10 md:pb-12 md:hidden">
        {/* UPDATED DISCOVER EVENT BUTTON */}
        <Link
          to="/events"
          className="relative flex flex-col items-center justify-center w-24 h-24 p-4 overflow-hidden text-sm font-light leading-4 text-white transition-colors duration-300 ease-in-out border border-white rounded-full cursor-pointer group md:text-base md:w-28 md:h-28 hover:border-white"
        >
          <div className="absolute inset-0 z-0 w-full h-full transition-transform duration-300 ease-in-out origin-center transform scale-0 bg-white rounded-full group-hover:scale-100"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Arrow className="w-10 h-10 text-white transition-colors duration-300 ease-in-out md:w-14 md:h-14 group-hover:text-neutral-800" />
            <span className="text-white transition-colors duration-300 ease-in-out group-hover:text-neutral-800">
              Discover
            </span>
            <span className="text-white transition-colors duration-300 ease-in-out group-hover:text-neutral-800">
              event
            </span>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex flex-col justify-end md:pt-24 lg:pt-36 md:pl-14 md:w-[20rem]  lg:w-[25rem] 2xl:w-[30rem] xl:w-[25rem] lg:pl-38 xl:pl-22  2xl:pl-32">
        <div className="pb-12">
          <h1 className="text-white md:text-4xl lg:text-5xl lg:leading-10 xl:text-5xl 2xl:text-6xl xl:leading-12 font-extralight">
            <span className="block">November</span>
            27th ,2025
          </h1>
          <p className="font-light lg:text-xl xl:text-lg 2xl:text-xl text-a">
            NIT, Trichy
          </p>
        </div>
      </div>
    </Wrapper>
  );
};
export default Body;
