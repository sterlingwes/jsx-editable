/** @jsx React.DOM */

var React = require('react/addons')
  , cx = React.addons.classSet

  , check = "Add your text";

module.exports = React.createClass({
    
    getDefaultProps: function() {
        return {
            block:  {}
        };
    },
    
    componentDidMount: function() {
        this.refs.ta.getDOMNode().focus();
    },
    
    render: function() {
        
        var content = this.props.block.content || '';
        
        if(content.indexOf('<span class="mltplaceholder">')===0) {
            content = "\n";
        }
        
        return (
            <div>
                <textarea ref="ta" className="noCancel" defaultValue={content} onChange={this.props.onChange} />
            </div>
        );
    }
    
});