var LoginForm = React.createClass({
    getInitialState() { return { login: true } },
    setCurrentUser_loginForm: function(current_user) { this.props.changeCurrentUser(current_user) },
    render() {
        return (
            <div className="login-container">
                <div className="logo"></div>
                <label className="custom-check">
                    <input type="checkbox" name="onOff" onClick = { () => { this.setState({ login: !this.state.login }) } } />
                    <i> </i>
                    <span> </span>
                </label>
                <div className="form-box">
                    {  this.state.login ?   <Login change_current_user = {this.setCurrentUser_loginForm} /> :
                                            <Registration change_current_user = {this.setCurrentUser_loginForm} /> }
                </div>
            </div>
        )
    }
});

var Login = React.createClass({
    getInitialState() { return { email: '', password: '' } },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/users/sign_in", method: "POST",
            data: {user: {
                email: this.state.email,
                password: this.state.password
            }},
            success: function(data) {
                if(data.errors) { console.log(data.errors); }
                else { this.props.change_current_user(data.current_user); }
            }.bind(this)
        });
    },
    render() {
        return (
            <form onSubmit = { this.handleSubmit } >
                <input name="user" type="text" placeholder="email"
                       onChange = { (e) => { this.setState({ email: e.target.value }) } } />
                <input type="password" placeholder="password"
                       onChange = { (e) => { this.setState({ password: e.target.value }) } } />
                <button className="btn btn-info btn-block login" > Login </button>
            </form>
        )
    }
});

var Registration = React.createClass({
    getInitialState() { return { email: '', password: '', password_confirmation: '' } },
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "/users", method: "POST",
            data:{ user: {
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation
            }},
            success: function(data) {
                if(data.errors){
                    console.log(data.errors)
                }else {
                    this.props.change_current_user(data.current_user);
                }
            }.bind(this)
        });
    },
    render() {
        return (
            <form onSubmit = { this.handleSubmit } >
                <input name="user" type="text" placeholder="email"
                       onChange = { (e) => { this.setState({ email: e.target.value }) } } />
                <input type="password" placeholder="password (6 min)"
                       onChange = { (e) => { this.setState({ password: e.target.value }) } } />
                <input type="password" placeholder="password confirmation"
                       onChange = { (e) => { this.setState({ password_confirmation: e.target.value }) } } />
                <button className="btn btn-info btn-block login" type = "submit" > Registration </button>
            </form>
        )
    }
});

