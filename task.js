/**
 * Class Task
**/
var Task = {
    color_ref : {1:'#17cca3', 2:'#FFA500'},
    createNew : function(obj) {
        var task = {};
        //state
        task.state = obj.state===undefined ? 1 : obj.state;
        task.color = this.color_ref[task.state];
        //name
        task.name = obj.name===undefined ? '' : obj.name;
        //date
        task.formatDate = function(date){return ((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + ' ' + date.getHours() + ':' + ('0'+date.getMinutes()).slice(-2));};
        task.date = obj.date===undefined ? Date.now() : obj.date;
        //getters and setters
        task.getDate = function(){return task.formatDate(new Date(task.date));};
        task.setName = function(name){task.name=name;};
        task.setState = function(state){task.state=state;};
        task.getState = function(){return task.state;};
        return task;
    }
}