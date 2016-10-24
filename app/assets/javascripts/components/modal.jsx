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



                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                    onClick={this.close}>{this.state.cancel_title}</button>
                            <button type="button" className="btn btn-primary"
                                    onClick={this.action}>{this.state.action_title}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});