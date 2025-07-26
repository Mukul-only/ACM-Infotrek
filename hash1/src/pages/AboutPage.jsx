import React from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";

const AboutPage = () => {
  const gap = "mb-4 w-fit";
  return (
    <div className="min-h-screen text-white bg-background">
      <Header />
      <Wrapper>
        <div className="px-3 py-12 md:py-16">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
            About INFOTREK'25
          </h1>
          <p className="mb-6 text-lg text-txt">
            INFOTREK'25 is the annual techno-cultural fest organized by the ACM
            Student Chapter of the Department of Computer Applications (MCA) at
            National Institute of Technology, Tiruchirappalli (NITT). A
            celebration of innovation, creativity, and collaboration, INFOTRECK
            serves as a vibrant platform for students across the country to
            showcase their technical prowess and artistic talents.
          </p>
          <h1 className="text-2xl font-medium sm:text-3xl text-neutral-300">
            Our Mission
          </h1>
          <p className="mb-6 text-lg text-txt">
            At INFOTREK, we believe in fostering a culture where technology
            meets imagination. Our mission is to bridge the gap between academia
            and the real world by encouraging students to engage with the latest
            trends in computer science, participate in hands-on events, and
            build meaningful connections. Whether you're a coder, designer,
            gamer, or performer—INFOTREK has something for you.
          </p>
          <h1 className="text-2xl font-medium sm:text-3xl text-neutral-300">
            Our Legacy
          </h1>
          <p className="mb-6 text-lg text-txt">
            INFOTREK has grown from a modest student-driven initiative into a
            major campus event known for its diverse blend of technical
            contests, workshops, cultural nights, and keynote talks. Over the
            years, we’ve hosted hundreds of participants, sparked countless
            ideas, and witnessed the birth of many innovations. As we enter
            INFOTREK'25, we aim to set the bar even higher with new events,
            bigger challenges, and unforgettable experiences.
          </p>
          <h1 className="mb-3 text-2xl font-medium sm:text-3xl text-neutral-30">
            Why Attend?
          </h1>
          <ul className="flex flex-col justify-start mx-auto mb-6 text-lg list-disc jmax-w-2xl text-txt">
            <li className={gap}>
              <span className="text-neutral-200">Tech Events : </span> coding
              competitions, UI/UX battles, and tech quizzes.
            </li>
            <li className={gap}>
              <span className="text-neutral-200">Workshops & Talks : </span>
              Learn from industry leaders, innovators, and alumni.
            </li>

            <li className={gap}>
              <span className="text-neutral-200">
                Networking Opportunities :
              </span>
              Meet like-minded individuals and potential collaborators.
            </li>
          </ul>
        </div>
      </Wrapper>
    </div>
  );
};

export default AboutPage;
