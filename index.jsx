/** @jsx React.DOM */

var React = require('react/addons')
, _ = require('underscore')
, cx = React.addons.classSet
, editors = {
    md:   require('./editors/text.jsx')
};

function hasClass(test, className) {
  if(!_.isArray(className))
    className = [className];
    
  var has = false;
    
  for(i=0; i<className.length; i++) {
    if(test.indexOf(className[i])!==-1)
      has = true;
  }
  
  return has;
}

require('style!css!./style.css');

module.exports = React.createClass({
    
    getInitialState: function() {
        return {
            editing:    false,
            newContent: ''
        };
    },
    
    handleChange: function(ev) {
        this.setState({ newContent: ev.target.value || '<span class="mltplaceholder">Add your text to this block by clicking EDIT.</span>' });
    },
    
    cancelListeners: {},
    
    beginEdit: function(event) {
      
        if(hasClass(event.target.className, ['up','down','blockOrderArrows','blockDeleteX']))
          return;
      
        if(!this.props.editable || this.state.editing)
            return;
            
        this.setState({
            editing:    true,
            newContent: this.props.options.block.content
        });
        
        $(document).on('click', this.handleEdit);
    },

    handleEdit: function(event) {
    
        var field = this.props.options.fieldName.replace('.','');
        if(this.state.editing 
            && event.target.className.indexOf('noCancel')===-1 
            && !$(event.target).closest('#block_'+field).length) {
                
            var props = this.props.options;
        
            if(typeof props.save !== 'function')
                return console.warn('No save method provided for editable.');

            props.save({
                id:         props.id,
                field:      props.fieldName || 'body.0',
                content:    this.state.newContent
            });
            
            this.setState({ editing: false });
            $(document).off('click', this.handleEdit);
        }

    },
    
    cancelState: function() {
        this.setState({
            editing: false
        });
    },
    
    render: function() {
        
        var cls = {
              block:    true,
              editableBlock:  this.props.editable
          }
          , props = this.props.options;
          
          cls['block-'+props.block.type] = true;
        
        var editableClasses = cx(cls)
          , content = this.props.children
          , editor
          , orderArrows
          , deleteX
          , fieldCls = 'block_' + this.props.options.fieldName.replace('.','');
        
        if(this.state.editing === true)
            editor = editors[props.block.type](_.extend({}, this.props.options, {onChange:this.handleChange}));
            
        if(this.props.ordering && !this.state.editing)
          orderArrows = <div className="blockOrderArrows"><div className="up" onClick={this.props.ordering.up}></div><div className="down"onClick={this.props.ordering.down}></div></div>;
          
        if(this.props.deleting && !this.state.editing)
          deleteX = <div className="blockDeleteX" onClick={this.props.deleting}>&times;</div>
        
        return this.transferPropsTo(
            <div className={ editableClasses } id={fieldCls} onClick={this.beginEdit}>
                <div className="contentPane">
                    { content }
                </div>
                { editor }
                { orderArrows }
                { deleteX }
            </div>
        );
    }
    
});