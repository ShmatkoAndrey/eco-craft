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
    render() {
        return(
            <div className = "card">
                <div className="device-name"> { this.props.device.name } </div>
            </div>
        )
    }
});