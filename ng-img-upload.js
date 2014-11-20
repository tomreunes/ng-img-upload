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
    var configuration = function () {
    };
    configuration.prototype.host = "http://localhost:3000";
    configuration.prototype.path = {};
    configuration.prototype.path.post = '/api/images/';
    configuration.prototype.path.get = '/api/images/';
    configuration.prototype.path.put = '/api/images/';
    configuration.prototype.path.delete = '/api/images/';
    configuration = new configuration();
    function Image(filename, src, del, temporary) {
        this.filename = filename;
        if (src != undefined) {
            this.src = src;
        }
        else {
            this.src = configuration.host + filename;
        }
        if (del != undefined) {
            this.del = del;
        }
        if (temporary != undefined) {
            this.temporary = temporary;
        }
        Image.prototype.del = false;
        Image.prototype.temporary = true;
    }

    var app = angular.module('TR.imageUploadDirective', ['angularFileUpload']);
    console.log(app);
    var ImgUploadController = ['$tr', function (ImgUploadService) {
        console.log('new controller created');
        var vm = this;
        vm.images = [];
        vm.save = save;
        vm.addTemporaryFiles = addTemporaryFiles;
        vm.getImages = function(){
            return vm.images;
        };
        function save() {
            ImgUploadService.confirm(vm.images).then(function (result) {
                vm.images = result;
            });
        }

        function addTemporaryFiles(files) {

            if (!files.length) return;
            ImgUploadService.uploadFiles(files).success(function (data) {
                var uploaded = _.map(data, function (resource) {
                    return ImgUploadService.mapFileDataToImage(resource);
                });
                vm.images = vm.images.concat(uploaded);
            })
        }


    }];

    app.controller('TR_ImageUploadController', ImgUploadController);

    app.service('TR.ImageUploadService', ['$upload', '$http', function ($upload, $http) {

    }]);

    app.service('$tr', ['$upload', '$http', '$q', function ($upload, $http, $q) {


        this.config = config;
        this.setInitialImages = setInitialImages;
        this.confirm = confirm;
        this.getImages = getImages;
        this.uploadFiles = upload;
        this.mapFileDataToImage = mapFileDataToImage;

        function confirm(images) {
            /*var deferred = $q.defer();
            console.log('confirm');
            confirmImages(images).
                then(function (result) {
                    console.log(results);
                    console.log('delete');
                    return deleteImages(result);
                }).then(function(result){
                    console.log(result);
                    console.log('done');
                    deferred.resolve(result);
                });
            return deferred.promise;*/
            /*
             var deferred = $q.defer();
             console.log("confirm images");
             confirmImages(images).then(function(img){
             console.log(img);
             console.log('delete images');
             deleteImages(img).then(function(result){
             console.log(result);
             deferred.resolve(result);
             });
             });
             return deferred.promise;*/
            //return output;
            //console.log(images);
            //images = deleteImages(images);
            //console.log(images);
            //return images;
            var myDeferred = $q.defer();
            var requests = [$q.defer()];
            angular.forEach(getImages(images, {temporary: true, del: false}), function (img) {
                var p = $http.put(configuration.host + configuration.path.delete + img.filename);
                requests.push(p);
                p.success(function (filedata) {
                    var newImg = mapFileDataToImage(filedata);
                    img.src = newImg.src;
                    img.filename = newImg.filename;
                    img.del = false;
                    img.temporary = false;
                });
            });
            angular.forEach(getImages(images, {del: true}), function (img) {
                var p = $http.delete(configuration.host + configuration.path.put + img.filename);
                requests.push(p);
                p.success(function () {
                    images = _.without(images, img);
                });
            });
            $q.all(requests).then(
                function(){
                    myDeferred.resolve(images);
                }
            );
            return myDeferred.promise;
        }

        function getImages(images, filter) {
            return _.where(images, filter);
        }

        function setInitialImages(filenames) {
            images = _.map(filenames, function (filename) {
                return new Image(filename, undefined, false, false);
            });
        }

        function upload(files) {
            //if(!files.length) return;
            var upload = {
                url: configuration.host + configuration.path.post,
                file: files,
                method: 'POST'
            };
            return $upload.upload(upload);
            /*   .progress(function(evt){

             })
             .success(function(data,status,headers,config){
             var newImages = _.map(data,function(filedata){return mapFileDataToImage(filedata);});
             images = images.concat(newImages);
             })*/
        }

        function config(conf) {
            if (conf.host) {
                configuration.host = conf.host;
            }
            if (conf.path) {
                if (conf.path.post) {
                    configuration.path.post = conf.path.post;
                }
                if (conf.path.get) {
                    configuration.path.get = conf.path.get;
                }
                if (conf.path.put) {
                    configuration.path.put = conf.path.put;
                }
                if (conf.path.delete) {
                    configuration.path.delete = conf.path.delete;
                }
            }
        }

        function mapFileDataToImage(filedata) {
            return new Image(filedata.filename, configuration.host + configuration.path.get + filedata.filename, false, filedata.isTemporaryFile);
        }


    }]);

    app.directive('imgUplInit', function ($tr) {
        return {
            restrict: 'E',
            scope: {
                host: '='
            },
            controller: ['$tr', '$scope', function ($tr, $scope) {
                //$tr.config({host: $scope.host});
                //$tr.setInitialImages(['Qkxekhyn.jpg','mJe-e0k3.jpg']);
            }]
        }
    });

    app.directive('imgUplDropzone', function () {
        return {
            return: 'E',
            scope: {
                addTempfiles : '@'
            },
            templateUrl: root + 'templates/dropzone.template.html'
            //controller:ImgUploadController,
            //controllerAs: 'trI'
        }
    });

    app.directive('imgUplImages', function () {
        return {
            return: 'E',
            scope: false,
            //controller: ImgUploadController
            //controllerAs: 'trI',
            templateUrl: root + 'templates/images.template.html'
        }
    });

    var dirController = ['$scope', '$tr', function ($scope, $tr) {
        $scope.$tr = $tr;
    }];
}(angular, _));