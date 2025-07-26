const Wrapper = (props) => {
  return (
    <div
      className={`${props?.className} max-w-[96rem] mx-auto px-4 md:px-6 lg:px-12`}
    >
      {props.children}
    </div>
  );
};
export default Wrapper;
