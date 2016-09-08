'use strict';

angular.module('MyApp', []);

angular.module('MyApp')
	.constant('URL', 'http://vumen-api.ahmadarif.com/api/v1/event')
	.service('DateService', function() {
		function pad(s) {
			return (s < 10) ? '0' + s : s; 
		}    	

    	this.toString = function (inputFormat) {
    		var d = new Date(inputFormat);
    		return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');    		
    	}
	})
	.controller('MyController', function ($scope, $http, URL, DateService) {
		
		// define variabel
		$scope.event = {
			id: '',
			name: '',
			description: '',
			date: '' 
		};
        $scope.eventShowed = {};
        $scope.events = [];
        $scope.isModalDeleteShow = false;

        // method
        $scope.fetchEvent = function () {
        	$http.get(URL)
        		.success(function(response) {
					$scope.events = response.data;
				})
				.error(function (response) {
					console.log(response);
					alert('Gagal mengambil event!');
				});
        };

        $scope.showEvent = function (index) {
            $scope.localEvent = $scope.events[index];

            $scope.eventShowed = {
                index: index,
                id: $scope.localEvent.id,
                name: $scope.localEvent.name,
                description: $scope.localEvent.description,
                date: new Date($scope.localEvent.date)
            };
        };

        $scope.addEvent = function () {
            if ($scope.event.name) {
                var localEvent = {
                    name: $scope.event.name,
                    description: $scope.event.description,
                    date: DateService.toString($scope.event.date)
                };

                // insert data to backend
                $http.post(URL, localEvent)
                	.success(function (response) {
                		$scope.event.id = response.data.id;
	                    $scope.events.push($scope.event);
	                    $scope.event = {};
                	})
                	.error(function (response) {
                		console.log(response);
                		alert("Gagal menyimpan event!");
                	});
            }
        }

        $scope.updateEvent = function (event) {
            // object send to backend
            $scope.localEvent = {
                name: event.name,
                description: event.description,
                date: event.date
            };

            // update data to backend
            $http.put(URL + '/' + event.id, $scope.localEvent)
            	.success(function (response) {
	                if (response.success) {
	                    $scope.events[event.index].id = response.data.id;
	                    $scope.events[event.index].name = response.data.name;
	                    $scope.events[event.index].description = response.data.description;
	                    $scope.events[event.index].date = response.data.date;
	                }
	            })
	            .error(function (response) {
	            	console.log(response);
	            	alert("Gagal memperbarui event!");
	            });
        };

        $scope.deleteEvent = function (index, isConfirm) {
            $scope.localEvent = $scope.events[index];

            if (!isConfirm) {
                $scope.eventShowed = {
                    index: index,
                    id: $scope.localEvent.id,
                    name: $scope.localEvent.name
                };

                $('#modal-delete').modal();
            } else {
                // DELETE data from backend
                $http.delete(URL + '/' + $scope.localEvent.id)
                	.success(function (response) {
	                    if (response.success) {
	                        $scope.events.splice(index, 1);
	                    }
	                })
	                .error(function (response) {
                    	console.log(response);
                    	alert('Gagal menghapus event');
	                });
            }
        };

        // first load, get all events
        $scope.fetchEvent();
	});