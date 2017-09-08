var app = angular.module('app',[]);


app.factory('getUsers',[ "$http", function($http){
        var usersList = {};

        usersList.getData = function (data){
            var promise = $http({method: "GET", url:"https://api.github.com/users"});

            promise.then(success, error);

            function success(response){
                var validData = response.data;

                    if(data.length){
                        data.forEach(function(el){
                            validData = validData.filter(function(elem){
                                return el.id !== elem.id
                            })
                        });
                        validData.forEach(function(el){
                           data.push({'id': el.id, 'value': el.login, 'checked': false});
                        });
                    }else{
                            response.data.forEach(function(el){
                            data.push({'id': el.id, 'value': el.login, 'checked': false});
                        })
                    }
             }
            function error(errorResp){
                console.log(errorResp)
            }
        };
    return usersList

}]);


app.filter('filterHide', function(){
    return function(data, activeFilter){
        return data.filter(activeFilter.filterOne)
    }
});


app.controller('MyController',['$scope', 'filterHideFilter', 'getUsers', MyController]);

function MyController($scope, filterHideFilter, getUsers){
    $scope.data = angular.fromJson(localStorage.getItem('myData')) || [];

    $scope.filt = [
        {text: "All", selected: true, filterOne:function(){return true}},
        {text: "Active", selected: false, filterOne:function(el){return !el.checked}},
        {text: "Completed", selected: false, filterOne:function(el){return el.checked}}
    ];
    $scope.invis= true;
    $scope.activeFilter = $scope.filt[0];
    getUsers.getData($scope.data);

    function setStorage(){
        localStorage.setItem('myData', angular.toJson($scope.data));
    }

    window.onbeforeunload = setStorage;

    function setChecked(bool){
        $scope.data.forEach(function(el){el.checked = bool})
    }

    $scope.checkKey = function (event) {
        if(event.keyCode === 13 && $scope.text !== ""){
            $scope.data.push({value: $scope.text, checked: false});
            $scope.text= "";
        }
    };

    $scope.toggleAll = function(){
        var checkTrue= $scope.data.filter(function(el){return el.checked});
        setChecked(checkTrue.length !== $scope.data.length);
        $scope.showClearComplete()
    };

    $scope.destroy = function(item){
        var arrIndex = $scope.data.indexOf(item);
        $scope.data.splice(arrIndex, 1);

    };

    $scope.showClearComplete = function(){
        var check = $scope.data.find(function(el){return el.checked})
        if(!check){
            $scope.invis = true
        }else{
            $scope.invis = false
        }
    };

    $scope.counter = function counter() {
        return $scope.data.filter(function (t) { return !t.checked }).length;
    };

    $scope.filters = function(a){
        if(!a.selected){
            $scope.filt.forEach(function(el){
                el.selected = false;
            });
            a.selected = true;
        }
        $scope.activeFilter = a;
    };

    $scope.clear = function(){
        var c = $scope.data.filter(function(el){return el.checked});
            c.forEach($scope.destroy);
    }
}
