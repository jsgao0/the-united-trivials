

var myApp = angular.module('taskApp', ['ngAnimate']);

myApp.controller('ModelController', ['$scope', function($scope) {
    var db = new PouchDB('taskDB');
    var data = [];

    var initTasks = function (docs) {
        var l = docs.length;
        for (var i = 0;i < l;i++) {
            console.log(docs[i]);
            data.push(docs[i]);
            $scope.tasks.push(Task.createNew(docs[i].doc));
        };
    };

    var putDoc = function(doc) {
        db.put(doc).then(function (response) {
            response.doc = doc;
            response.doc._rev = response.rev;
            data.push(response);
            console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
    }

    var updateDoc = function(myDoc) {

        db.get(myDoc.id).then(function(doc) {
          return db.put(myDoc.doc);
        }).then(function(response) {
            myDoc.doc._rev = response.rev;
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });

    };

    var getDocs = function () {
        db.allDocs({include_docs: true}).then(function (doc) {
            $scope.$apply(function(){
                var docs = doc['rows'];
                initTasks(docs);
            });
            
        }).catch(function (err) {
            console.log(err);
        });
    };

    var deleteDoc = function (doc) {
        db.get(doc).then(function(doc) {
            return db.remove(doc);
        }).then(function (result) {
          console.log(result);
        }).catch(function (err) {
            console.log(err);
        });
    }

    var formatDoc = function(task) {
        var doc = Task.createNew(task);
        doc._id = 'task'+task.date;
        for (prop in doc) {
            if (typeof(doc[prop]) === 'function') {
                delete(doc[prop]);
            }
        }
        return doc;
    };


    $scope.deleteflag = false;
    $scope.input="";
    $scope.tasks = [];
    $scope.newTasks = [];
    $scope.inputTask = function () {
        if ($scope.input==="") {
            delete($scope.temp);
            $scope.newTasks = [];
        }
        else if ($scope.temp===undefined) {
            $scope.temp = Task.createNew({name:$scope.input});
            $scope.newTasks = [$scope.temp];
        }
        else {
            $scope.temp.setName($scope.input);
        }
    }
    $scope.submit = function(event) {
        var keyCode = event.which || event.keyCode;
        if (keyCode===13 && $scope.temp!==undefined) {
            $scope.tasks.push($scope.temp);
            var newDoc = formatDoc($scope.temp);
            putDoc(newDoc);
            delete($scope.temp);
            $scope.newTasks = [];
            $scope.input='';
        }
    };
    $scope.change_state = function(task, element) {
        if ($scope.deleteflag) {
            //confirm("Do you really want to delete '"+task.name+"'?");
            for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i].date===task.date) {
                    $scope.tasks.splice($scope.tasks.indexOf($scope.tasks[i]), 1);
                }
            }
            deleteDoc('task'+task.date);
        }
        else {
            task.state = (task.state % 2)+1;
            task.color = Task.color_ref[task.state];
            for (key in data) {
                if (data[key].doc.date===task.date) {
                    data[key].doc.state=task.state;
                    updateDoc(data[key]);
                }
            }
        }
        
    };
    $scope.deleteMode = function(event) {
        var keycode = event.which || event.keyCode;
        if (keycode===18) {
            $scope.deleteflag = true;
        }
    };
    $scope.normalMode = function(event) {
        var keycode = event.which || event.keyCode;
        if (keycode===18) {
            $scope.deleteflag = false;
        }
    };

    getDocs();
}]);

