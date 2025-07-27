import "./SvgLoading.css";
const SvgLoading = (props) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <svg viewBox="0 0 400 160">
        <text
          x="50%"
          y="50%"
          dy=".32em"
          text-anchor="middle"
          className="text-4xl font-extrabold tracking-tight stroke-white loading-svg sm:text-xl"
          strokeWidth=".2"
        >
          Infotrek'25
        </text>
        <text
          x="50%"
          y="50%"
          dy=".32em"
          dx="2.5em"
          text-anchor="middle"
          className="text-4xl font-extrabold stroke-white loading-svg sm:text-xl"
          strokeWidth=".2"
        >
          .
        </text>
      </svg>
    </div>
  );
};
export default SvgLoading;
