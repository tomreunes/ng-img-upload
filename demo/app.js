(function(angular){
    var app = angular.module('MyApp', ['TR.imageUploadDirective']);

    app.controller('myController',['$tr',function($tr){
        var vm = this;
        $tr.config({host: 'http://localhost:3000'});
        //$tr.setInitialImages(['71WWeCk3.jpg','QyhACJn.jpg']);
        /*vm.hihi = function(){
            $tr.confirm();
            console.log($tr.getImages());
        };*/
        //vm.$tr = $tr;
        console.log(app);
    }]);
}(angular));