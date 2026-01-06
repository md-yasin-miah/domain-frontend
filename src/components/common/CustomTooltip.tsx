import React from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

const CustomTooltip = ({
  children,
  content,
  side = 'top',
  align = 'center'
}: {
  children: React.ReactNode
  content: React.ReactNode | string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export default CustomTooltip