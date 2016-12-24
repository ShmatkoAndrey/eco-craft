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
                    <div className="col-lg-1"> </div>
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
        return { plant: Object(), plant_val: Object(), timer_def: 0 }
    },
    componentDidMount: function() {
        $.ajax({
            url: '/plants', type: 'GET', async: false,
            data: { key: this.props.device.key_device },
            success: function(data) {
                this.setState({ plant: data.plant });
            }.bind(this)
        });

        $.ajax({
            url: "/time_now/", method: "GET", async: false,
            success: function(data) {
                var now = new Date();
                this.setState({ timer_def: parseInt(now.getTime().toString().substring(0, 10)) - data.time_now });
            }.bind(this)
        });

        this.timeInterval();
    },
    modal: function () { return this.refs.modal; },
    popup: function () { this.refs.modal.open("Настройки", 1); },
    webSocket: function() {
        var faye = new Faye.Client('https://socketmiamitalks.herokuapp.com/faye');

        faye.subscribe("/eco-craft/" + this.props.device.key_device + "/update", function(data) {
            console.log(data.plant_val);
            this.setState( { plant: data.plant, plant_val: data.plant_val } );
        }.bind(this));
    },
    timeInterval() {
        var tmr = this.refs.timer,
            ctx = tmr.getContext('2d');
        ctx.fillStyle = "red";
        var rad = 80;

        setInterval(
            function() {
                if (this.state.plant_val.next_time) {
                    var now = new Date();
                    var now_ = parseInt(now.getTime().toString().substring(0, 10)) + this.state.timer_def;
                    var timer = parseInt(this.state.plant_val.next_time) - parseInt(now_);
                    timer = timer > 0 ? timer : 0;
                    var p = this.state.plant_val.state_type == "work" ? 2 * timer / this.state.plant.per_work : 2 * timer / this.state.plant.per_sleep;
                    ctx.clearRect(0, 0, 200, 200);
                    ctx.beginPath();
                    ctx.arc(100, 100, rad, 0, p * Math.PI, false);
                    ctx.lineWidth = 15;
                    ctx.strokeStyle = this.state.plant_val.state_type == "work" ? 'red' : 'green';
                    ctx.stroke();
                    ctx.fillStyle = "#000";
                    ctx.font = "italic 20pt Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    var str = parseInt(timer / 60 % 60) < 10 ? "0" + parseInt(timer / 60 % 60) : parseInt(timer / 60 % 60);
                    str += ":";
                    str += timer % 60 < 10 ? "0" + timer % 60 : timer % 60;
                    ctx.font = "20pt icomoon";
                    var str_status = this.state.plant_val.state_type == "work" ? String.fromCharCode("0xe906") : String.fromCharCode("0xe901");
                    ctx.fillText(str_status, 100, 60);
                    ctx.fillText(str, 100, 100);
                }
                else {
                    ctx.font = "italic 16pt Arial";
                    ctx.fillText("Connect", 75, 100);
                }
            }.bind(this), 300)
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
                            <tr><td> <span className = "icon-leaf">  </span></td><td>Status device:</td><td> { this.props.device.state_device }</td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Time work:</td><td> { this.state.plant.per_work } Sec</td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Time sleep:</td><td> { this.state.plant.per_sleep/60 } Min</td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Light:</td><td> { this.state.plant.light_start }:00 - { this.state.plant.light_end }:00 </td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>PH:</td><td> { this.state.plant_val.ph } </td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Water lvl:</td><td> high </td><td> </td></tr>
                            <tr><td> <span className = "icon-temp"> </span> </td><td>Temperature:</td><td> { this.state.plant_val.temperature }°C</td><td> </td></tr>
                            <tr><td> <span className = "icon-humidity"> </span> </td><td>Humidity:</td><td> { this.state.plant_val.humidity }%</td><td> </td></tr>
                            <tr><td> <span className = "icon-humidity"> </span> </td><td>Humidity:</td><td> { this.state.plant_val.humidity }%</td><td> </td></tr>
                        </table>
                    </div>
                    <a onClick= { this.popup } className="btn btn-primary btn-settings-device"><span className = "icon-setings"> </span></a>
                    <Modal ref="modal" action_title = "Сохранить" device = { this.props.device } plant = { this.state.plant }  />
                </div>
            </div>
        )
    }
});
