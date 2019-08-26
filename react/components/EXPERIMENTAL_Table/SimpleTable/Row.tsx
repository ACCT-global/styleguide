import React, { FC, useState } from 'react'

import Cell from './Cell'
import useTableContext from '../hooks/useTableContext'
import { NESTED_ROW_PREFIX_WIDTH } from '../constants'

/**
 * Container of each table row
 */
const RowContainer: FC = ({ children }) => {
  const { rowHeight } = useTableContext()
  return (
    <div
      style={{ height: rowHeight }}
      className="dt-row w-100 h-100 ph4 truncate overflow-x-hidden">
      {children}
    </div>
  )
}

/**
 * Row of the Table (suports nesting)
 * 🤓Be aware that the subRows are rendered recursivelly
 */
const Row: FC<RowProps> = ({ data, index, depth }) => {
  const { columns, nestedRows } = useTableContext()
  const [collapsed, setCollapsed] = useState(false)

  const { children, ...rowData } = data

  const rowKey = `row-${index}-${depth}`

  /**
   * Render subRows recursivelly increasing the depth
   */
  const subRows =
    nestedRows &&
    children &&
    children.map((data, index) => (
      <Row
        key={`${rowKey}__child-${index}`}
        depth={depth + 1}
        index={index}
        data={data}
      />
    ))

  /** Calculate the amount of indentation of the first column */
  const prefixWidth = depth * NESTED_ROW_PREFIX_WIDTH

  /**
   * Renders the entire row
   * @param arrow if has arrow on first cell, or not
   */
  const renderCells = (arrow?: boolean) => {
    return (
      <RowContainer key={rowKey}>
        {Object.keys(rowData).map((cel: string, cellIndex: number) => {
          const cellRender = columns[cel].cellRender
          const cellData = rowData[cel]
          const content = cellRender
            ? cellRender({ cellData, rowData })
            : cellData
          return (
            <Cell key={`cel-${index}-${cellIndex}-${depth}`}>
              {nestedRows && cellIndex === 0 && (
                <Cell.Prefix width={prefixWidth}>
                  {arrow && (
                    <Cell.Prefix.Arrow
                      active={collapsed}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  )}
                </Cell.Prefix>
              )}
              {content}
            </Cell>
          )
        })}
      </RowContainer>
    )
  }

  /**
   * Base case
   * Just render a leaf (Row that does not have children)
   */
  const renderLeaf = () => renderCells()

  /**
   * Recursive step
   * Render the Node itself and its subRows
   */
  const renderNode = () => {
    return (
      <>
        {renderCells(true)}
        {collapsed && subRows}
      </>
    )
  }

  return subRows ? renderNode() : renderLeaf()
}

interface RowProps {
  data: { children?: Array<unknown> }
  index: number
  depth?: number
}

Row.defaultProps = {
  depth: 1,
}

export default Row