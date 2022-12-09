export type Time = `${number} ${'days' | 'weeks' | 'months' | 'years'}`

// export function ago(from = today(), time: Time) {
//     const [value, unit] = time.split(' ')
//     if (unit === 'days') {
//         return new Date(from.getMilliseconds() - (+value * 24 * 60 * 60 * 1000))
//     }
//     if (unit === 'weeks') {
//         return new Date(from.getMilliseconds() - (+value * 7  * 24 * 60 * 60 * 1000))
//     }
//     if (unit === 'months') {
//         return new Date(from.getFullYear(), from.getMonth() - +value, from.getDate())
//     }
//     if (unit === 'years') {
//         return new Date(from.getFullYear() - +value, from.getMonth(), from.getDate())
//     }
//     return from
// }

export const Weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

export type DateConstructorValue = number | string | Date

export function date(value: number | string | Date): Date {
    return new Date(value)
}

export function dayInMonth(value: DateConstructorValue) {
    return date(value).getDate()
}

export function dayInWeek(value: DateConstructorValue) {
    return date(value).getDay()
}

export function expand(
    start: DateConstructorValue,
    end: DateConstructorValue,
    step = 'day',
) {
    const [dateStart, dateEnd] = [date(start), date(end)]
    const [msStart, msEnd] = [dateStart.getTime(), dateEnd.getTime()]
    const length = Math.floor(Math.abs(duration(start, end, step))) || 1
    // const dateCount = Math.floor(Math.abs(msEnd - msStart) / (1000 * 60 * 60 * 24)) + 1
    // const directionSign = msStart > msEnd ? -1 : 1
    const signed = (value: number) => msStart > msEnd ? -value : value
    return [...Array.from({ length }, (_, i) => {
        return new Date(
            year(start) + signed(+(step === 'year' && i)),
            month(start) + signed(+(step === 'month' && i)),
            dayInMonth(start) + signed(+((step === 'day' && i) || (step === 'week' && 7 * i))),
        )
    })]
}

export function daysInMonth(date = today()) {
    return end('month', date).getDate()
}

export function duration(
    start: DateConstructorValue,
    end: DateConstructorValue,
    granularity = 'day',
) {
    const [msStart, msEnd] = [start, end].map(milliseconds)

    if (granularity === 'minute') {
        return (msEnd - msStart) / (1000 * 60)
    }
    if (granularity === 'hour') {
        return (msEnd - msStart) / (1000 * 60 * 60)
    }
    if (granularity === 'day') {
        return (msEnd - msStart) / (1000 * 60 * 60 * 24)
    }
    if (granularity === 'week') {
        return (msEnd - msStart) / (1000 * 60 * 60 * 24 * 7)
    }

    const dYears = year(end) - year(start)
    const dMonths = month(end) - month(start) + dYears * 12

    if (granularity === 'month') {
        return dMonths
    }
    if (granularity === 'year') {
        return dYears
    }
    return 0
}

export function end(of: 'year' | 'month' | 'week', date = today()) {
    if (of === 'year') {
        return new Date(date.getFullYear() + 1, 1, 0, 0, 0, 0, 0)
    }
    if (of === 'month') {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0)
    }
    if (of === 'week') {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - date.getDay(), 0, 0, 0, 0)
    }
    return of
}

export function format(_value: DateConstructorValue = today(), format = 'dd MMM yyyy') {
    const value = date(_value)
    return format
        .replace('dddd', nameWeekday(value))
        .replace('ddd', nameWeekday(value).slice(0, 3))
        .replace('dd', `${value.getDate()}`.padStart(2, '0'))
        .replace('MMMM', nameMonth(value))
        .replace('MMM', nameMonth(value).slice(0, 3))
        .replace('MM', `${value.getMonth()}`.padStart(2, '0'))
        .replace('yyyy', `${value.getFullYear()}`)
        .replace('yy', `${value.getFullYear()}`.slice(2))
        .replace('hh', `${value.getHours()}`.padStart(2, '0'))
        .replace('mm', `${value.getMinutes()}`.padStart(2, '0'))
        .replace('ss', `${value.getSeconds()}`.padStart(2, '0'))
}

