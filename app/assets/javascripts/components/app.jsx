var App = React.createClass({
    render() {
        return (
            <div>
                <Header current_user = { this.props.current_user } changeCurrentUser = { () => { this.props.changeCurrentUser(null) } } />
                <Cards current_user = {this.props.current_user} />
            </div>
        )
    }
});

var Header = React.createClass({
    signOut() {
        $.ajax({ url: "/users/sign_out", method: "DELETE",
            success: function() {
                this.props.changeCurrentUser()
            }.bind(this)
        });
    },
    modal: function () { return this.refs.modal; },
    popup: function () { this.refs.modal.open("Новое стройство", 0); },
    render() {
        return (
            <div className = "header ">
                <div className = "header-info">
                    <a onClick={this.popup} className="btn btn-primary btn-new-device"> + </a> <Modal ref="modal" />
                    <div className="header-email" >{ this.props.current_user.email } </div>
                    <div className="header-exit" onClick = { this.signOut } > LogOut </div>
                </div>
            </div>
        )
    }
});

var Cards = React.createClass({
    getInitialState() {
        return { devices: [] }
    },
    componentDidMount: function() {
        $.ajax({
            url: '/devices', type: 'GET', async: false,
            success: function(data) {
                this.setState({ devices: data.devices });
            }.bind(this)
        });
    },
    render(){
        var cardsNode1 = this.state.devices.map(function(device, i) {
            if(i%2 == 0) return <Card key = { device.id } device = { device } current_user = {this.props.current_user}> </Card>
        }.bind(this));

        var cardsNode2 = this.state.devices.map(function(device, i) {
            if(i%2 != 0) return <Card key = { device.id } device = { device } current_user = {this.props.current_user}> </Card>
        }.bind(this));

        return (
            <div id = "cards" >
                <div className="col-lg-6">
                    { cardsNode1 }
                </div>
                <div className="col-lg-6">
                    { cardsNode2 }
                </div>

            </div>
        )
    }
});

var Card = React.createClass({
    getInitialState() {
        this.webSocket();
        return { plant: Object(), timer: 0 }
    },
    componentDidMount: function() {
        $.ajax({
            url: '/plants', type: 'GET', async: false,
            data: { key: this.props.device.key_device },
            success: function(data) {
                this.setState({ plant: data.plant });
            }.bind(this)
        });

        this.timeInterval();
    },
    webSocket: function() {
        var faye = new Faye.Client('https://socketmiamitalks.herokuapp.com/faye');

        faye.subscribe("/eco-craft/" + this.props.device.key_device + "/update", function(data) {
            this.setState( { plant: data.plant } );
        }.bind(this));
    },
    timeInterval() {
        setInterval(
            function() {
                var now = new Date();
                now.setHours(now.getHours() + 1);
                var timer = parseInt(this.state.plant.next_time) - parseInt(now.getTime().toString().substring(0, 10));
                this.setState({ timer: timer });
            }.bind(this), 500)
    },
    render() {
        return(
            <div className = "card">
                <div className="device-name"> { this.props.device.name } </div>
                <div className="device-key"> Key: { this.props.device.key_device } </div>
                <div className="device-info">
                    <table>
                        <tr><td>Temperature:</td><td> { this.state.plant.temperature }°C</td></tr>
                        <tr><td>Humidity:</td><td> { this.state.plant.humidity }%</td></tr>
                        <tr><td>Status device:</td><td> { this.state.plant.state_device }</td><td> </td></tr>
                        <tr><td>Status type:</td><td> { this.state.plant.state_type }</td><td> </td></tr>
                        <tr><td>Next time:</td><td> </td><td> { parseInt(this.state.timer/60%60) < 10 ? "0" + parseInt(this.state.timer/60%60) : parseInt(this.state.timer/60%60) } : 
                            { this.state.timer%60 < 10 ? "0" + this.state.timer%60 : this.state.timer%60 } </td></tr>
                        <tr><td>Next type:</td><td> { this.state.plant.next_time_type }</td><td> </td></tr>
                    </table>
                </div>
            </div>
        )
    }
});