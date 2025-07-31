/**
 * Brand compliance için durum ve renk sabitleri
 */
export const STATUS = {
  PASS: 'pass',
  WARNING: 'warning',
  FAIL: 'fail'
} as const

export type StatusType = typeof STATUS[keyof typeof STATUS]

export const STATUS_COLORS = {
  [STATUS.PASS]: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    bar: 'bg-green-500'
  },
  [STATUS.WARNING]: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    bar: 'bg-yellow-500'
  },
  [STATUS.FAIL]: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-500'
  },
  default: {
    text: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    bar: 'bg-red-500'
  }
}
