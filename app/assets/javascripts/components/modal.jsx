var Modal = React.createClass({
    getInitialState: function () {
        return {
            visible: false,
            cancel_title: this.props.cancel_title ? this.props.cancel_title : 'Отмена',
            action_title: this.props.action_title ? this.props.action_title : 'ОК',
            title: '',
            type_action: 0 //0 - create; 1 - update
        };
    },
    close:  function () { this.setState({ visible: false }, function () { return this.promise.reject(); }); },
    action: function () { this.setState({ visible: false }, function () { return this.promise.resolve(); }); },
    open: function (title, type_action) {
        this.setState({
            visible: true,
            title: title,
            type_action: type_action
        });
        // promise необходимо обновлять при каждом новом запуске окна
        this.promise = new $.Deferred();
        return this.promise;
    },
    render: function () {
        var modalClass = this.state.visible ? "modal fade in" : "modal fade";
        var modalStyles = this.state.visible ? {display: "block"} : {};
        var backdrop = this.state.visible ? (
            <div className="modal-backdrop fade in" onClick={this.close}> </div>
        ) : null;
        var title = this.state.title ? (
            <div className="modal-header">
                <h4 className="modal-title">{this.state.title}</h4>
            </div>
        ) : null;
        return (
            <div className={modalClass} style={modalStyles}>
                { backdrop }
                <div className="modal-dialog">
                    <div className="modal-content">
                        {title}
                        <div className="modal-body">

                            { this.state.type_action == 0 ? <ModalCreate /> : <ModalUpdate device = { this.props.device } />  }

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                    onClick = { this.close } > { this.state.cancel_title } </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ModalCreate = React.createClass({
    getInitialState() { return { name: "", sleep_time: 1, work_time: 1, ai: false, light_start: 0, light_end: 0 } },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/devices", method: "POST",
            data:{ device: {
                name: this.state.name,
                sleep_time: this.state.sleep_time,
                work_time: this.state.work_time,
                ai: this.state.ai,
                light_start: this.state.light_start,
                light_end: this.state.light_end
            }}
        });
    },
    render() {
        return(
            <div id = "modal-create">
                <form onSubmit = { this.handleSubmit } >
                    <table>
                        <tr>
                            <td> Name: </td>
                            <td>
                                <input name="name" type="text" placeholder="name device"
                                onChange = { (e) => { this.setState({ name: e.target.value }) } } />
                            </td>
                            <td> </td>
                        </tr>

                        <tr>
                            <td> Sleep time: </td>
                            <td>
                                <input name="sleep_time" type="text" placeholder="sleep time"
                                   onChange = { (e) => { this.setState({ sleep_time: e.target.value }) } } value = { this.state.sleep_time } />
                            </td>
                            <td>Minutes</td>
                        </tr>

                        <tr>
                            <td> Work time: </td>
                            <td>
                                <input name="work_time" type="text" placeholder="work time"
                                   onChange = { (e) => { this.setState({ work_time: e.target.value }) } } value = { this.state.work_time } />
                            </td>
                            <td>Seconds</td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td>
                                <input type="checkbox" name="onOff" onClick = { () => { this.setState({ ai: !this.state.ai }) } } value = { this.state.sleep_time } />
                            </td>
                            <td> Использовать зависимость от условий </td>
                        </tr>

                        <tr>
                        <td> Light start: </td>
                        <td><input name="sleep_time" type="text" placeholder="sleep time"
                               onChange = { (e) => { this.setState({ light_start: e.target.value }) } } value = { this.state.light_start } />
                        </td>
                            <td>Hour</td>
                        </tr>

                        <tr>
                            <td> Light end: </td>
                            <td>
                                <input name="work_time" type="text" placeholder="work time"
                                   onChange = { (e) => { this.setState({ light_end: e.target.value }) } } value = { this.state.light_end } />
                            </td>
                            <td> Hour </td>
                        </tr>
                    </table>
                    <br />
                    <button className="btn btn-info " type = "submit" > Сохранить </button>
                </form>
            </div>
        )
    }
});

var ModalUpdate = React.createClass({
    getInitialState() { return { sleep_time: 1, work_time: 1, ai: false, light_start: 0, light_end: 0 } },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/devices/" + this.props.device.key_device, method: "PUT",
            data:{
                key: this.props.device.key_device,
                name: this.state.name,
                per_sleep: this.state.sleep_time * 60,
                per_work: this.state.work_time,
                ai: this.state.ai,
                light_start: this.state.light_start,
                light_end: this.state.light_end
            }
        });
    },
    setTimeSleep(t) {
        if(this.state.sleep_time > 1 || t > 0 ) {
            this.setState({sleep_time: this.state.sleep_time + t});
        }
    },
    setTimeWork(t) {
        if(this.state.work_time > 1 || t > 0 ) {
            this.setState({work_time: this.state.work_time + t});
        }
    },
    setLightStart(h) {
        if (h > 0 && this.state.light_start >= 23) {
            this.setState({light_start: 0});
        } else if (h < 0 && this.state.light_start <= 0) {
            this.setState({light_start: 23});
        } else {
            this.setState({light_start: this.state.light_start + h});
        }
    },
    setLightEnd(h){
        if (h > 0 && this.state.light_end >= 23) {
            this.setState({light_end: 0});
        } else if (h < 0 && this.state.light_end <= 0) {
            this.setState({light_end: 23});
        } else {
            this.setState({light_end: this.state.light_end + h});
        }
    },
    changeLightStart(e) {
        if( e.target.value == parseInt(e.target.value)) {
            if (e.target.value > 23) {
                this.setState({light_start: 23 })
            } else if (e.target.value < 0) {
                this.setState({light_start: 0})
            } else {
                this.setState({light_start: parseInt(e.target.value) });
            }
        }
        else {
            this.setState({light_start: 0})
        }
    },
    changeLightEnd(e) {
       if( e.target.value == parseInt(e.target.value)) {
           if (e.target.value > 23) {
               this.setState({light_end: 23})
           } else if (e.target.value < 0) {
               this.setState({light_end: 0})
           } else {
               this.setState({light_end: parseInt(e.target.value) });
           }
       }
        else {
           this.setState({light_end: 0})
       }
    },
    render() {
        return(
            <div id = "modal-update">
                <form onSubmit = { this.handleSubmit } >
                    <table>
                        <tr>
                            <td> Name: </td>
                            <td>
                                <input name="name" type="text" placeholder="name device"
                                       onChange = { (e) => { this.setState({ name: e.target.value }) } } />
                            </td>
                            <td> </td>
                        </tr>

                        <tr>
                            <td> Sleep time: </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setTimeSleep(-1) } }> &#10096; </button>
                            </td>
                            <td>
                                <input name="sleep_time" type="text" placeholder="sleep time" className = "change_time_sm"
                                       onChange = { (e) => { this.setState({ sleep_time: e.target.value }) } } value = { this.state.sleep_time } />
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setTimeSleep(1) } }> &#10097; </button>
                            </td>
                            <td>Minutes</td>
                        </tr>

                        <tr>
                            <td> Work time: </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setTimeWork(-1) } }> &#10096; </button>
                            </td>
                            <td>
                                <input name="work_time" type="text" placeholder="work time" className = "change_time_sm"
                                       onChange = { (e) => { this.setState({ work_time: e.target.value }) } } value = { this.state.work_time } />
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setTimeWork(1) } }> &#10097; </button>
                            </td>
                            <td>Seconds</td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td>
                                <input type="checkbox" name="onOff" onClick = { () => { this.setState({ ai: !this.state.ai }) } } value = { this.state.sleep_time } />
                            </td>
                            <td> Использовать зависимость от условий </td>
                        </tr>

                        <tr>
                            <td> Light start: </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setLightStart(-1) } }> &#10096; </button>
                            </td>
                            <td><input name="sleep_time" type="text" placeholder="sleep time" className = "change_time_lg"
                                       onChange = { this.changeLightStart } value = { this.state.light_start } />
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setLightStart(1) } }> &#10097; </button>
                            </td>
                            <td>Hour</td>
                        </tr>

                        <tr>
                            <td> Light end: </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setLightEnd(-1) } }> &#10096; </button>
                            </td>
                            <td>
                                <input name="work_time" type="text" placeholder="work time" className = "change_time_lg"
                                       onChange = { this.changeLightEnd } value = { this.state.light_end } />
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick = { (e) => { this.setLightEnd(1) } }> &#10097; </button>
                            </td>
                            <td> Hour </td>
                        </tr>
                    </table>
                    <br />
                    <button className="btn btn-info " type = "submit" > Сохранить </button>
                </form>
            </div>
        )
    }
});

