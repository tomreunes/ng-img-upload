(function(angular){
    var app = angular.module('MyApp', ['TR.imageUploadDirective']);

    app.controller('myController',['$tr',function($tr){
        var vm = this;
        $tr.config({host: 'http://localhost:3000/api/images/'});
        $tr.setInitialImages(['71WWeCk3.jpg','QyhACJn.jpg']);
        vm.hihi = function(){
            $tr.confirm();
        };
        //vm.$tr = $tr;
    }]);
}(angular));