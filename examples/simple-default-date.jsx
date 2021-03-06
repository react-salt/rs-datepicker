import React, { Component } from 'react';
import Datepicker from '../src/datepicker.js';

export default class Example extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateFirst = this.updateFirst.bind(this);
    }

    state = {
        date: ''
    }

    handleChange(newValue) {
        console.log(newValue);
    }

    updateFirst() {
        console.log('数值更新');
        this.setState({
            date: '2015-11-02'
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.updateFirst}>
                    点击更新第一个的数值
                </button>
                <p>可以设置defaultDay来控制默认日期和当前时间的关系</p>
                <p>如果设置了value，defaultDay就不会生效</p>
                <Datepicker 
                    defaultDay={1}
                    format="YYYY-MM-DD"
                    onChange={this.handleChange}
                />
                <Datepicker 
                    value={this.state.date}
                    showNow
                    dateOnly={false}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
};
