import React, { useState, useRef } from "react";
import Spacer from "../spacer";
import DownArrow from "../../assets/icons/Down.svg";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Rating from "react-rating";
import EmptyStar from '../../svgs/Star-empty.svg'
import FullStar from '../../svgs/full-star.svg'
import { Rate } from "antd";
import { Menu, Dropdown, Button, Space } from 'antd';



const SelectRating = ({
  label,
  placeholder = "",
  onChange = e => {},
  onBlur = () => {},
  name,
  error,
}) => {
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const dismissDropdown = () => {
    setIsMenuOpen(false);
  };

   // useOnClickOutside(dropdownRef, dismissDropdown);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSelectedOption = (option) => {
    let userRating
    if (option === 1) {
      userRating = `${option} Star`
    } else {
      userRating = `${option} Stars`
    }
      setSelectedOption(userRating);
    setIsMenuOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="text-input__root w-full md:w-[194px]"
    >
      {label && (
        <>
          <label htmlFor={label} className="text-lg font-bold">{label}</label>
          <Spacer height={8} />
        </>
      )}
      <div className="text-input rating-container w-full h-10">
        <div
          className="flex justify-between items-center relative w-full"
          onClick={handleClick}
        >
         {/*  <input
            type="text"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={selectedOption}
            placeholder={placeholder}
            className="text-input-inputField outline-none focus:outline-none w-full px-4 cursor-pointer"
          />
          <div className="px-2">
            <DownArrow />
          </div> */}
        </div>
        {/* <div
          style={{
            display: `${isMenuOpen ? "block" : "none"}`
          }}
          className="rating-menu-drop bg-white absolute w-48 z-50"
        >
          {[1, 2, 3, 4, 5].reverse().map((rating) => (
              <React.Fragment key={rating}>
                <Rate disabled defaultValue={rating} onChange={() => handleSelectedOption(rating)} />
                <span className="bg-black text-white p-2 
                  rounded-2xl text-center text-sm w-[39px] h-6 items-center">{rating}.0</span>
              </React.Fragment>
            ))}
        </div> */}
      </div>
      {error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default SelectRating;
