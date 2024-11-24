import React from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import ReactPaginate from 'react-paginate'
const Pagination = ({
  pageCount,
  handlePageClick,
  pageRangeDisplayed,
  setCurrentPagination,
}) => {
  return (
    <ReactPaginate
      previousLabel={<BiChevronLeft />}
      nextLabel={<BiChevronRight />}
      breakClassName='page-item'
      breakLinkClassName='page-link'
      pageCount={pageCount}
      onPageChange={(selected) => handlePageClick(selected)}
      containerClassName={'pagination-container'}
      previousLinkClassName={'previous_pagination_btn'}
      nextLinkClassName={'next_pagination_btn'}
      disabledClassName={'disabled_pagination_btn'}
      activeClassName={'active_pagination_btn'}
      pageRangeDisplayed={pageRangeDisplayed}
    />
  )
}

export default Pagination
