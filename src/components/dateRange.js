import React from 'react';
import Popup from 'reactjs-popup';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values');

// How to use this component
// <DateRange start={state.filter_by_start_date} end={state.filter_by_end_date} onRangeChange={date => this.setState({ filter_by_start_date: date.start, filter_by_end_date: date.end })}>
//     <div className="stretch-to-mobile custom-select" style={{ margin: "0 5px", width: 100 }}>
//         <div className="select-selected stretch-width text-left">Date</div>
//     </div>
// </DateRange>

class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dateStart: "", dateEnd: "", disabled: false }
    }

    componentDidMount() { // para ma save ung pinasa ng component
        let { start, end } = this.props;
        if(start && end) this.setState({ dateStart: start, dateEnd: end });
    }

    componentDidUpdate() { // para ma update ung bagong value sa component
        let { start, end } = this.props, { dateStart, dateEnd } = this.state;
        if(start !== dateStart || end !== dateEnd) this.setState({ dateStart: start, dateEnd: end });
    }

    setDateRange(param) {
        let days_ago = 0,
            end = new Date();
        
        if (param === "today") days_ago = 0;
        else if (param === "yesterday") {
            days_ago = 1;
            end = points.getPastDate(days_ago);
        } else if (param === "week") days_ago = points.getThisWeekDay();
        else if (param === "month") {
            let first_day_of_month = new Date();
            first_day_of_month.setDate(1);
            days_ago = points.getCountOfDateDifference(new Date(first_day_of_month));
        } else days_ago = parseInt(param);

        let few_days = points.getPastDate(days_ago, true);
        this.setState({ dateStart: few_days.toDateString(), dateEnd: end.toDateString(), disabled: false }, () => this.callback());
    }

    checkDateRange(param) {
        let days_ago = 0,
            days_ago_end = new Date(),
            start = this.state.dateStart,
            end = this.state.dateEnd;
        
        if (param === "today") days_ago = 0;
        else if (param === "yesterday") {
            days_ago = 1;
            days_ago_end = points.getPastDate(days_ago);
        } else if (param === "week") days_ago = points.getThisWeekDay();
        else if (param === "month") {
            let first_day_of_month = new Date();
            first_day_of_month.setDate(1);
            days_ago = points.getCountOfDateDifference(new Date(first_day_of_month));
        } else days_ago = parseInt(param);

        let start_now = points.getPastDate(days_ago, true).toDateString();
        let end_now = days_ago_end.toDateString();
        
        if(start_now == start && end_now == end) return true;
        else return false;
    }

    onRangeChange(date) {
        if(date.eventType == 3) {
            this.setState({
                dateStart: date.start.toDateString(),
                dateEnd: date.end.toDateString(),
                disabled: false
            }, () => this.callback());
        }
    }

    callback() {
        this.props.onRangeChange({ start: this.state.dateStart, end: this.state.dateEnd })
    }

    render() {
        let state = this.state, props = this.props;
        let { children, position, arrow, style, onRangeChange } = props;
        if(!children && !onRangeChange) return null;
        return (
            <Popup trigger={children}
                position={position || 'bottom center'}
                arrow={arrow || false}
                contentStyle={style || { width: 320, padding: 0 }}>
                <div style={{ width: "100%" }}>
                    <div>
                        <div className="column row-separator" style={{ width: "50%", marginTop: 10 }}>
                            <button className={"stretch-width" + (this.checkDateRange("today") ? " btn-success" : "")} onClick={() => this.setDateRange("today")} disabled={state.disabled} style={{ padding: 3 }}>Today</button>
                            <button className={"stretch-width" + (this.checkDateRange("yesterday") ? " btn-success" : "")} onClick={() => this.setDateRange("yesterday")} disabled={state.disabled} style={{ padding: 3 }}>Yesterday</button>
                            <button className={"stretch-width" + (this.checkDateRange("week") ? " btn-success" : "")} onClick={() => this.setDateRange("week")} disabled={state.disabled} style={{ padding: 3 }}>This Week</button>
                            <button className={"stretch-width" + (this.checkDateRange("month") ? " btn-success" : "")} onClick={() => this.setDateRange("month")} disabled={state.disabled} style={{ padding: 3 }}>This Month</button>
                        </div>
                        <div className="column row-separator" style={{ width: "50%", marginTop: 10 }}>
                            <button className={"stretch-width" + (this.checkDateRange("6") ? " btn-success" : "")} onClick={() => this.setDateRange("6")} disabled={state.disabled} style={{ padding: 3 }}>Last 7 days</button>
                            <button className={"stretch-width" + (this.checkDateRange("14") ? " btn-success" : "")} onClick={() => this.setDateRange("14")} disabled={state.disabled} style={{ padding: 3 }}>Last 15 days</button>
                            <button className={"stretch-width" + (this.checkDateRange("29") ? " btn-success" : "")} onClick={() => this.setDateRange("29")} disabled={state.disabled} style={{ padding: 3 }}>Last 30 days</button>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="infinite-calendar">
                        <InfiniteCalendar width={"100%"} height={400}
                            Component={CalendarWithRange}
                            locale={{ headerFormat: 'MMM Do' }}
                            theme={points.infiniteCalendarTheme()}
                            selected={{ start: state.dateStart, end: state.dateEnd }}
                            onSelect={data => this.onRangeChange(data)}
                        />
                    </div>
                </div>
            </Popup>
        );
    }
}

export default DateRange;