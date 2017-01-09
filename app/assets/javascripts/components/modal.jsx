var Modal = React.createClass({
    getInitialState: function () {
        var pt;
        $.ajax({
            url: "/plant_types/", method: "GET", async: false,
            success: function(data) {
                pt = data.plant_types;
            }
        });

        return {
            visible: false,
            cancel_title: this.props.cancel_title ? this.props.cancel_title : 'Отмена',
            action_title: this.props.action_title ? this.props.action_title : 'ОК',
            title: '',
            type_action: 0, //0 - create; 1 - update
            plant_types: pt
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

                            { this.state.type_action == 0 ? <ModalCreate plant_types =  { this.state.plant_types } /> : <ModalUpdate plant_types =  { this.state.plant_types } device = { this.props.device } plant = { this.props.plant } />  }

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
    getInitialState() { return { name: "", sleep_time: 0, work_time: 0, ai: false, light_start: 0, light_end: 0, plant_type_id: 1 } },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/devices", method: "POST",
            data:{ device: {
                plant_type_id: this.state.plant_type_id,
                name: this.state.name,
                per_sleep: this.state.sleep_time * 60,
                per_work: this.state.work_time,
                hum_ai: this.state.ai,
                light_start: this.state.light_start,
                light_end: this.state.light_end
            }}
        });
    },
    setTimeSleep(t) {
        if (this.state.sleep_time > 1 || t > 0) {
            this.setState({sleep_time: this.state.sleep_time + t});
        }
    },
    setTimeWork(t) {
        if (this.state.work_time > 1 || t > 0) {
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
        if (e.target.value == parseInt(e.target.value)) {
            if (e.target.value > 23) {
                this.setState({light_start: 23})
            } else if (e.target.value < 0) {
                this.setState({light_start: 0})
            } else {
                this.setState({light_start: parseInt(e.target.value)});
            }
        }
        else {
            this.setState({light_start: 0})
        }
    },
    changeLightEnd(e) {
        if (e.target.value == parseInt(e.target.value)) {
            if (e.target.value > 23) {
                this.setState({light_end: 23})
            } else if (e.target.value < 0) {
                this.setState({light_end: 0})
            } else {
                this.setState({light_end: parseInt(e.target.value)});
            }
        }
        else {
            this.setState({light_end: 0})
        }
    },
    changePlantType(pt) {
        this.setState({ sleep_time: pt.per_sleep/60, work_time: pt.per_work,
            light_start: pt.light_start, light_end: pt.light_end,  plant_type_id: pt.id });
    },
    render() {
        var plantTypes = this.props.plant_types.map(function(pt, i) {
            return <li onClick = { () => { this.changePlantType(pt) }  }> { pt.name } </li>
        }.bind(this));

        return (
            <div id="modal-update">
                <form onSubmit={ this.handleSubmit }>

                    <div className="settings-name">Plant type:</div>
                    <div className="settings-block">
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                { this.props.plant_types[this.state.plant_type_id - 1].name }
                                <span className="caret"> </span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                { plantTypes }
                            </ul>
                        </div>
                    </div>

                    <div className="settings-name">Name:</div>
                    <div className="settings-block">
                        <input name="name" type="text" placeholder="name device"
                               onChange={ (e) => { this.setState({ name: e.target.value }) } }
                               value={ this.state.name }/>
                    </div>
                    <br />

                    <div className="settings-name">Sleep time:</div>

                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeSleep(-1) } }> &#10096; </div>

                        <input name="sleep_time" type="text" placeholder="sleep time" className="change_time_sm"
                               onChange={ (e) => { this.setState({ sleep_time: e.target.value }) } }
                               value={ this.state.sleep_time }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeSleep(1) } }> &#10097; </div>

                        <div className="settings-type">Minutes</div>
                    </div>
                    <br />

                    <div className="settings-name">Work time:</div>
                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeWork(-1) } }> &#10096; </div>

                        <input name="work_time" type="text" placeholder="work time" className="change_time_sm"
                               onChange={ (e) => { this.setState({ work_time: e.target.value }) } }
                               value={ this.state.work_time }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeWork(1) } }> &#10097; </div>

                        <div className="settings-type">Seconds</div>
                    </div>
                    <br />
                    <div className="settings-name">Light start:</div>
                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightStart(-1) } }> &#10096; </div>

                        <input name="sleep_time" type="text" placeholder="sleep time" className="change_time_sm"
                               onChange={ this.changeLightStart } value={ this.state.light_start }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightStart(1) } }> &#10097; </div>

                        <div className="settings-type">Hour</div>
                    </div>
                    <br />
                    <div className="settings-name">Light end:</div>
                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightEnd(-1) } }> &#10096; </div>

                        <input name="work_time" type="text" placeholder="work time" className="change_time_sm"
                               onChange={ this.changeLightEnd } value={ this.state.light_end }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightEnd(1) } }> &#10097; </div>

                        <div className="settings-type">Hour</div>
                    </div>
                    <br />
                    <div className="settings-block">
                        <input type="checkbox" name="onOff" onClick={ () => { this.setState({ ai: !this.state.ai }) } }
                               value={ this.state.sleep_time }/>
                        Использовать зависимость от условий
                    </div>
                    <br />
                    <button className="btn btn-info " type="submit"> Сохранить</button>
                </form>
            </div>
        )
    }
});

