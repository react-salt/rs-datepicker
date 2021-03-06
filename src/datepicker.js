import React, { Component } from 'react';
import Picker from './picker.js';
import Inputer from './inputer.js';
import moment from 'moment';
import { keyCode } from 'rs-util';

// 此接口可能还是会放到外层
function dateFormat(day, format) {
    if (!day) {
        return '';
    } else {
        return moment(day).format(format);
    }
};

class Datepicker extends Component {
    static propTypes = {
        value: React.PropTypes.string,
        noValue: React.PropTypes.bool,
        defaultDay: React.PropTypes.number,

        showNow: React.PropTypes.bool,

        yearOnly: React.PropTypes.bool,
        monthOnly: React.PropTypes.bool,
        dateOnly: React.PropTypes.bool,
        timeOnly: React.PropTypes.bool,

        format: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        readOnly: React.PropTypes.bool
    }

    static defaultProps = {
        value: '',  //这个可以设定默认的时间
        noValue: false, //有这个选项在初始化的时候不显示值
        defaultDay: 0,  //这个可以用来设定默认的时间和现在时间的关系

        showNow: false,

        yearOnly: false,    //出现这个选项，则需要让format是YYYY,点击年份不进入月份
        monthOnly: false,   //出现这个选项，则需要让format是YYYY-MM,点击月份不进入日
        dateOnly: true,     //出现这个选项，则需要让format是YYYY-MM-DD,点击日关闭
        timeOnly: false,    //出现这个选项，不显示日期及以上，需要确定按钮

        format: 'YYYY-MM-DD',   //为了避免内部太复杂，format只影响到显示的时候的效果
        disabled: false,
        readOnly: false
    }

    state = {
        visible: false,
        activeDate: new Date(),
        result: ''
    }

    // 点击切换显影
    _handleClickInput = (vi) => {
        this.setState({
            visible: typeof vi === 'undefined' ? !this.state.visible : vi
        });
    }

    // 点击日历区域
    _handleSelect = (day, visible) => {
        let result = dateFormat(day, this.props.format);
        // 点击逻辑：结果和活跃的都更新
        this.setState({
            activeDate: day,
            visible: visible,
            result: result
        });
        // 向外部发送消息
        this.props.onChange(result);
    }

    _handleKeyDown(event) {
        if (event.keyCode == keyCode.ESC) {
            this._handleClickInput(false);
        }
        if (event.target.nodeName.toLowerCase() === 'input') {
            return undefined;
        }
        //const keyCode = event.keyCode;
        //const ctrlKey = event.ctrlKey || event.metaKey;
    }

    _handleBlur(name, event) {
        if (!event.relatedTarget || event.relatedTarget.nodeName.toLowerCase() === 'input') {
            this._handleClickInput(false);
        }
    }

    // 外部更新
    componentWillReceiveProps(nextProps) {
        let { value } = nextProps;

        if (value !== '') {
            let activeDate =  moment(value),
                result = dateFormat(activeDate, this.props.format);
            this.setState({
                activeDate: activeDate,
                result: result
            });           
        }
    }

    // 更新
    componentDidMount() {
        let { defaultDay, value, format } = this.props,
            day = value !== '' ?
                    value :
                    (() => {
                        let day = new Date();
                        return day.setDate(day.getDate() + defaultDay);
                    })(),
            activeDate = new Date(day),
            result = dateFormat(activeDate, format);

        this.setState({
            activeDate: activeDate,
            result: result
        });

        this.props.onChange(result);
    }

    render() {
        let { noValue, disabled, readOnly } = this.props,
            { visible, result, activeDate } = this.state,
            date_ac = new Date(activeDate),
            date_se = new Date(activeDate);

        if (noValue) {
            result = '';
        }

        return (
            <div className="form-group salt-calendar-container"
                onKeyDown={this::this._handleKeyDown}
                onBlur={this._handleBlur.bind(this, 'container')}
            >
                <Inputer
                    value={result}
                    disabled={disabled}
                    readOnly={readOnly}
                    onSelect={this._handleClickInput}
                />
                <Picker
                    {...this.props}
                    activeDate={date_ac}
                    selectedDate={date_se}
                    onSelect={this._handleSelect}
                    visible={visible}
                />
            </div>
        );
    }
}

export default Datepicker;