export function formatDuration(
    _start: DateConstructorValue,
    _end: DateConstructorValue,
    formats = [
        'yyyy - yyyy', // Duration span of years
        'MMMM dd - MMMM dd', // Duration span of months
        'dd MMM hh:mm - dd MMM hh:mm', // Duration span of days
        'dd MMM hh:mm - hh:mm', // Duration span of hours
    ],
) {
    const [start, end] = [_start, _end].map(date)
    const [yearStart, yearEnd] = [_start, _end].map(year)
    if (yearStart !== yearEnd) {
        const [formatStart, formatEnd] = formats[0].split('-')
        return format(start, formatStart.trim()) + ' - ' + format(end, formatEnd.trim())
    }
    const [monthStart, monthEnd] = [_start, _end].map(month)
    if (monthStart !== monthEnd) {
        const [formatStart, formatEnd] = formats[1].split('-')
        return format(start, formatStart.trim()) + ' - ' + format(end, formatEnd.trim())
    }
    const [dayInMonthStart, dayInMonthEnd] = [_start, _end].map(dayInMonth)
    if (dayInMonthStart !== dayInMonthEnd) {
        const [formatStart, formatEnd] = formats[2].split('-')
        return format(start, formatStart.trim()) + ' - ' + format(end, formatEnd.trim())
    }
    const [hoursStart, hoursEnd] = [_start, _end].map((value) => hours(value))
    if (hoursStart !== hoursEnd) {
        const [formatStart, formatEnd] = formats[3].split('-')
        return format(start, formatStart.trim()) + ' - ' + format(end, formatEnd.trim())
    }
}

export function hours(_value: DateConstructorValue = today(), pad = false) {
    const value = date(_value)
    if (pad) {
        return `${value.getHours()}`.padStart(2, '0')
    }
    return '' + value.getHours()
}

export function inRange(start: DateConstructorValue, end: DateConstructorValue, date: DateConstructorValue) {
    return year(date) >= year(start) && year(date) <= year(end)
        && month(date) >= month(start) && month(date) <= month(end)
        && dayInMonth(date) >= dayInMonth(start) && dayInMonth(date) <= dayInMonth(end)
}

export function isSameDate(dateA: Date, dateB: Date, what: 'date' | 'month' | 'year' = 'date') {
    return what === 'date'
        ? dateA.getFullYear() === dateB.getFullYear()
            && dateA.getMonth() === dateB.getMonth()
            && dateA.getDate() === dateB.getDate()
        : what === 'month'
        ? dateA.getFullYear() === dateB.getFullYear()
            && dateA.getMonth() === dateB.getMonth()
        : dateA.getFullYear() === dateB.getFullYear()
}

export function isSameDateTime(dateA: Date, dateB: Date) {
    return isSameDate(dateA, dateB, 'date')
        && dateA.getHours() === dateB.getHours()
        && dateA.getMinutes() === dateB.getMinutes()
}

export function isToday(date: Date) {
    return isSameDate(date, today())
}

export function last(timeUnit: 'day' | 'week' | 'month' | 'year', from: Date) {
    const year = from.getFullYear() - +(timeUnit === 'year')
    const month = from.getMonth() - +(timeUnit === 'month')
    const day = from.getDate() - +(timeUnit === 'day' || (timeUnit === 'week' && 7))
    return new Date(year, month, day)
}

export function milliseconds(value: DateConstructorValue) {
    return date(value).getTime()
}

export function minutes(date = today(), pad = false) {
    if (pad) {
        return `${date.getMinutes()}`.padStart(2, '0')
    }
    return '' + date.getMinutes()
}

export function month(value: DateConstructorValue) {
    return date(value).getMonth()
}

export function monthAsDayArray(date = today()) {
    const dayCount = daysInMonth(date)
    return Array.from({ length: dayCount }, (_, i) => (
        new Date(date.getFullYear(), date.getMonth(), i + 1))
    )
}

export function nameMonth(
    date = today(),
    format: 'long' | 'narrow' | 'short' = 'long',
    locale = 'en-us',
) {
    return date.toLocaleString(locale, { month: format })
}

export function nameWeekday(
    date = today(),
    format: 'long' | 'narrow' | 'short' = 'long',
    locale = 'en-us',
) {
    return date.toLocaleString(locale, { weekday: format })
}

export function next(timeUnit: 'day' | 'week' | 'month' | 'year', from: Date) {
    const year = from.getFullYear() + +(timeUnit === 'year')
    const month = from.getMonth() + +(timeUnit === 'month')
    const day = from.getDate() + +(timeUnit === 'day' || (timeUnit === 'week' && 7))
    return new Date(year, month, day)
}

export function start(of: 'year' | 'month' | 'week' | 'day', date = today()) {
    if (of === 'year') {
        return new Date(date.getFullYear(), 1, 1, 0, 0, 0, 0)
    }
    if (of === 'month') {
        return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
    }
    if (of === 'week') {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7), 0, 0, 0, 0)
    }
    if (of === 'day') {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    }
    return date
}

export function time(date = today(), format = 'hh:mm:ss') {
    return format
        .replace('hh', `${date.getHours()}`.padStart(2, '0'))
        .replace('mm', `${date.getMinutes()}`.padStart(2, '0'))
        .replace('ss', `${date.getSeconds()}`.padStart(2, '0'))
}

export function today() {
    return new Date()
}

export function tomorrow(from = today()) {
    return new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate() + 1,
    )
}

export function year(value: DateConstructorValue) {
    return date(value).getFullYear()
}
