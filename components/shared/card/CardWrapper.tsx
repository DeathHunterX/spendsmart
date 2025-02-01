import React from "react";

interface Props {
  name?: string;
  children: React.ReactNode;
}

const CardWrapper = ({ name, children }: Props) => {
  return (
    <div>
      <div className="">
        <h3>{name}</h3>
      </div>
      {children}
    </div>
  );
};

export default CardWrapper;
