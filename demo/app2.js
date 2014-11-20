(function(angular){
    var app = angular.module('MyApp', ['TR.imageUploadDirective']);

    app.controller('myController',['$tr','$q',function(ImgUploadService,$q){
        var vm = this;
        ImgUploadService.config({host: 'http://localhost:3000'});
        var Image = ImgUploadService.Image;
        //$tr.setInitialImages(['71WWeCk3.jpg','QyhACJn.jpg']);
        /*vm.hihi = function(){
            $tr.confirm();
            console.log($tr.getImages());
        };*/
        //vm.$tr = $tr;
        var image_array = ['myvsC-gx.jpg'];
        var images = _.map(image_array,function(input){return new Image(input,undefined,false,false)});
        vm.images = function(){
            return images;
        };
        vm.save = save;
        vm.addTemporaryFiles = addTemporaryFiles;
        function save() {
            var defer = $q.defer();
            ImgUploadService.confirm(images).then(function (result) {
                images = result;
                defer.resolve(images);
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
                images = images.concat(uploaded);
            });
        }


    }]);
}(angular));