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