var ModalUpdate = React.createClass({
    getInitialState() {
        return { name: this.props.device.name, sleep_time: this.props.plant.per_sleep/60, work_time: this.props.plant.per_work,
            ai: false, light_start: this.props.plant.light_start, light_end: this.props.plant.light_end, plant_type_id: this.props.plant.plant_type_id}
    },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/devices/" + this.props.device.key_device, method: "PUT",
            data: {
                device: {
                    plant_type_id: this.state.plant_type_id,
                    key: this.props.device.key_device,
                    name: this.state.name,
                    per_sleep: this.state.sleep_time * 60,
                    per_work: this.state.work_time,
                    hum_ai: this.state.ai,
                    light_start: this.state.light_start,
                    light_end: this.state.light_end
                }
            }
        });
    },
    setTimeSleep(t) {
        if (this.state.sleep_time > 1 || t > 0) {
            this.setState({sleep_time: this.state.sleep_time + t});
        }
    },
    setTimeWork(t) {
        if (this.state.work_time > 1 || t > 0) {
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
        if (e.target.value == parseInt(e.target.value)) {
            if (e.target.value > 23) {
                this.setState({light_start: 23})
            } else if (e.target.value < 0) {
                this.setState({light_start: 0})
            } else {
                this.setState({light_start: parseInt(e.target.value)});
            }
        }
        else {
            this.setState({light_start: 0})
        }
    },
    changeLightEnd(e) {
        if (e.target.value == parseInt(e.target.value)) {
            if (e.target.value > 23) {
                this.setState({light_end: 23})
            } else if (e.target.value < 0) {
                this.setState({light_end: 0})
            } else {
                this.setState({light_end: parseInt(e.target.value)});
            }
        }
        else {
            this.setState({light_end: 0})
        }
    },
    changePlantType(pt) {
        this.setState({ sleep_time: pt.per_sleep/60, work_time: pt.per_work,
            light_start: pt.light_start, light_end: pt.light_end,  plant_type_id: pt.id });

    },
    render() {
        var plantTypes = this.props.plant_types.map(function(pt, i) {
            return <li onClick = { () => { this.changePlantType(pt) }  }> { pt.name } </li>
        }.bind(this));

        return (
            <div id="modal-update">
                <form onSubmit={ this.handleSubmit }>

                    <div className="settings-name">Plant type:</div>
                    <div className="settings-block">
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                { this.props.plant_types[this.state.plant_type_id - 1].name }
                                <span className="caret"> </span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                { plantTypes }
                            </ul>
                        </div>
                    </div>

                    <div className="settings-name">Name:</div>
                    <div className="settings-block">
                        <input name="name" type="text" placeholder="name device"
                               onChange={ (e) => { this.setState({ name: e.target.value }) } }
                               value={ this.state.name }/>
                    </div>
                    <br />

                    <div className="settings-name">Sleep time:</div>

                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeSleep(-1) } }> &#10096; </div>

                        <input name="sleep_time" type="text" placeholder="sleep time" className="change_time_sm"
                               onChange={ (e) => { this.setState({ sleep_time: e.target.value }) } }
                               value={ this.state.sleep_time }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeSleep(1) } }> &#10097; </div>

                        <div className="settings-type">Minutes</div>
                    </div>
                    <br />

                    <div className="settings-name">Work time:</div>
                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeWork(-1) } }> &#10096; </div>

                        <input name="work_time" type="text" placeholder="work time" className="change_time_sm"
                               onChange={ (e) => { this.setState({ work_time: e.target.value }) } }
                               value={ this.state.work_time }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setTimeWork(1) } }> &#10097; </div>

                        <div className="settings-type">Seconds</div>
                    </div>
                    <br />
                    <div className="settings-name">Light start:</div>
                    <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightStart(-1) } }> &#10096; </div>

                        <input name="sleep_time" type="text" placeholder="sleep time" className="change_time_sm"
                               onChange={ this.changeLightStart } value={ this.state.light_start }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightStart(1) } }> &#10097; </div>

                        <div className="settings-type">Hour</div>
                    </div>
                    <br />
                        <div className="settings-name">Light end:</div>
                        <div className="settings-block">
                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightEnd(-1) } }> &#10096; </div>

                        <input name="work_time" type="text" placeholder="work time" className="change_time_sm"
                               onChange={ this.changeLightEnd } value={ this.state.light_end }/>

                        <div className="btn btn-danger"
                                onClick={ (e) => { this.setLightEnd(1) } }> &#10097; </div>

                        <div className="settings-type">Hour</div>
                    </div>
                    <br />
                    <div className="settings-block">
                        <input type="checkbox" name="onOff" onClick={ () => { this.setState({ ai: !this.state.ai }) } }
                               value={ this.state.sleep_time }/>
                        Использовать зависимость от условий
                    </div>
                    <br />
                    <button className="btn btn-info " type="submit"> Сохранить</button>
                </form>
            </div>
        )
    }
});

