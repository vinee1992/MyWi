'use strict';
releasePlannerApp
		.factory(
				'ReleasePlannerService',
				function($http, $q) {
					return {

						generateSprints : function() {
							return $http({
								method : 'GET',
								url : 'generateSprintDetails',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						publishSprints : function() {
							return $http({
								method : 'GET',
								url : 'pubishSprintDetails',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						getProductBacklog : function() {
							return $http({
								method : 'GET',
								url : 'getProductBacklog',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						getSelectedBacklog :function() {
							return $http({
								method : 'GET',
								url : 'getSelectedBacklog',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						
						createReleasePlan : function(productBacklog) {
							var deferred = $q.defer();
							$http.post("createReleasePlan", productBacklog)
									.then(function(response) {
										return deferred.resolve(response.data);
									}, function(errResponse) {
										console.log(errResponse);
										return deferred.reject(errResponse);
									});
							return deferred.promise;
						},
						
						createWSJFScreen :  function(productBacklog) {
							var deferred = $q.defer();
							$http.post("createWSJFScreen", productBacklog)
									.then(function(response) {
										return deferred.resolve(response.data);
									}, function(errResponse) {
										console.log(errResponse);
										return deferred.reject(errResponse);
									});
							return deferred.promise;
						},

						submitFormData : function(file) {
							var deferred = $q.defer();
							$http.post("uploadFile", file, {
								withCredentials : true,
								headers : {
									'Content-Type' : undefined
								},
								transformRequest : angular.identity
							}).then(function(response) {
								deferred.resolve(response.data);
							}, function(errResponse) {
								console.log(errResponse);
								return deferred.reject(errResponse); // after
								// this
							});
							return deferred.promise;
						},

						sample : function() {
							return $http({
								method : 'GET',
								url : 'sample',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						getSprintPageOnLoad : function(appflow) {

							return $http({
								method : 'GET',
								url : 'loadSprintsForRelease',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.log("error" + response);
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});

						},

						updateSprintsData : function(releasePlannerRelease) {
							var data = releasePlannerRelease;
							if(data.velocityTrend==""){
								data.velocityTrend=0;
							}
//							var dateOfStart= new Date(data.startDate);
//							var UTCstartDate= new Date(Date.UTC(dateOfStart.getFullYear(), dateOfStart.getMonth(), dateOfStart.getDate(), dateOfStart.getHours(), dateOfStart.getMinutes()));
//							data.startDate=UTCstartDate;
//							
//							var dateOfEnd = new Date(data.endDate);
//							var UTCendDate= new Date(Date.UTC(dateOfEnd.getFullYear(), dateOfEnd.getMonth(), dateOfEnd.getDate(), dateOfEnd.getHours(), dateOfEnd.getMinutes()));
//							data.endDate=UTCendDate; 

							var deferred = $q.defer();
							$http.post("updateRelease", data)
									.then(function(response) {
										
										return deferred.resolve(response.data);
									}, function(errResponse) {
										if (errResponse.status == 409)
											$('#p1').text("Release name already exists");
										 $('#myModal').modal('show');
											//alert('Release name already exists.');
										console.log(errResponse);
										return deferred.reject(errResponse);
									});
							return deferred.promise;

						},
						
						
						
						saveUpdateSprintsData : function(releasePlannerRelease) {
							var data= releasePlannerRelease;
							if(data.velocityTrend==""){
								data.velocityTrend=0;
							}
					
							var deferred = $q.defer();
							$http.post("saveSprints", data)
									.then(function(response) {
										return deferred.resolve(response.data);
									}, function(errResponse) {
										console.log(errResponse);
										return deferred.reject(errResponse);
									});
							return deferred.promise;

						},
						
						saveWSJFData : function(data){
							var myJsonData = JSON.stringify(data);
							var deferred = $q.defer();
							$http.post("saveWSJFData", myJsonData)
									.then(function(response) {
										return deferred.resolve(response);
									}, function(errResponse) {
										console.log(errResponse);
										return deferred.reject(errResponse);
									});
							return deferred.promise;

						},
						
						savesaveReleaseData : function(data) {
							
							var myJsonData = JSON.stringify(data);
							var deferred = $q.defer();
							console.log(myJsonData);
							$http.post("createNewRelease", myJsonData).then(

							function(response) {

								return deferred.resolve(response);

							}, function(errResponse) {
								$('#p1').text("Release name already exists");
								 $('#myModal').modal('show');
								//alert('release name already exists')
								return deferred.reject(errResponse);
							});
							return deferred.promise;
						},

						/*
						 * savesaveReleaseData : function(params) {
						 * alert('inside service'); var deferred = $q.defer();
						 * console.log(params); alert('object set');
						 * $http.post("releaseInfo", params).then(
						 * function(response) { alert('inside response'); return
						 * deferred.resolve(response.params); },
						 * function(errResponse) { alert('inside error
						 * response') console.log(errResponse); return
						 * deferred.reject(errResponse); }); return
						 * deferred.promise; },
						 */

						getProvision : function() {
							return $http({
								method : 'GET',
								url : 'getProvisionRequest',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						getProjectDetails : function() {
							return $http({
								method : 'GET',
								url : 'getProjectDetails',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						getReleaseBacklog : function() {
							return $http({
								method : 'GET',
								url : 'getReleaseBacklog',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						downloadPublishedReleasePlan : function() {
							window.location = "downloadPublishedReleasePlan";
						},

						getProjectReleases : function() {
							return $http({
								method : 'GET',
								url : 'getProjectReleases',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						getProjectDetailsForPastAnalysis : function(releaseId) {
							return $http({
								method : 'GET',
								url : 'getProjectDetailsForPastAnalysis',
								params : {
									'releaseId' : releaseId,
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						getProductBacklogForPastAnalysis : function(releaseId) {
							return $http({
								method : 'GET',
								url : 'getProductBacklogForPastAnalysis',
								params : {
									'releaseId' : releaseId,
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						getReleaseBacklogForPastAnalysis : function(releaseId) {
							return $http({
								method : 'GET',
								url : 'getReleaseBacklogForPastAnalysis',
								params : {
									'releaseId' : releaseId,
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},

						downloadPastPublishedPlan : function(releaseId) {
							window.location = window.location ="downloadPastPublishedReleasePlan?releaseId=" + releaseId;
						},

						publishReleasePlan : function(releaseId) {
							return $http({
								method : 'GET',
								url : 'publishReleasePlan',
								params : {
									'releaseId' : releaseId,
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						checkError : function() {
							return $http({
								method : 'GET',
								url : 'checkError',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						timeoutError : function() {
							return $http({
								method : 'GET',
								url : 'checkTimeout',
								params : {
									random_no : Math.random()
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						},
						
						moveStory : function(moveStoryRequest) {
							var deferred = $q.defer();
							
							$http.post("moveStory", moveStoryRequest).then(
							function(response) {
								return deferred.resolve(response);
							}, function(errResponse) {
								return deferred.reject(errResponse);
							});
							return deferred.promise;
						},
						
						moveConfirmed : function(request) {
							var deferred = $q.defer();
							
							$http.post("moveConfirmed", request).then(
							function(response) {
								return deferred.resolve(response);
							}, function(errResponse) {
								return deferred.reject(errResponse);
							});
							return deferred.promise;
						},
						
						deleteSprint : function(sprintId, sprintName) {
							return $http({
								method : 'GET',
								url : 'deleteSprint',
								params : {
									sprintId : sprintId,
									sprintName : sprintName,
								}
							}).then(function(response) {
								return response.data;
							}, function(errResponse) {
								console.error('Error while fetching Items');
								return $q.reject(errResponse);
							});
						}

					};

				});