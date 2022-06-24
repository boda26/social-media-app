import React from "react";
import poster from "../../img/poster.png";
import city from "../../img/city.jpeg";

const HomePage = () => {
  return (
    <>
      <section className="pb-6 bg-gray-800">
        <div className="relative container px-4   mx-auto">
          <div className="flex flex-wrap items-center -mx-4 mb-6 2xl:mb-6">
            <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
              {/* <span className="text-lg font-bold text-blue-400">
                Create posts to educate
              </span> */}
              <h2 className="max-w-2xl mt-6 mb-6 text-4xl 2xl:text-4xl text-white font-bold font-heading">
                Share your ideas with everyone{" "}
                <span className="text-yellow-500">By creating a post</span>
              </h2>
              <p className="mb-4 lg:mb-4 2xl:mb-4 text-l text-gray-100">
                Your post must be free from racism and unhealthy words
              </p>
            </div>
            <div className="w-full">
              <img className="w-full h-full" src={city} alt={city} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
