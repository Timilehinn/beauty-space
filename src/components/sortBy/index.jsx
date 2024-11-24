import React, { useRef} from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutside';
import DownArrow from '../../svgs/DropDownIcon.svg'

const SortedByComponent = ({ 
  width = 250,
  size,
  setFilterCriteria,
  filterDropdownVisible,
  setFilterDropdownVisible,
  filterCriteria,
  dismissFilterDropdown
}) => {
  
  const FilterOptions = ['Populatity', 'Latest'];

  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, dismissFilterDropdown);

  return (
    <div
      ref={dropdownRef}
      className="dropdown flex items-center"
      >
        <span className="mr-4">Sort by:</span>
        <div>
          <button className="flex items-center bg-slate-50 h-8 pl-3 pr-3 rounded-lg text-slate-500"
            type="button"
            onClick={e => setFilterDropdownVisible(true)}
          >
            {filterCriteria}
            <DownArrow className="ml-8" />
          </button>
        </div>
          {filterDropdownVisible && (
          <div className="dropdown__filter" ref={dropdownRef}>
            {FilterOptions.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={e => setFilterCriteria(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}

export default SortedByComponent
