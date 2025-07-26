import React from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";

const ContactPage = () => {
  return (
    <div className="min-h-screen text-white bg-background">
      <Header />
      <Wrapper>
        <div className="py-12 text-center md:py-16">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="text-lg text-gray-300">
            Have questions or want to get in touch? Reach out to us!
          </p>
          <div className="mt-8 space-y-4">
            <p>
              Email:{" "}
              <a
                href="mailto:contact@infotrek.com"
                className="text-indigo-400 hover:underline"
              >
                contact@infotrek.com
              </a>
            </p>
            <p></p>
            {/* Add a contact form or more details */}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ContactPage;
