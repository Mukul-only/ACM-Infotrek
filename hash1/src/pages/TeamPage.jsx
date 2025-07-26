import React from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { motion } from "framer-motion"; // Import motion

// Dummy data for team members (AS PROVIDED BY YOU, UNCHANGED)
const teamMembers = [
  {
    id: 1,
    name: "member",
    imageUrl:
      "https://images.unsplash.com/photo-1748190728342-3adb81c30261?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNzR8fHxlbnwwfHx8fHw%3D",
  }, // Col 1
  {
    id: 2,
    name: "Bob",
    imageUrl:
      "https://images.unsplash.com/photo-1746311503228-893ff1507b75?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  }, // Col 2
  { id: 3, name: "member" }, // Col 3
  { id: 4, name: "member" }, // Col 1
  { id: 5, name: "member" }, // Col 2
  { id: 6, name: "member" }, // Col 3
  { id: 7, name: "member" }, // Col 1
  { id: 8, name: "member" }, // Col 1
];

// TeamMemberCard component - (UNCHANGED AS PER YOUR DESCRIPTION, assumed to be in a separate file)
// For clarity, I'm including it here as you provided, but no changes are made to this component.
const TeamMemberCard = ({ member }) => {
  const memberName = member?.name || "Team Member";
  const memberRole = member?.role || "Member Role";
  const memberImageUrl =
    member?.imageUrl ||
    `https://plus.unsplash.com/premium_photo-1748218891487-e2391a723762?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMzF8fHxlbnwwfHx8fHw%3D`;

  return (
    <div className="group relative bg-zinc-800 rounded-2xl aspect-[3/4] border border-zinc-700 shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-out">
      <img
        src={memberImageUrl}
        alt={memberName}
        className="absolute inset-0 object-cover w-full h-full filter lg:grayscale"
        aria-hidden="true"
      />
      <img
        src={memberImageUrl}
        alt={memberName}
        className="absolute inset-0 w-full h-full object-cover 
                   transition-[clip-path] duration-900 ease-in-out 
                   [clip-path:circle(0%_at_50%_50%)] 
                   group-hover:[clip-path:circle(150%_at_50%_50%)]"
      />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-white transition-all duration-300 ease-in-out transform lg:translate-y-full lg:opacity-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
        <h3 className="mb-1 text-xl font-semibold">{memberName}</h3>
        <p className="text-sm text-zinc-300">{memberRole}</p>
      </div>
    </div>
  );
};

// TeamPage component - UPDATED WITH FRAMER MOTION
const TeamPage = () => {
  const yOffsetClass = "lg:-translate-y-16";

  // Framer Motion variants for the card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Start slightly down and transparent
    visible: (custom) => ({
      // 'custom' can be used for stagger/delay if needed
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.5,
        ease: "easeInOut",
        delay: (custom?.index % 3) * 0.1, // Optional: slight stagger for cards appearing in the same row
      },
    }),
  };

  return (
    <>
      <div className="min-h-screen text-white bg-background">
        <Header />
        <Wrapper>
          <div className="px-4 py-12 text-center md:py-16">
            <p className="text-base font-light tracking-widest sm:text-xl text-txt">
              MEET OUR
            </p>
            <h1 className="mb-6 text-4xl font-semibold sm:text-5xl">TEAM</h1>
            <p className="max-w-2xl mx-auto text-lg text-txt">
              INFOTREK’25 is planned, organized, and executed by the dedicated
              members of the ACM Student Chapter. From ideation to
              implementation, this team has worked across different areas to
              bring the fest to life.
            </p>
          </div>

          <div className="relative py-12 overflow-hidden md:py-20 lg:py-32">
            <h1
              className="font-extrabold text-[4rem] sm:text-[6rem] lg:text-[10rem] text-[#333333] text-center"
              aria-hidden="true"
            >
              TEAM
            </h1>

            <div className="relative z-10 grid max-w-6xl grid-cols-1 gap-1 px-4 mx-auto -mt-6 md:-mt-12 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
              {teamMembers.map((member, index) => {
                const isFirstColumnLg = index % 3 === 0;
                const isThirdColumnLg = index % 3 === 2;

                let cardSpecificClass = "";
                if (isFirstColumnLg || isThirdColumnLg) {
                  cardSpecificClass = yOffsetClass;
                }

                return (
                  <motion.div
                    key={member.id}
                    className={`${cardSpecificClass}`}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    custom={{ index }} // Pass index for potential custom delay logic
                    viewport={{ once: true, amount: 0.2 }} // Animate once when 20% of the card is visible
                  >
                    <TeamMemberCard member={member} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default TeamPage;
