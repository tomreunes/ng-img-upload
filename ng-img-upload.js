/**
 * Images will be described by following syntax:
 * var image = {
 *      filename: <String>,
 *      src: <String>,
 *      delete: <Boolean>,
 *      temporary: <Boolean>
 * }
 */

(function (angular, _) {
    var scripts = document.getElementsByTagName("script"),
        src = scripts[scripts.length - 1].src,
        myfilename = 'ng-img-upload.js',
        root = src.substr(0, src.length - myfilename.length);
    var configuration = function(){};
    configuration.prototype.host = "http://localhost:3000/api/images/e";
    configuration = new configuration();

    var app = angular.module('TR.imageUploadDirective', ['angularFileUpload']);

    app.service('$tr', ['$upload','$http',function ($upload,$http) {

        function Image(filename, src, del, temporary) {
            this.filename = filename;
            if (src != undefined) {
                this.src = src;
            }
            else {
                this.src = configuration.host+filename;
            }
            if (del != undefined) {
                this.del = del;
            }
            if (temporary != undefined) {
                this.temporary = temporary;
            }
        }
        Image.prototype.del = false;
        Image.prototype.temporary = true;
        var images = [];
        this.config = config;
        this.setInitialImages = setInitialImages;
        this.confirm = confirm;
        this.getImages = getImages;
        this.uploadFiles = upload;

        function confirm() {
            confirmImages();
            deleteImages();
        }

        function deleteImages(){
            _.each(getImages({del:true}),function(img){
                $http.delete(img.src).success(function(filedata){
                    images = _.without(images,img);
                });

            });
        }

        function confirmImages(){
            _.each(getImages({temporary:true,del:false}),function(img){
                $http.put(img.src).success(function(filedata){
                    var newImg = mapFileDataToImage(filedata);
                    img.src = newImg.src;
                    img.filename = newImg.filename;
                    img.del = false;
                    img.temporary = false;
                });
            });
        }

        function getImages(filter) {
            return _.where(images, filter);
        }

        function setInitialImages(filenames) {
            images = _.map(filenames, function (filename){
                return new Image(filename,undefined,false,false);
            });
        }

        function mapFileDataToImage(filedata){
            return new Image(filedata.filename,filedata.src,false,filedata.isTemporaryFile);
        }

        function upload(files){
            if(!files.length) return;
            var upload = {
                url: configuration.host,
                file: files,
                method: 'POST'
            };
            $upload.upload(upload)
                .progress(function(evt){

                })
                .success(function(data,status,headers,config){
                    var newImages = _.map(data,function(filedata){return mapFileDataToImage(filedata);});
                    images = images.concat(newImages);
                })
        }

        function config(conf){
            if(conf.host){
                configuration.host = conf.host;
            }
        }


    }]);

    app.directive('imgUplInit',function($tr){
        return {
            restrict: 'E',
            scope: {
                host : '='
            },
            controller: ['$tr','$scope',function($tr,$scope){
                //$tr.config({host: $scope.host});
                //$tr.setInitialImages(['Qkxekhyn.jpg','mJe-e0k3.jpg']);
            }]
        }
    });

    app.directive('imgUplDropzone', function () {
        return {
            return: 'E',
            scope: {},
            templateUrl: root + 'templates/dropzone.template.html',
            controller: dirController
        }
    });

    app.directive('imgUplImages',function(){
        return {
            return: 'E',
            scope: {},
            controller: dirController,
            templateUrl: root + 'templates/images.template.html'
        }
    });

    var dirController = ['$scope','$tr',function($scope,$tr){
        $scope.$tr = $tr;
    }];
}(angular, _));