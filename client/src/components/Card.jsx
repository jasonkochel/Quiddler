const Card = ({ letter, value, showBack, small = false, innerRef, ...rest }) => (
  <div
    className={`my-1 bg-white rounded cursor-pointer bg-cover bg-center bg-no-repeat ${
      showBack ? "bg-card-back" : "bg-none"
    } ${small ? "h-10 w-[25px] ml-1 " : "h-16 w-[40px] mx-1"}`}
    ref={innerRef}
    {...rest}
  >
    {!showBack && (
      <div className="flex flex-col h-full text-center justify-evenly">
        <div className={`${small ? "text-xl" : "text-2xl"}`}>{letter}</div>
        {!small && <div className="text-gray-500">{value}</div>}
      </div>
    )}
  </div>
);

export default Card;
