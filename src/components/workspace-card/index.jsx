import React from 'react'
import clsx from 'clsx'

import Card from './card'

const WorkSpaceCard = ({ isListView, isGridView, currentPagelist }) => {
  return (
    <main
      className={clsx({
        ['grid gap-4 view-layout']: true,
        ['grid-cols-1 xxl:w-[80%] xl:w-[80%] lg:w-full md:w-full sm:w-full ']:
          isListView,
        ['grid special:grid-cols-4 xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 ']:
          isGridView,
      })}
    >
      <Card
        isListView={isListView}
        isGridView={isGridView}
        currentPagelist={currentPagelist}
      />
    </main>
  )
}

export default WorkSpaceCard
