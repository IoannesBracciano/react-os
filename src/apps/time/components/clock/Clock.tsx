import { useEffect, useMemo, useState } from 'react'
import './Clock.css'

export interface ClockProps {
    background?: string
    format?: string
    showMarks?: boolean
    showMinutes?: boolean
    showSeconds?: boolean
    showText?: boolean
    size?: string
}

export function Clock({ background, showMarks, showMinutes, showSeconds, showText, size }: ClockProps) {
    const [time, setTime] = useState(new Date())

    const rotations = useMemo(() => {
        const hourArc = 360 / 12
        const minuteArc = 360 / 60
        const secondArc = 360 / 60
        const hoursRotation = ((time.getHours() % 12) + (time.getMinutes() / 60)) * hourArc
        const minutesRotation = ((time.getMinutes() % 60) + (time.getSeconds() / 60)) * minuteArc
        const secondsRotation = (time.getSeconds() % 60) * secondArc

        return [hoursRotation, minutesRotation, secondsRotation]
    }, [time])

    useEffect(() => {
        const ticks = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => {
            clearInterval(ticks)
        }
    }, [])

    return (
        <div className='clock window-drag-surface'>
            <svg viewBox="0 0 40 40" style={{
                height: size || '160px',
                width: size || '160px',
            }}>
                <circle cx="20" cy="20" r="19" fill={background ? `url(${background})` : 'transparent'} />
                <line x1="0" y1="0" x2="0" y2="-9" className="hour" style={{
                    transform: `translate(20px, 20px) rotate(${rotations[0]}deg)`,
                }} />
                {showMinutes && <line x1="0" y1="0" x2="0" y2="-13" className="minute" style={{
                    transform: `translate(20px, 20px) rotate(${rotations[1]}deg)`,
                }} />}
                {showSeconds && <line x1="0" y1="0" x2="0" y2="-16" className="seconds" style={{
                    transform: `translate(20px, 20px) rotate(${rotations[2]}deg)`,
                }} />}
                {showMarks && <g className="marks">
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                    <line x1="15" y1="0" x2="16" y2="0" />
                </g>}
                <circle cx="20" cy="20" r="0.2" fill='#ffffff' strokeWidth={0.2} />
                <defs>
                    <pattern id="white" height="1" width="1">
                        <rect height="40" width="40" fill="#ffffff"/>
                    </pattern>
                    <pattern id="cat" height="1" width="1">
                        <rect height="40" width="40" fill="transparent"/>
                        <image xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="https://www.clipartmax.com/png/middle/266-2663820_created-as-a-smart-watch-face-background-asian.png" height="80" width="80" x="-21" y="-22"></image>
                    </pattern>
                    <pattern id="fruits" height="1" width="1">
                        <rect height="40" width="40" fill="transparent"/>
                        <image xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="https://mir-s3-cdn-cf.behance.net/projects/404/d1a39f107327625.Y3JvcCwzODM1LDMwMDAsMTA4Miww.jpg" height="80" width="80" x="-21" y="-22"></image>
                    </pattern>
                    <pattern id="coffee" height="1" width="1">
                        <rect height="40" width="40" fill="transparent"/>
                        <image xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="https://media.istockphoto.com/photos/monday-coffee-latte-picture-id1206975369?k=20&m=1206975369&s=612x612&w=0&h=fq7HU5scz9lYnpPn-q7o6eXRKi4ngm-3gI_qXCA4XpM=" height="60" width="60" x="-11" y="-11"></image>
                    </pattern>
                    
                </defs>
            </svg>{false &&
                <p className='time'>
                    {time.toLocaleTimeString()}
                </p>
            }</div>
    )
}