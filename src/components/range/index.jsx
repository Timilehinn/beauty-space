import  React, {
  useCallback,
  useEffect,
  useState,
  useRef
} from "react";
import clsx from 'clsx';

const MultiRangeSlider = ({
  min,
  max,
  subTitle,
  onChange
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef();
  const maxValRef = useRef();
  const range = useRef();

  // Convert to percentage
  const getPercent = useCallback(
    value => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <>
    <div className="flex w-full md:w-[520px] items-center">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 100);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={clsx({
      ["thumb outline-none thumb--zindex-3"]: true,
      ["thumb--zindex-5"]: minVal > max - 100
    })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 100);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb w-[94%] md:w-[520px] thumb--zindex-4"
      />

      <div className="w-full relative mb-7">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
      <span className="flex flex-col text-[#7e7b7e] text-sm mt-2 mb-8">
        {subTitle}
      </span>
    </>
  );
};

export default MultiRangeSlider;
