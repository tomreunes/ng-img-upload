(function(angular){
    var app = angular.module('MyApp', ['TR.imageUploadDirective']);

    app.controller('myController',['$tr','$q',function(ImgUploadService,$q){
        var vm = this;
        ImgUploadService.config({host: 'http://localhost:3000'});
        //$tr.setInitialImages(['71WWeCk3.jpg','QyhACJn.jpg']);
        /*vm.hihi = function(){
            $tr.confirm();
            console.log($tr.getImages());
        };*/
        //vm.$tr = $tr;
        vm.images = [];
        vm.save = save;
        vm.addTemporaryFiles = addTemporaryFiles;
        function save() {
            var defer = $q.defer();
            ImgUploadService.confirm(vm.images).then(function (result) {
                vm.images = result;
                defer.resolve(vm.images);
            });
            return defer.promise;
        }

        this.tmpSave = tmpSave;
        function tmpSave(){
            vm.save().then(function(res){
                console.log(res);
            })
        }

        function addTemporaryFiles(files) {

            if (!files.length) return;
            ImgUploadService.uploadFiles(files).success(function (data) {
                var uploaded = _.map(data, function (resource) {
                    return ImgUploadService.mapFileDataToImage(resource);
                });
                vm.images = vm.images.concat(uploaded);
            });
        }


    }]);
}(angular));