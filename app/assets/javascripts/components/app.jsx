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
                <div className="header-logo" ><span className = "icon-logo"> </span> EcoCraft </div>
                <div className = "header-info">
                    <a onClick={this.popup} className="btn btn-primary btn-new-device"> + </a> <Modal ref="modal" />
                    <div className="header-email" ><span className = "icon-user"> </span>{ this.props.current_user.email } </div>
                    <div className="header-exit" onClick = { this.signOut } > <span className = "icon-exit"> </span></div>
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
            <div>
                <div id = "cards-info">
                    Devices
                    <div id = "cards-info-cnt">
                        { this.state.devices.length }
                        active device
                    </div>
                </div>
                <div id = "cards" >
                    <div className="col-lg-5">
                        { cardsNode1 }
                    </div>
                    <div className="col-lg-1"> </div>/
                    <div className="col-lg-5">
                        { cardsNode2 }
                    </div>

                </div>
            </div>
        )
    }
});

var Card = React.createClass({
    getInitialState() {
        this.webSocket();
        return { plant: Object() }
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
            console.log(data.plant);
            this.setState( { plant: data.plant } );
        }.bind(this));
    },
    timeInterval() {
        var color = "red";
        var tmr = this.refs.timer,
            ctx = tmr.getContext('2d');
        ctx.fillStyle = color;
        var rad = 80;

        setInterval(
            function() {
                var now = new Date();
               // now.setHours(now.getHours() + 1);
                var timer = parseInt(this.state.plant.next_time) - parseInt(now.getTime().toString().substring(0, 10));
                this.setState({ timer: timer });

                var p = 2 * timer/this.state.plant.period;
                ctx.clearRect(0,0,200,200);
                ctx.beginPath();
                ctx.arc(100, 100, rad, 0, p * Math.PI, false);
                ctx.lineWidth = 15;
                ctx.strokeStyle = 'green';
                ctx.stroke();
                ctx.fillStyle = "#000";
                ctx.font = "italic 20pt Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                var str = parseInt(timer/60%60) < 10 ? "0" + parseInt(timer/60%60) : parseInt(timer/60%60);
                str += ":" ;
                str += timer%60 < 10 ? "0" + timer%60 : timer%60;
                ctx.fillText(str, 100, 100);
                ctx.font = "20pt icomoon";
                var str_status = this.state.plant.state_type == "Work" ?  String.fromCharCode("0xe906") : String.fromCharCode("0xe901") ;
                ctx.fillText(str_status, 100, 60);

            }.bind(this), 500)
    },
    render() {
        return(
            <div className = "card">
                <div className="device-name">
                    <span className = "icon-device"> </span>
                    { this.props.device.name }
                    <div className="device-key"> <span className = "icon-key"> </span> { this.props.device.key_device } </div>
                </div>
                <div className="device-info">
                    <div className = " timer" >
                        <canvas height='200' width='200' ref = "timer">  </canvas>
                    </div>
                    <div className = "table-info">
                        <table className = "devise-table">
                            <tr><td>  </td><td>Status device:</td><td> { this.state.plant.state_device }</td><td> <span className = "icon-leaf"> </span> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Temperature:</td><td> { this.state.plant.temperature }°C</td><td> </td></tr>
                            <tr><td> <span className = "icon-humidity"> </span> </td><td>Humidity:</td><td> { this.state.plant.humidity }%</td><td> </td></tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
});