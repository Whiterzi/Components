import './Calendar.scss';
import React from 'react';
import { useState, useEffect } from 'react';
import * as dateFns from 'date-fns';

const Calendar = (props) => {

    // calendar layout setting--------------------------------
    const width = props.width || 320
    const height = props.height || 340
    const offsetX = props.init.position.offset + 10;
    const X = props.init.position.x;
    const Y = props.init.position.y;
    const wrapperStyle = {
        width: width + 'px',
        height: height + 'px',
        left: `${X + offsetX}px`,
        top: `${Y - height / 2}px`
    }
    useEffect(() => {
        props.bind(document.getElementById('calendar'))
    }, [0])
    // calendar layout setting--------------------------------

    // date logic --------------------------------------------
    const TitleOfDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']
    const [Today, setToday] = useState(Date.now())

    const dateFormat = 'MMMM yyyy';
    const setPrevMonth = () => setToday(dateFns.subMonths(Today, 1));
    const setNextMonth = () => setToday(dateFns.addMonths(Today, 1));

    const monthstart = dateFns.startOfMonth(Today)
    const monthend = dateFns.endOfMonth(Today)


    function dateformatter(x) {
        return parseInt(dateFns.format(x, 'dd'))
    }

    const CalendarBodyGenerate = () => {
        let CalendarBodyArray = []
        const calendarPrevMonthDay = dateFns.startOfWeek(monthstart)
        const calendarEndofPrevmonth = dateFns.endOfMonth(calendarPrevMonthDay)
        if (dateFns.format(calendarPrevMonthDay, dateFormat) !== dateFns.format(monthstart, dateFormat)) {
            for (var i = dateformatter(calendarPrevMonthDay); i <= dateformatter(calendarEndofPrevmonth); i++) {
                CalendarBodyArray.push(i)
            }
        }
        Array(parseInt(dateFns.format(monthend, 'dd'))).fill(0).map((_, n) => {
            CalendarBodyArray.push(n + 1)
        })
        if (CalendarBodyArray.length < 42) {
            const DEX = CalendarBodyArray.length
            if (DEX <= 35) {
                for (var j = 1; j <= (35 - DEX); j++) {
                    CalendarBodyArray.push(j)
                }
            } else
                for (var k = 1; k <= (42 - DEX); k++) {
                    CalendarBodyArray.push(k)
                }
        }
        return CalendarBodyArray
    }

    const onSelected = (e) => {
        const id = e.target.id
        const dayArr = id.split('-').map(v => parseInt(v))
        if ((dayArr[1] < 8 && dayArr[0] > 8)) {
            const prevToday = dateFns.subMonths(Today, 1)
            props.setDate(dateFns.format(prevToday, `yyyy/MM/${dayArr[0]}`))

        } else if (dayArr[0] < 15 && dayArr[1] > 20) {
            const nextToday = dateFns.addMonths(Today, 1)
            props.setDate(dateFns.format(nextToday, `yyyy/MM/0${dayArr[0]}`))

        } else {
            const day = dayArr[0] < 10 ? `0${dayArr[0]}` : dayArr[0]
            props.setDate(dateFns.format(Today, `yyyy/MM/${day}`))
        }
    }
    const CalendarBody = () => {
        let counter = -1
        // return Array(parseInt(dateFns.format(monthend, 'dd'))).fill(0).map((v, n) => {
        return CalendarBodyGenerate().map((v, n) => {
            counter += 1
            if (counter > 6) {
                counter = 0
            }
            if ((n < 8 && v > 8) || (v < 15 && n > 20)) {
                return (
                    <span day={v} key={`date-${v}-${n}`} id={`${v}-${n}`} className={`calendar-date-${counter} other-month`} onClick={onSelected}>
                        {v}
                    </span>
                )
            } else {
                return (
                    <span day={v} key={`date-${v}-${n}`} id={`${v}-${n}`} className={`calendar-date-${counter}`} onClick={onSelected}>
                        {v}
                    </span>
                )
            }
        })
    }
    // date logic --------------------------------------------
    switch (props.init.state) {
        case true:
            return (
                <div className="calendar-wrapper" style={wrapperStyle} id='calendar'>
                    <div className="calendar-month-row">
                        <span className="material-symbols-outlined arrows" onClick={setPrevMonth}>
                            {"<"}
                        </span>
                        <span>{dateFns.format(Today, dateFormat)}</span>
                        <span className="material-symbols-outlined arrows" onClick={setNextMonth}>
                            {">"}
                        </span>
                    </div>
                    <div className="calendar-date-row">
                        {TitleOfDay.map(v => (
                            <span key={v} className='calendar-date-row-title'>{v}</span>
                        ))}
                        <CalendarBody />
                    </div>
                </div>
            )
        default:
            return (
                <div id="calendar"></div>
            )
    }
}

const CalendarProvider = (prop) => {
    // 存放視窗顯示位置的資訊 offsetLeft , offsetTop ;用clientWidth來製造視窗相對於元件的偏移
    const initState = { state: false, position: {} }
    const [CalendarState, setCalendarState] = useState(initState)
    // 存放觸發彈窗事件的元件資訊
    const [Trigger, setTriggerInfo] = useState(null)
    // 存放月曆元件
    const [CalendarElement, bindCalendarElement] = useState(null)
    // getDate from this ------------------------------------------
    const [SelectedDate, setSelectedDate] = useState(null)
    useEffect(() => {
        if (SelectedDate != null) {
            prop.getDate(SelectedDate)
            setSelectedDate(null)
        }
    }, [SelectedDate])
    // getDate from this ------------------------------------------
    // 設定彈窗事件元件及判斷按下時月曆出現位置
    const onClick = (e) => {
        window.removeEventListener('click', onOutSideClick)
        setTriggerInfo(e)
        setCalendarState({ state: true, position: { x: e.target.offsetLeft, y: e.target.offsetTop, offset: e.target.clientWidth } })
    }
    // 視窗大小改變時月曆隨著元件位置改變自身位置
    const onResize = () => {
        setCalendarState(prev => ({ state: prev.state, position: { x: Trigger.target.offsetLeft, y: Trigger.target.offsetTop, offset: Trigger.target.clientWidth } }))
    }
    // 用CalendarElement判斷滑鼠點擊是否在元件外；是就關閉
    function onOutSideClick(event) {
        var isClickInsideElement = CalendarElement.contains(event.target);
        if (!isClickInsideElement && event.target !== Trigger.target) {
            //Do something click is outside specified element
            setCalendarState(initState)
            document.removeEventListener('click', onOutSideClick)
        }
    }
    // 綁定點擊和縮放大小的監聽事件
    useEffect(() => {
        window.removeEventListener('resize', onResize)
        window.removeEventListener('click', onOutSideClick)
        CalendarState.state && window.addEventListener('resize', onResize)
        CalendarState.state && document.addEventListener('click', onOutSideClick);
    }, [CalendarState.state]);

    return (
        <>
            {React.Children.map(prop.children, child => (
                React.cloneElement(child,
                    { onClick: onClick })
            ))}
            <Calendar init={CalendarState} bind={bindCalendarElement} setDate={setSelectedDate} />
        </>
    )
}

export default CalendarProvider;
