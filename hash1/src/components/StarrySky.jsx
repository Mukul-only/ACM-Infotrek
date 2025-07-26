import React, { useState, useEffect, useMemo } from "react";
import "./StarrySky.css"; // Import the CSS

const returnRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const StarrySky = ({
  numBigStars = 20,
  numAverageStars = 90,
  numSmallStars = 180,
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // Set initial dimensions
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderStarsForGroup = (count, classNameStar, groupKeyPrefix) => {
    const stars = [];
    if (dimensions.width === 0 || dimensions.height === 0) return stars; // Don't render if no dimensions

    for (let i = 0; i < count; i++) {
      stars.push(
        <div
          key={`${groupKeyPrefix}-${classNameStar}-${i}`}
          className={`star ${classNameStar}`}
          style={{
            top: `${returnRandomInt(dimensions.height)}px`,
            // Using 'left' for consistency, 'right' is also fine
            left: `${returnRandomInt(dimensions.width)}px`,
          }}
        />
      );
    }
    return stars;
  };

  // useMemo to avoid re-calculating stars on every render unless dimensions change
  const starElements = useMemo(() => {
    if (dimensions.height === 0) return null; // Or an empty array

    const translateYValue = `-${dimensions.height}px`;

    const starConfigurations = [
      { count: numBigStars, className: "big-star" },
      { count: numAverageStars, className: "average-star" },
      { count: numSmallStars, className: "small-star" },
    ];

    return starConfigurations.flatMap((config, index) => {
      // Generate stars once for this type
      const starsForType = renderStarsForGroup(
        config.count,
        config.className,
        `type-${index}`
      );

      // Create two groups for seamless looping
      return [
        <div
          key={`star-group-${config.className}-1-${index}`}
          className="star-group"
          style={{
            top: `0px`,
            "--translateY": translateYValue, // Set CSS custom property
          }}
        >
          {starsForType}
        </div>,
        <div
          key={`star-group-${config.className}-2-${index}`}
          className="star-group"
          style={{
            top: `${dimensions.height}px`,
            "--translateY": translateYValue,
          }}
        >
          {starsForType} {/* Render the same set of stars */}
        </div>,
      ];
    });
  }, [
    dimensions.width,
    dimensions.height,
    numBigStars,
    numAverageStars,
    numSmallStars,
  ]);

  return (
    <div className="starry-sky-main" id="starry-sky-main-container">
      {" "}
      {/* Changed class and id from original 'main' */}
      {starElements}
    </div>
  );
};

export default StarrySky;
