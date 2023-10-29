import React from "react";

const Checkbox = ({ title, id, handleChange, type }) => {
  return (
    <div className='flex gap-2'>
      <input
        type='checkbox'
        id={id}
        className='w-5'
        checked={typeof type === "boolean" ? type : type === id}
        onChange={handleChange}
      />
      <span>{title}</span>
    </div>
  );
};

export default Checkbox;
