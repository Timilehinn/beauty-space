import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  getCapacity,
  setCapacity,
  setAmenities,
  getAmenities,
  setCanFilter,
  getMentorship,
  setMentorship,
  setPriceRangeFilter,
  setDistanceRangeFilter,
  setRating,
  setClearFilter,
  setDuration,
  getDuration,
  setCategory,
} from '../../slices/filterOptions'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import Close from '../../svgs/close.svg'
import Button from '../button'
import Capacity from '../capacity'
import RangeComponent from '../page-range'
import SelectRating from '../rating/ratingDropdown'
import useCookieHandler from '../../hooks/useCookieHandler'
import { Checkbox, Tag, Switch } from 'antd'
import RangeSlider from '../page-range/new_range_slider'
import axios from 'axios'

const FilterComponent = ({ toggleFilter, setShowFilter }) => {
  const { token, error, errorMessage } = useCookieHandler('user_token')
  const dispatch = useDispatch()
  const reduxCapacity = useSelector(getCapacity)
  const mentorship = useSelector(getMentorship)
  const reduxAmenities = useSelector(getAmenities)
  const [selectedId, setSelectedId] = useState('')
  const [amenitiesSelected, setAmenitiesSelected] = useState([])
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [isChecked, setIsChecked] = useState(false)
  const [techSelected, setTechSelected] = useState([])
  const [categoriesInit, setCategoriesInit] = useState([]);

  const [selectedCapacity, setSelectedCapacity] = useState(0)
  const [mentorshipSelected, setMentorshipSelected] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [priceRange, setPriceRange] = useState([200, 50000])
  const [distanceRange, setDistanceRange] = useState([1, 20])
  const [rate, setRate] = useState([0])
  const [amenitiesInit, setAmenitiesInit] = useState([])

  const [activeDuration, setActiveDuration] = useState([])
  const durationBtn = ['Hourly', 'Daily', 'Monthly','Yearly']
  const durationFilter = useSelector(getDuration)

  useEffect(() => {
    try {
      dispatch(setCategory(categoriesSelected));
    } catch (error) {}
  }, [categoriesSelected]);

  // useEffect(() => {
  
  // }, [amenities])

  const getAvailableAmenities = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/amenities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data?.status === false) {
        return
      }
      data?.data?.map((x) => {
        x?.items?.map((y) => {
          if (!amenitiesInit.includes(y?.name)) {
            setAmenitiesInit((prev) => [...prev, y?.name])
          }
        })
      })
    } catch (error) {}
  }
  const fetchCategories = async () => {
    const config = {
      url: `${process.env.REACT_APP_BASE_URL}/categories`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };

    const { data } = await axios(config);
    data?.data?.map((x) => {
      setCategoriesInit((prev) => [...prev, x?.name]);
    });
  };

  useLayoutEffect(() => {
    getAvailableAmenities()
    fetchCategories()
  }, [])

  useEffect(() => {
    try {
      dispatch(setAmenities(amenitiesSelected))
    } catch (error) {}
  }, [amenitiesSelected])

  useEffect(() => {
    try {
      dispatch(setCapacity(selectedCapacity))
    } catch (error) {}
  }, [selectedCapacity])

  useEffect(() => {
    try {
      dispatch(setMentorship(mentorshipSelected))
    } catch (error) {}
  }, [mentorshipSelected])

  useEffect(() => {
    try {
      dispatch(setPriceRangeFilter({ min: priceRange[0], max: priceRange[1] }))
      // dispatch(setPriceRangeFilter(priceRange));
    } catch (error) {}
  }, [priceRange])

  useEffect(() => {
    try {
      dispatch(
        setDistanceRangeFilter({ min: distanceRange[0], max: distanceRange[1] })
      )
      // dispatch(setDistanceRangeFilter(distanceRange));
    } catch (error) {}
  }, [distanceRange])

  useEffect(() => {
    try {
      dispatch(setRating(rate[0]))
    } catch (error) {}
  }, [rate])

    useEffect(() => {
      try {
        dispatch(setDuration(activeDuration))
      } catch (error) {}
    }, [activeDuration])

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag)
    setSelectedTags(nextSelectedTags)
  }

  const onChange = (e, item) => {
    setIsChecked(e.target.checked)
  }

  const handleSwitchChange = (e) => {
    setMentorshipSelected(e)
  }

  const handleIncrement = () => {
    setSelectedCapacity(Number(selectedCapacity) + 1)
  }

  const handleDecrement = () => {
    if (selectedCapacity > 1) {
      setSelectedCapacity(Number(selectedCapacity) - 1)
    }
  }

  const handleChecked = (x) => {
    const isExisting = amenitiesSelected.find((item) => item === x)
    if (isExisting) {
      const newArr = amenitiesSelected.filter((a) => a !== x)
      setAmenitiesSelected(newArr)
      return
    }
    setAmenitiesSelected([...amenitiesSelected, x])
  }

  const handleApplyFilter = () => {
    dispatch(setCanFilter(true))
    toggleFilter()
  }
  const handleClearFilter = () => {
    dispatch(setCanFilter(false))
    dispatch(setClearFilter(true))
    toggleFilter()
  }

  const handleCategoriesChecked = (x) => {
    const isExisting = categoriesSelected.find((item) => item === x);
    if (isExisting) {
      const newArr = categoriesSelected.filter((a) => a !== x);
      setCategoriesSelected(newArr);
      return;
    }
    setCategoriesSelected([...categoriesSelected, x]);
  };
  const displayCategory = categoriesInit.map((category, index) => {
    return (
      <Checkbox
        style={{ marginLeft: 10 }}
        onClick={() => handleCategoriesChecked(category)}
        name="categories"
        key={index}
        onChange={onChange}
      >
        {category}
      </Checkbox>
    );
  });

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <span className='text-lg font-bold'></span>
        <Close onClick={toggleFilter} />
      </div>

      {/* <div className="flex flex-wrap gap-4 items-center">
        {TechStacks.map((tag) => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={(checked) => handleChange(tag, checked)}
            className={clsx({
              ["h-10 px-4 py-2 rounded-lg border"]: true,
            })}
          >
            {tag}
          </CheckableTag>
        ))}
      </div> */}
      <span className='block text-lg font-bold mt-8 mb-6'>Categories</span>
      <div className='flex flex-wrap gap-4 items-center'>
        {displayCategory}
      </div>
      <span className='block text-lg font-bold mt-8 mb-6'>Amenities</span>
      <div className='flex flex-wrap gap-4 items-center'>
        {amenitiesInit.map((amenty, index) => (
          <Checkbox
            onClick={() => handleChecked(amenty)}
            name='amenities'
            key={index}
            onChange={onChange}
          >
            {amenty}
          </Checkbox>
        ))}
      </div>

      {/* Duration */}
      <div className='flex flex-col gap-2 py-2'>
        <span className='text-lg font-medium'> Duration </span>
        <div className='flex flex-row justify-start items-start gap-2'>
          {durationBtn.map((btn, key) => {
            const isActive = activeDuration.includes(btn)
            return (
              <button
                key={key}
                onClick={() =>
                  setActiveDuration(
                    isActive
                      ? activeDuration.filter((current) => current !== btn)
                      : [...activeDuration, btn]
                  )
                }
                className={
                  isActive
                    ? 'h-[45px] w-[90px] rounded-lg flex justify-center items-center cursor-pointer bg-blue-500 text-white'
                    : 'border-[1px] border-gray-400 h-[45px] w-[90px] rounded-lg flex justify-center items-center cursor-pointer'
                }
              >
                {btn}
              </button>
            )
          })}
        </div>
      </div>

      {/* Capacity */}
      <Capacity
        increment={handleIncrement}
        decrement={handleDecrement}
        selectedCapacity={selectedCapacity}
      />
      {/* Mentorship Session */}
      {/* <span className="block text-lg font-bold mt-8 mb-4">Mentorship</span>
      <Switch
        checkedChildren="Yes"
        unCheckedChildren="No"
        className="bg-[#055afd]"
        onChange={handleSwitchChange}
      /> */}
      <div className='sm:p-3'>
        <RangeSlider
          min={200}
          max={50000}
          step={1}
          title='Price Range'
          // subTitle="Distance in KM"
          setValues={setPriceRange}
          values={priceRange}
        />
        <RangeSlider
          min={0}
          max={5}
          step={0.5}
          title='Rating'
          isRating={true}
          setValues={setRate}
          values={rate}
        />
        <RangeSlider
          min={1}
          max={20}
          step={1}
          title='Distance Proximity'
          subTitle='Distance in KM'
          setValues={setDistanceRange}
          values={distanceRange}
        />
      </div>
      {/* Apply and clear buttons */}
      <div className='flex space-x-4 mb-10 my-14 -mt-4'>
        <button
          style={{
            padding: '2%',
            backgroundColor: 'blue',
            color: 'white',
            height: 30,
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 3,
          }}
          onClick={handleApplyFilter}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default FilterComponent
