'use strict';

releasePlannerApp.directive('releaseplannerdatepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                    dateFormat:'mm/dd/yy',
                    autoclose : true,
                    forceParse: false,
                    onSelect:function (date) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(date);
                        });
                    }
                });
            });
        }
    }
});

releasePlannerApp.directive('meterguage', function($timeout) {
    return {
        restrict: 'A',
        link : function (scope, element, attrs) {
            $timeout(function(){
            	var confidence = 0;
            	var viable=0;
            	var counter=0;
            	for(counter=0; counter<element.context.attributes.length;counter++){
            		if(element.context.attributes[counter].nodeName=="confidence"){
            			confidence = element.context.attributes[counter].nodeValue;
            		}
            		
            		if(element.context.attributes[counter].nodeName=="viable"){
            			viable = element.context.attributes[counter].nodeValue;
            		}
            	}
            	
            	if (viable == "false") {
            		confidence = 100 - confidence;
            	} else {
            		confidence = confidence;
            	}

            	var meterColor = "";
            	
            	if ((confidence >= 0) && (confidence < 50)) {
            		meterColor = "#ff4e00";
            	} else if ((confidence >= 50) && (confidence < 76)) {
            		meterColor = "#fcc110";
            	} else {
            		meterColor = "#8ceab9";
            	}
            	
            	new JustGage({
            	    id: element.context.id,
            	    value: confidence,
            	    symbol: '%',
            	    pointer: true,
            	    gaugeWidthScale: 0.6,
            		valueMinFontSize : 12,
            		hideMinMax : true,
            	    customSectors: [{
            	      color: meterColor,
            	      lo: 50,
            	      hi: 100
            	    }, {
            	      color: meterColor,
            	      lo: 0,
            	      hi: 50
            	    }],
            	    counter: true
            	  });
            });
        }
    }
});

releasePlannerApp
.controller(
		'SampleController',
		[
				'$scope',
				'$rootScope',
				'ReleasePlannerService',
				function($scope, $rootScope, ReleasePlannerService) {
					
					$scope.sample="From Angular js ";
				} ]);

releasePlannerApp
.controller(
		'timeoutController',
		[
				'$scope',
				'$rootScope',
				'ReleasePlannerService',
				function($scope, $rootScope, ReleasePlannerService) {
					ReleasePlannerService
							.timeoutError()
							.then(
									function(d) {

										$scope.error = d;

									},
									function(errResponse) {
										$scope.errorMessage = "Something went wrong. please contact support Team."

									});
				} ]);

releasePlannerApp
.controller(
		'ReleasePublishController',
		[
				'$scope',
				'$timeout',
				'ReleasePlannerService',
				function($scope, $timeout, ReleasePlannerService) {
					onLoad();
					function onLoad(){
						ReleasePlannerService
						.publishSprints()
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										$scope.projectResponse = d;
										$scope.maxNumberOfStoriesInASprint = 0;
										

										
										$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
											if ((sprint.releasePlannerStories != undefined) && (sprint.releasePlannerStories != null)) {
												if (sprint.releasePlannerStories.length > $scope.maxNumberOfStoriesInASprint) {
													$scope.maxNumberOfStoriesInASprint = sprint.releasePlannerStories.length;
												}
											}
										});
										
										$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
											if ((sprint.releasePlannerStories != undefined) && (sprint.releasePlannerStories != null)) {
												sprint.scopeUtilized = 0;
												
												sprint.releasePlannerStories.forEach(function(story){
													sprint.scopeUtilized = sprint.scopeUtilized + parseInt(story.storyPoints);
												});
												
												sprint.scopeUtilizedBar = {};
												var scopeUtilizedBar = (sprint.scopeUtilized/sprint.plannedVelocity)*100;
												var scopeUtilizedBarString = scopeUtilizedBar + '%';
												sprint.scopeUtilizedBar = {
														"width" : scopeUtilizedBarString
												};

											}
										});

										
										$scope.maxNumberOfStoriesInASprintRange = [];
										for(var i=0;i<$scope.maxNumberOfStoriesInASprint;i++) {
											$scope.maxNumberOfStoriesInASprintRange.push(i);
										}
									}
								},
								function(errResponse) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
								});
						
							
					}
					
					$scope.downloadPublishedReleasePlan = function() {
						ReleasePlannerService
						.downloadPublishedReleasePlan();
						
					};
					
				}	]); 
releasePlannerApp
.controller(
		'ReleasePlannerController',
		[
				'$scope',
				'$timeout',
				'ReleasePlannerService',
				'ReleasePlannerFilterService',
				function($scope, $timeout, ReleasePlannerService, ReleasePlannerFilterService) {
					
					onLoad();
					
					function calculateWSJFCompleteness(backlogStories){
						var storyWithWSJF=0;
						var selectedBacklog=0;
						backlogStories.forEach(function(story){
							if((story.isSelected==true)&&((story.businessValue!=null)&&(story.businessValue!=0)&&(story.businessValue!=undefined))&&((story.riskReductionOpportunityEnablement!=null)&&(story.riskReductionOpportunityEnablement!=0)&&(story.riskReductionOpportunityEnablement!=undefined))){
//							if(story.wsjf!='0.0'){
								storyWithWSJF++;
							}
						});
						
						backlogStories.forEach(function(story){
							if(story.isSelected==true){
								selectedBacklog++;
							}
						});
						
						$scope.WSJFcompletenessPercentage=(storyWithWSJF/selectedBacklog)*100;
					}
					
					function generateDependencyList(storyId, dependencyList) {
						var dependentOn = $scope.storyMap.get(storyId).storyDependentOn;
						
						if ((dependentOn != null) && (dependentOn.length > 0)) {
							dependentOn.forEach(function(dependency){
								dependencyList.push(dependency);
								generateDependencyList(dependency, dependencyList);
								return;
							});							
						} else {
							return;
						}
					}
					
					function buildStoryMaps() {
						$scope.storyMap = new Map();
						$scope.productBacklog.backlogStories.forEach(function(story){
							$scope.storyMap.set(story.storyId, story);
						});
						
						$scope.storyDependencyMap = new Map();
						$scope.productBacklog.backlogStories.forEach(function(story){
							var dependencyList = [];
							generateDependencyList(story.storyId, dependencyList);
							$scope.storyDependencyMap.set(story.storyId, dependencyList);
						});
						
					}
					
					function selectStories() {
						var atLeastOneSelected = false;
						
						$scope.productBacklog.backlogStories.forEach(function(story){
							var dependencyOnHold = false;
							var dependencyList = $scope.storyDependencyMap.get(story.storyId);
							
							if (((story.storyStatus.toLowerCase()) == 'closed') ||
									((story.storyStatus.toLowerCase()) == 'on hold') ||
									((story.storyStatus.toLowerCase()) == 'invalid') ||
									((story.storyStatus.toLowerCase()) == 'done')) {
								story.isSelected = false;
							} else {
								dependencyList.forEach(function(dependency){
									if ((($scope.storyMap.get(dependency).storyStatus.toLowerCase()) == 'on hold') || (($scope.storyMap.get(dependency).storyStatus.toLowerCase()) == 'invalid')){
										dependencyOnHold = true;
									}
								});
								
								if (!dependencyOnHold) {
									story.isSelected = true;
									atLeastOneSelected = true;
								} else {
									story.isSelected = false;
								}
							}
						});
						
						if (atLeastOneSelected) {
							calculateWSJFCompleteness($scope.productBacklog.backlogStories);
							angular.element('#createReleasePlanButton').attr('class','btn btn-default btn-blue sa-su');							
						}
					}
					
					
					function onLoad() {
						$('#awaiting_response').show();
						ReleasePlannerService
								.getProjectDetails()
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#awaiting_response').hide();
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											} else {
												$scope.projectResponse = d;
												$('#awaiting_response').hide();
											}
										},
										function(errResponse) {
											//$scope.errorMessage = "Something went wrong. please contact support Team."
											$('#awaiting_response').hide();
											$('#p1').text("Something went wrong. Please contact support team.");
											$('#myModal').modal('show');
										});

						$('#awaiting_response').show();
						ReleasePlannerService
								.getProductBacklog()
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#awaiting_response').hide();
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											} else {
												$scope.productBacklog = new Object();
												$scope.productBacklog.backlogStories = d;
												
												$scope.productBacklog.totalStoryPoints = 0;
												
												buildStoryMaps();
												
												var selectedStories=JSON.parse(sessionStorage.getItem("selectedStories"));
												if((selectedStories==undefined) ||(selectedStories==null) ||(selectedStories.length==0)){
													selectStories();
												}else{
													var atLeastOneSelected = false;
													selectedStories.forEach(function(story){
														$scope.productBacklog.backlogStories.forEach(function(bstory){
														if(story.storyId==bstory.storyId){
															bstory.isSelected=true;
															atLeastOneSelected=true;
														}		
														});
													});
													if (atLeastOneSelected) {
														angular.element('#createReleasePlanButton').attr('class','btn btn-default btn-blue sa-su');							
													}
													sessionStorage.removeItem("selectedStories");
												}
												
												
												calculateWSJFCompleteness($scope.productBacklog.backlogStories);
												
												$scope.productBacklog.backlogStories.forEach(function(item){
													item.isPinned = false;
													
													$scope.productBacklog.totalStoryPoints = $scope.productBacklog.totalStoryPoints + parseInt(item.storyPoints);
												});

												if ($scope.productBacklog.backlogStories.length >= 8) {
													$scope.productBacklogSplit1 = $scope.productBacklog.backlogStories
															.slice(
																	0,
																	8);
												} else {
													$scope.productBacklogSplit1 = $scope.productBacklog.backlogStories;
												}

												if ($scope.productBacklog.backlogStories.length >= 8) {
													var temp = [];
													$scope.productBacklogSplit2 = [];
													var i;
													for (i = 8; i < $scope.productBacklog.backlogStories.length; i++) {
														if ((i != 8)
																&& ((i % 8) == 0)) {
															$scope.productBacklogSplit2
																	.push(temp);
															temp = [];
														}
														temp
																.push($scope.productBacklog.backlogStories[i]);
													}

													$scope.productBacklogSplit2
															.push(temp);

												} else {
													$scope.productBacklogSplit2 = [];
												}

												var maxStackRank = 0;
												
												$scope.productBacklog.backlogStories.forEach(function(item) {
													if (parseInt(item.stackRank) > maxStackRank) {
														maxStackRank = parseInt(item.stackRank);
													}
												});
												
												var stackRankSliderMax = (maxStackRank - (maxStackRank%50)) + 50;
												
												// Create sliders.
							 					$("#range1")
					 							.ionRangeSlider(
					 									{
					 										hide_min_max : true,
					 										keyboard : false,
					 										min : 0,
					 										max : stackRankSliderMax,
					 										from : 0,
					 										to : stackRankSliderMax,
					 										type : 'double',
					 										step : 1,
					 										prefix : "",
					 										onFinish : function(data) {
					 													$scope.updateStoryRankSliderValue(data.from, data.to);
					 										},
					 										grid : false
					 									});
							 					
							 					
							 					var maxStoryPoints = 0;
							 					
							 					$scope.productBacklog.backlogStories.forEach(function(item) {
							 						if (parseInt(item.storyPoints) > maxStoryPoints) {
							 							maxStoryPoints = parseInt(item.storyPoints);
							 						}
							 					});
							 					
							 					var storyPointSliderMax = (maxStoryPoints - (maxStoryPoints%50)) + 50;
							 					$("#range")
					 							.ionRangeSlider(
					 									{
					 										hide_min_max : true,
					 										keyboard : false,
					 										min : 0,
					 										max : storyPointSliderMax,
					 										from : 0,
					 										to : storyPointSliderMax,
					 										type : 'double',
					 										step : 1,
					 										prefix : "",
					 										onFinish : function(data) {
					 											$scope.updateStoryPointSliderValue(data.from, data.to);
					 										},
					 										grid : false
					 									});
											}
											
											$('#awaiting_response').hide();
										},
										function(errResponse) {
											$('#awaiting_response').hide();
											$('#p1').text("Something went wrong. Please contact support team.");
											$('#myModal').modal('show');
										});
						
					};

					$scope.createReleasePlan = function() {
						
						sessionStorage.removeItem("selectedStories");
						var selectedStories = [];
						var copySelectedStories = [];
						
						copySelectedStories = $scope.productBacklog.backlogStories.filter(function(story){
							return story.isSelected;
						}
						);

						angular.copy(copySelectedStories, selectedStories);
						
						if (selectedStories.length == 0) {
							
							$('#p1').text("Please select few stories for release planning.");
							$('#myModal').modal('show');
							return;
						}
						
						selectedStories.forEach(function(story) {
							delete story.isSelected;
							delete story.isPinned;
						}); 
						
						
						
						//if stackRanking is false
						
//						
//						for(var i=0;i<$scope.productBacklog.backlogStories.length;i++){
//							if($scope.productBacklog.backlogStories[i].stackRanking==false){
//								$scope.productBacklog.backlogStories[0].stackRanking=false;
//						}
//						}	
						var selectcount=0;
						var stackcount=0;
						var wsjfcount=0;
						
						$scope.productBacklog.backlogStories.forEach(function(backlogStory){
							
							if(backlogStory.isSelected){
								selectcount++;
							}
							
							if((backlogStory.isSelected)&&(backlogStory.stackRanking==true)){
								stackcount++;
							}
							if((backlogStory.isSelected)&&(backlogStory.wsjfRanking==true)){
								wsjfcount++;
							}
						});
						
						
							//if stackRanking and wsjfRanking is false
							if((selectcount>stackcount)&&(selectcount!=wsjfcount)){
								$('#p1').text("Fill in all the required values in WSJF Screen to create a release plan");
								$('#myModal').modal('show');
								return false;
							}
//							if((selectcount==stackcount)&&(selectcount!=wsjfcount)){
//								$('#myModal5').modal('show');
//							}
							if((selectcount==stackcount)&&(selectcount>wsjfcount)){
								$('#myModal5').modal('show');
							}
							
						
						
						
//						if(($scope.productBacklog.backlogStories[0].stackRanking==false)&&($scope.productBacklog.backlogStories[0].wsjfRanking==false)){
//							$('#p1').text("Fill in all the required values in WSJF Screen to create a release plan");
//							$('#myModal').modal('show');
//							return false;
//						}
						
						
						//release plan to be created according to stackRanking or wsjfRanking
						// if stackRanking is true
//						
//						if(($scope.productBacklog.backlogStories[0].stackRanking==true)&&($scope.productBacklog.backlogStories[0].wsjfRanking==false)){
//						$('#myModal5').modal('show');
					$scope.StackRanking=function(){
						$scope.inprogress = true;
						$('#awaiting_response').show();
						ReleasePlannerService
						.createReleasePlan(selectedStories)
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#awaiting_response').hide();
										$scope.errorMessage = d.errorMessage;
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										// To Do redirect to new
										// page
										$(location) .attr( 'href', 'releaseViabilityScreen');
								}},
								function(errResponse) {
									$('#awaiting_response').hide();
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								});
						
					}
//						
//						if(($scope.productBacklog.backlogStories[0].stackRanking==true)&&($scope.productBacklog.backlogStories[0].wsjfRanking==true)||
//									(($scope.productBacklog.backlogStories[0].stackRanking==false)&&($scope.productBacklog.backlogStories[0].wsjfRanking==true))){
//					
							if(selectcount==wsjfcount){
							$scope.inprogress = true;
							$('#awaiting_response').show();
							ReleasePlannerService
							.createReleasePlan(selectedStories)
							.then(
									function(d) {
										if (angular
												.isDefined(d.errorMessage)
												) {
											$('#awaiting_response').hide();
											$scope.errorMessage = d.errorMessage;
											$('#p1').text("Something went wrong. Please contact support team.");
											$('#myModal').modal('show');
										} else {
											// To Do redirect to new
											// page
											sessionStorage.setItem("selectedStories",JSON.stringify(selectedStories));
											$(location) .attr( 'href', 'releaseViabilityScreen');
									}},
									function(errResponse) {
										$('#awaiting_response').hide();
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									});
							
						}		
						
					};
					
					$scope.createWSJFview = function(){

						var selectedStories = [];
						var copySelectedStories = [];
						
						copySelectedStories = $scope.productBacklog.backlogStories.filter(function(story){
							return story.isSelected;
						}
						);

						angular.copy(copySelectedStories, selectedStories);
						
						if (selectedStories.length == 0) {
							
							$('#p1').text("Please select few stories for release planning.");
							$('#myModal').modal('show');
							return;
						}
						
						selectedStories.forEach(function(story) {
							delete story.isSelected;
							delete story.isPinned;
						}); 
						 
						sessionStorage.setItem("selectedStories",JSON.stringify(selectedStories));
						
						$scope.inprogress = true;
						$(location) .attr( 'href', 'WSJFScreen');
						
						
						
//						$('#awaiting_response').show();
//						ReleasePlannerService
//						.createWSJFScreen(selectedStories)
//						.then(
//								function(d) {
//									if (angular
//											.isDefined(d.errorMessage)
//											) {
//										$('#awaiting_response').hide();
//										$scope.errorMessage = d.errorMessage;
//										$('#p1').text("Something went wrong. Please contact support team.");
//										$('#myModal').modal('show');
//									} else {
//										// To Do redirect to new
//										// page
//										$(location) .attr( 'href', 'WSJFScreen');
//								}},
//								function(errResponse) {
//									$('#awaiting_response').hide();
//									$('#p1').text("Something went wrong. Please contact support team.");
//									$('#myModal').modal('show');
//								});
					};
					
					$scope.storyPinnedView = false;
					$scope.storySearchView = false;
					$scope.storySearchString = "";
					
					$scope.filters = new Map();
					
					$scope.applyFilter = function() {
						
						$scope.storyPinnedView = false;
						$scope.storySearchView = false;
						// Adding or Removing the filters
						if ($scope.filters.get(arguments[0]) == undefined) {
							switch (arguments[0]) {
								case "DependentOn":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentOn;
									value.parameters = "";//Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "DependentBy":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentBy;
									value.parameters = "";//Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;

								case "Priority":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByPriority;
									value.parameters = new Map();
									value.parameters.set(arguments[1], 1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "StoryPoints":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByStoryPoints;
									value.parameters = [$("#range").data("ionRangeSlider").result.from, $("#range").data("ionRangeSlider").result.to];
									$scope.filters.set('StoryPoints', value);
									break;

								case "StoryRank":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByStoryRank;
									value.parameters = [$("#range1").data("ionRangeSlider").result.from, $("#range1").data("ionRangeSlider").result.to];
									$scope.filters.set('StoryRank', value);
                                    break;
                                    
								default:
									break;
							}
						} else {
							if (arguments[0] == "Priority") {
								if ($scope.filters.get("Priority").parameters.has(arguments[1])) {
									$scope.filters.get("Priority").parameters.delete(arguments[1]);
									
									if ($scope.filters.get("Priority").parameters.size == 0) {
										$scope.filters.delete(arguments[0]);
									}
								} else {
									$scope.filters.get("Priority").parameters.set(arguments[1], 1);
								}
							} else {
							    $scope.filters.delete(arguments[0]);
							}
						}
						
						// Applying filters
						var result = $scope.productBacklog.backlogStories;
						
						$scope.filters.forEach(function(value, key, mapObj){
							result = value.func(result, value.parameters);
						});
						
						udpatesStoryView(result);
					}
					
					function udpatesStoryView(result){

						var storiesInASlide = 0;
						
						if ($scope.leftBarShown) {
							storiesInASlide = 8;
						} else {
							storiesInASlide = 10;
						}
						
						angular.element('#carousel-example-generic').carousel('pause');
						angular.element('#carousel-example-generic').removeData();

						$timeout(function(){}, 500);
						
						if (result.length >= storiesInASlide) {
							$scope.productBacklogSplit1 = result
									.slice(0, storiesInASlide);
						} else {
							$scope.productBacklogSplit1 = result;
						}

						if (result.length > storiesInASlide) {
							var temp = [];
							$scope.productBacklogSplit2 = [];
							var i;
							for (i = storiesInASlide; i < result.length; i++) {
								if ((i != storiesInASlide) && ((i % storiesInASlide) == 0)) {
									$scope.productBacklogSplit2
											.push(temp);
									temp = [];
								}
								temp
										.push(result[i]);
							}

							$scope.productBacklogSplit2
									.push(temp);

						} else {
							$scope.productBacklogSplit2 = [];
						}
						
						
						angular.element('#activeCarouselItem').attr('class', 'item active');
						angular.element('#carousel-example-generic').carousel({interval: false});
						
						if ($scope.leftBarShown) {
							angular.element('#carousel-inner-id').attr('class', 'carousel-inner margin_top25');
						} else {
							angular.element('#carousel-inner-id').attr('class', 'carousel-inner margin_top25 collapse_sidebar');
						}

						
						$timeout(function(){}, 500);
					};
					
					
					$scope.storyRankFilterDisabled = true;
					$scope.storyPointsFilterDisabled = true;
					
					$scope.updateStoryPointSliderValue = function(from, to) {
						if (!$scope.storyPointsFilterDisabled) {
							$scope.filters.delete('StoryPoints');
							
							var value = new Object();
							
							value.func = ReleasePlannerFilterService.filterByStoryPoints;
							value.parameters = [$("#range").data("ionRangeSlider").result.from, $("#range").data("ionRangeSlider").result.to];
							$scope.filters.set('StoryPoints', value);
							
							$scope.applyFilter();
						}
					};
					
					$scope.updateStoryRankSliderValue = function(from, to) {
						if (!$scope.storyRankFilterDisabled) {
							$scope.filters.delete('StoryRank');
							
							var value = new Object();
							
							value.func = ReleasePlannerFilterService.filterByStoryRank;
							value.parameters = [$("#range1").data("ionRangeSlider").result.from, $("#range1").data("ionRangeSlider").result.to];
							$scope.filters.set('StoryRank', value);
							
							$scope.applyFilter();
						}
					};
					
					$scope.selectAll = function() {
						selectStories();
					}
					
					$scope.deSelectAll = function() {
						$('#defaultSelect').removeClass("text_line");
						$scope.productBacklog.backlogStories.forEach(function(story){
							story.isSelected = false;
						});
						calculateWSJFCompleteness($scope.productBacklog.backlogStories);
						angular.element('#createReleasePlanButton').attr('class','btn map-btn map-btn1 btn-default');
					}
					
					$scope.storySelectDeselect = function(storyId) {
						var i;
						for (i=0; i<$scope.productBacklog.backlogStories.length; i++) {
							if ($scope.productBacklog.backlogStories[i].storyId == storyId) {
								
								if (!$scope.productBacklog.backlogStories[i].isSelected) {
									if (($scope.productBacklog.backlogStories[i].storyStatus.toLowerCase() == 'on hold') ||
									    ($scope.productBacklog.backlogStories[i].storyStatus.toLowerCase() == 'closed') ||
									    ($scope.productBacklog.backlogStories[i].storyStatus.toLowerCase() == 'done') ||
									    ($scope.productBacklog.backlogStories[i].storyStatus.toLowerCase() == 'invalid')) {
										$('#p1').text("Cannot select a story with status " + $scope.productBacklog.backlogStories[i].storyStatus);
										$('#myModal').modal('show');
										return;
									}
									
									var foundDependencyOnHold = false;
									$scope.storyDependencyMap.get(storyId).forEach(function(dependency){
										if (($scope.storyMap.get(dependency).storyStatus.toLowerCase() == 'on hold')||($scope.storyMap.get(dependency).storyStatus.toLowerCase() == 'invalid')) {
											$('#p1').text("Cannot select the story as its' dependency story " + dependency + " is " + $scope.storyMap.get(dependency).storyStatus +".");
											$('#myModal').modal('show');
											foundDependencyOnHold = true;
											return;
										}
									});
									
									if (foundDependencyOnHold) {
										return;
									}
									
									$scope.autoSelect = [];
									$scope.storyDependencyMap.get(storyId).forEach(function(dependency){
										if ((!$scope.storyMap.get(dependency).isSelected) && (($scope.storyMap.get(dependency).storyStatus.toLowerCase() != 'closed') && ($scope.storyMap.get(dependency).storyStatus.toLowerCase() != 'done'))) {
											$scope.autoSelect.push(dependency);
										}
									});
									
									if ($scope.autoSelect.length > 0) {
										$('#p2').text("Following dependency stories [" + $scope.autoSelect +"] for story "+storyId+" will also get selected. Do you wish to continue?");
										$scope.autoSelect.push(storyId);
										$('#myModal3').modal('show');
										return;
									}
								} else {
									$scope.autoDeselect = [];
									
									$scope.productBacklog.backlogStories.forEach(function(story){
										$scope.storyDependencyMap.get(story.storyId).forEach(function(dependency){
											if (dependency == storyId) {
												if (story.isSelected) {
													$scope.autoDeselect.push(story.storyId);
												}
											}
										});
									});
									
									if ($scope.autoDeselect.length > 0) {
										$('#p3').text("Following stories [" + $scope.autoDeselect +"] dependent on story "+storyId+" will also get deselected. Do you wish to continue?");
										$scope.autoDeselect.push(storyId);
										$('#myModal4').modal('show');
										return;
									}
								}
								
								
								$scope.productBacklog.backlogStories[i].isSelected = !$scope.productBacklog.backlogStories[i].isSelected;
								
								if ($scope.productBacklog.backlogStories[i].isSelected) { 
									angular.element('#createReleasePlanButton').attr('class','btn btn-default btn-blue sa-su');
									
								} else {
									var foundOneTrue = false;
									$scope.productBacklog.backlogStories.forEach(function(story){
										if (story.isSelected) {
											foundOneTrue = true;
										}
									});
							
									
									if (!foundOneTrue) {
										angular.element('#createReleasePlanButton').attr('class','btn map-btn map-btn1 btn-default');
										
									}
								}
								
								
								break;
							}
						}
						calculateWSJFCompleteness($scope.productBacklog.backlogStories);
					};

					$scope.autoSelectDependency = function() {
						$scope.autoSelect.forEach(function(story){
							$scope.storyMap.get(story).isSelected = true;
						});
						
						$scope.autoSelect = [];
						angular.element('#createReleasePlanButton').attr('class','btn btn-default btn-blue sa-su');
					}
					
					$scope.autoDeselectDependent = function() {
						$scope.autoDeselect.forEach(function(story){
							$scope.storyMap.get(story).isSelected = false;
						});
						
						$scope.autoDeselect = [];
						
						var foundOneTrue = false;
						$scope.productBacklog.backlogStories.forEach(function(story){
							if (story.isSelected) {
								foundOneTrue = true;
							}
						});
						
						if (!foundOneTrue) {
							angular.element('#createReleasePlanButton').attr('class','btn map-btn map-btn1 btn-default');
						}
					}
					
					$scope.showPinnedStories = function () {
						$scope.storyPinnedView = true;
						
						udpatesStoryView(ReleasePlannerFilterService.filterByIsPinned($scope.productBacklog.backlogStories));

					}
					
					$scope.searchStories = function() {
						if ($scope.storySearchString == "") {
						} else {
							$scope.storySearchView = true;
							udpatesStoryView(ReleasePlannerFilterService.filterBySearchText($scope.productBacklog.backlogStories, $scope.storySearchString));
						}
					}

					$scope.pinUnpin = function(storyId, $event) {
						var i;
						for (i=0; i<$scope.productBacklog.backlogStories.length; i++) {
							if ($scope.productBacklog.backlogStories[i].storyId == storyId) {
								$scope.productBacklog.backlogStories[i].isPinned = !$scope.productBacklog.backlogStories[i].isPinned;
								break;
							}
						}
						
						if ($scope.storyPinnedView) {
						    $scope.showPinnedStories();
						}
						
						$event.preventDefault();
						$event.stopPropagation();
					}; 
					
					$scope.css = new Object();
					$scope.css.productBacklogSelectionItemClass = "pdt-backlog row";
					$scope.css.releaesBacklogSelectionItemClass = "rlg-backlog row";
					$scope.css.springBacklogSelectionItemClass = "sprint-list";
					
					$scope.showProductBacklog = function () {
					};
					
					$scope.showReleaseBacklog = function() {
					};
					
					$scope.showSprintBacklog = function(id) {
					}
					
					$scope.leftBarShown = true;
					$scope.toggleLeftBar = function () {
						$(".hide_panel").toggleClass('show_panel');
						
						$scope.leftBarShown = !$scope.leftBarShown;
						
						udpatesStoryView($scope.productBacklog.backlogStories);
					}
					
				} ]);

releasePlannerApp.controller('releasePageController',['$scope','$timeout', 'ReleasePlannerService',
	function($scope,$timeout,ReleasePlannerService)
	{
	
	$scope.originalRelease={
			releaseName: '',
			startDate:'' ,
			endDate  : '',
			sprintDuration:'1' ,
			team :'' ,
			sprintDeploy:'',
			sprint0: '',
			sprintHardening:'',
			plannedVelocity:'',
			velocityTrend:'0'
			
		};
		
		$scope.release = angular.copy($scope.originalRelease);
//		$scope.release.sprintDuration = $scope.release.sprintDuration;
		$scope.fileUploaded=false;
		$scope.release.autoEndDate=false;
		$scope.calledonetime = false;
		$scope.dataSaved= false;
		$scope.navigateToSaveButton=false;
		$scope.navigateToNextScreen=false;
		$scope.filename ="";
		onLoad();
		
		function onLoad() {
			$scope.navigateToNextScreen=false;
			//$scope.$apply();
			sessionStorage.removeItem("selectedStories");
			
		var backlogFilename = sessionStorage.getItem("fileName");
			
		var appflow = sessionStorage.getItem("applicationflow");
		
		
			ReleasePlannerService.getSprintPageOnLoad(appflow).then(
					
					function(d) {
				
						$("#projectmodel").on
						if (angular
								.isDefined(d.errorMessage)
								) {
							
							//$scope.errorMessage = d.errorMessage;
							$('#p1').text("Something went wrong. Please contact support team.");
							 $('#myModal').modal('show');
							
						} else {
							$scope.releasePlannerProject = d;	
							if($scope.releasePlannerProject.releasePlannerReleases[0]!=null){
								
								$scope.fileUploaded=true;
								$scope.release.autoEndDate=false;
								$scope.navigateToSaveButton = true;
								$scope.navigateToNextScreen=false;
								$scope.dataSaved=true;
								$scope.calledonetime=true;
								$scope.releasePlannerRelease=$scope.release;
								if($scope.dataSaved==true){
									$scope.filename = backlogFilename;
									}
							}
							else{
								$scope.fileUploaded=false;
								$scope.release.autoEndDate=true;
								$scope.calledonetime = false;
								$scope.dataSaved= false;
								$scope.navigateToSaveButton=false;
								$scope.navigateToNextScreen=false;
								if($scope.dataSaved==true){
									$scope.filename = backlogFilename;
									}
							}
							function convert(str) {
							    var date = new Date(str),
							        mnth = ("0" + (date.getMonth()+1)).slice(-2),
							        day  = ("0" + date.getDate()).slice(-2),
							        year = date.getFullYear();
							    return [ mnth, day, year ].join("/");
							}
		
							$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
							//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
							$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
							
							$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
							//$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
							$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate;
							
							$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
							
							angular.copy($scope.releasePlannerProject.releasePlannerReleases[0], $scope.release);
//							$scope.release.sprintDurations  =[{'name' : 'Select', 'value' : 'Select'},{'name' : '1 week', 'value' : '1'},{'name' : '2 weeks', 'value' : '2'},{'name' : '3 weeks', 'value' : '3'},{'name' : '4 weeks', 'value' : '4'}]
//							$scope.release.sprintDuration=$scope.release.sprintDurations[$scope.release.sprintDuration].value;
							
							angular.forEach($scope.releasePlannerSprints, function(item, index){
								
								var sprintStartDate  = convert(item.startDate);
								var sprintEndDate = convert(item.endDate);
								//item.startDate = new Date(sprintStartDate);
								item.startDate = sprintStartDate;
								//item.endDate = new Date(sprintEndDate);
								item.endDate = sprintEndDate;
							});	
							
							$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
							$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
							$scope.tempPlannedVelocity=$scope.releasePlannerProject.releasePlannerReleases[0].plannedVelocity;
							$scope.tempVelocityTrend=$scope.releasePlannerProject.releasePlannerReleases[0].velocityTrend;
							$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);
							
							getProductBacklog();
						}
					
					},
					function(errResponse) {
						//$scope.errorMessage = "Something went wrong. please contact support Team."
						$('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
							
					});
			
			function getProductBacklog() {
					ReleasePlannerService
				.getProductBacklog()
				.then(
						function(d) {
							if (angular
									.isDefined(d.errorMessage)
									) {
								console.log(d);
								$('#p1').text("Something went wrong. Please contact support team.");
								 $('#myModal').modal('show');
							} else {
								$scope.productBacklog = d;
								
								var count =0;
								var found = 0;
								for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++) {
									if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity == "") {
										found = 1;
									}
								}
								
//								if (found == 0) {
//									$scope.navigateToNextScreen = true;
//								}
								
							}
						},
						function(errResponse) {
						//	$scope.errorMessage = "Something went wrong. please contact support Team."
							$('#p1').text("Something went wrong. Please contact support team.");
							 $('#myModal').modal('show');
						});
				}

		}

		$scope.uploadFile = function() {
		
		var filePath = angular.element('#productBacklogFile')[0].files;
		sessionStorage.setItem("fileName",filePath[0].name);

		if (filePath.length == 0) {
			$('#p1').text("Please select a product backlog file.");
			$('#myModal').modal('show');
			//alert('Please select a product backlog file.');
		} else {
		
			$('#awaiting_response').show();
			var fd = new FormData();
			fd.append("file", filePath[0]);
			var file = fd;
		
			ReleasePlannerService
					.submitFormData(file)
					.then(
							function(d) {
								if (angular
										.isDefined(d.errorMessage)) {
									if (angular.equals(d.errorMessage, null)) {
										$('#awaiting_response').hide();
										$('#p1').text("Error processing product backlog file.");
										$('#myModal').modal('show');
										$scope.fileUploaded=false;
										$scope.navigateToNextScreen=false;
										//alert('Error processing product backlog file.');
									} else {
										$('#awaiting_response').hide();
										$scope.errorMessage = d.errorMessage;
										$('#p1').text($scope.errorMessage);
										$('#myModal').modal('show');
										$scope.fileUploaded=false;
										$scope.navigateToNextScreen=false;
									}
								}else {
									$('#awaiting_response').hide();
									$scope.fileUploaded=true;
									$scope.calledonetime==true;
									$scope.filename = filePath[0].name;
								}
								
							},
							function(errResponse) {
								$('#awaiting_response').hide();
								$('#p1').text("Something went wrong. Please contact support team.");
								$('#myModal').modal('show');
							} );
		}
	};
	
	
	
	function validateForm(){
			
		function GetDateFormat(date) {
	           var month = (date.getMonth() + 1).toString();
	           month = month.length > 1 ? month : '0' + month;
	           var day = date.getDate().toString();
	           day = day.length > 1 ? day : '0' + day;
	           //return date.getFullYear() + '-' +  month +'-' + day;
	           return month + '/' + day + '/' + date.getFullYear();
	           
	    }
		
		function convert(str) {
		    var date = new Date(str),
		        mnth = ("0" + (date.getMonth()+1)).slice(-2),
		        day  = ("0" + date.getDate()).slice(-2),
		        year = date.getFullYear();
		    return [ mnth, day, year ].join("/");
		}

		if($scope.fileUploaded!=true){
			$('#p1').text("Please upload product backlog file");
			$('#myModal').modal('show');	
			return false;
		}
		
		// Release Name is mandatory.
		if ($scope.release.releaseName == "") {
			$('#p1').text("Release name can not be empty.");
			 $('#myModal').modal('show');
			//alert("Release name can not be empty.");
			return false;
		}
		
		// Team name is mandatory.
		if($scope.release.team == "") {
			$('#p1').text("Team name can not be empty.");
			 $('#myModal').modal('show');
			//alert("Team name can not be empty.");
			return false;
		}
		
		// Start Date is mandatory.
		if($scope.release.startDate == "") {
			$('#p1').text("Start date can not be empty.");
			 $('#myModal').modal('show');
			return false;
		}
		
		var today = new Date();
		var dateFormattoday = GetDateFormat(today); 

		
		if($scope.release.endDate==""|| $scope.release.autoEndDate==true)
		{
		if(($scope.release.plannedVelocity=="")&&($scope.release.velocityTrend==""))
				{
			$('#p1').text("Planned Veocity is required");
			$('#myModal').modal('show');	
			return false;
				}
		if(($scope.release.plannedVelocity=="")&&(!$scope.release.velocityTrend==""))
			{
			$('#p1').text("Planned Veocity is required");
			$('#myModal').modal('show');	
			return false;
			}
		}
		
		if($scope.release.plannedVelocity!=""){
			if (!isInt(($scope.release.plannedVelocity))) {
				$('#p1').text("Release planned velocity must be an integer.");
				 $('#myModal').modal('show');
				return false;
			}
			
			if (parseInt($scope.release.plannedVelocity) <= 0) {
				$('#p1').text("Sprint planned velocity must be greater than zero.");
				 $('#myModal').modal('show');
				return false;
			}
		}
		if($scope.release.velocityTrend==""){
			$scope.release.velocityTrend='0';
		}

		if($scope.release.velocityTrend!=""){
			if(!isInt($scope.release.velocityTrend)){
				$('#p1').text("Release velocity trend must be an integer.");
				 $('#myModal').modal('show');
				return false;
			}
			
		}
		
		if(($scope.release.velocityTrend<0)||($scope.release.velocityTrend>100)){
			$('#p1').text("Velocity Trend should be in range 0 to 100.");
			 $('#myModal').modal('show');
			
			return false;
		}	
		
		if(($('[name=startDate]').val()) < (dateFormattoday)){
			
			$('#p1').text("Start Date can not be in past.");
			 $('#myModal').modal('show');
			//alert('Start Date can not be in past.');
			return false;
		}
		
		if($scope.release.endDate!=""){
//		if(($scope.release.endDate) < (dateFormattoday)){
			var endDated = new Date($scope.release.endDate);
			var todayDate = new Date();
			if(endDated<todayDate){
			$('#p1').text("End Date can not be in past.");
			 $('#myModal').modal('show');
			//alert('End Date can not be in past.');
			return false;
		}
		
		var startDate = $('[name=startDate]').val().split(
				'/'), // 2018 01 11
		startMo = parseInt(startDate[0], 10), // cast
		// Strings
		// as
		// Numbers
		startDay = parseInt(startDate[1], 10), startYear = parseInt(
				startDate[2], 10);

		var endDate = $scope.release.endDate.split('/'), endMo = parseInt(
				endDate[0], 10), // cast Strings as
		// Numbers
		endDay = parseInt(endDate[1], 10), endYear = parseInt(
				endDate[2], 10);

		// end date should be greater than start date
		
		if (startYear > endYear || endYear == startYear
				&& startMo > endMo || endYear == startYear
				&& startMo == endMo && (startDay > endDay ||
				startDay == endDay)) {
			
			$('#p1').text("End Date should be later than Start Date.");
			 $('#myModal').modal('show');
			//alert('End Date should be later than Start Date.');
			return false;
		}
		
		
		
		var sprints=1;
		if($scope.release.sprint0){
			sprints++;
		}
		if($scope.release.sprintHardening){
			sprints++;
		}
		if( $scope.release.sprintDeploy){
			sprints++;
		}
		
		var duration = 7;
		if($scope.release.sprintDuration=='1'){
		     duration = 7;	
		}
		if($scope.release.sprintDuration=='2'){
			 duration= 14;
		}
		if($scope.release.sprintDuration=='3'){
			 duration =21;
		}
		if($scope.release.sprintDuration=='4'){
		     duration = 28;
		}
									
		var startDate = new Date($scope.release.startDate);
		var endDate = new Date($scope.release.endDate);
		var date1_ms = startDate.getTime();
		var date2_ms = endDate.getTime();
		var diff = date2_ms-date1_ms; 
		// get days
		var days = (diff/1000/60/60/24) + 1;
			
		if(!((days)>=(sprints*duration))){
			
			$('#p1').text("Release duration should be in multiple of Sprint Duration.");
			 $('#myModal').modal('show');
		  	//alert('Release duration should be in multiple of Sprint Duration. ');
		   	return false;
		}
		}
		if($scope.release.endDate!=""){
		if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test($scope.release.endDate)){
			$('#p1').text("Date format should be in mm/dd/yyyy");
			 $('#myModal').modal('show');
			 return false;
		}
		}
		
		
		//var UTCstartDate= new Date(Date.UTC(dateOfStart.getFullYear(), dateOfStart.getMonth(), dateOfStart.getDate(), dateOfStart.getHours(), dateOfStart.getMinutes()));
//		$scope.release.startDate=dateOfStart;
		
		
//		var dateOfEnd = new Date($scope.release.endDate);
//		var UTCendDate= new Date(Date.UTC(dateOfEnd.getFullYear(), dateOfEnd.getMonth(), dateOfEnd.getDate(), dateOfEnd.getHours(), dateOfEnd.getMinutes()));
//		$scope.release.endDate=dateofEnd;
		
		return true;
	}

	$scope.updateSprintData=function(){
		if(validateForm()){
		ReleasePlannerService.updateSprintsData($scope.releasePlannerRelease).then (

				function(d) {
	
					if (angular
							.isDefined(d.errorMessage)
						) {
						  	$('#p1').text("Something went wrong. Please contact support team.");
					 		$('#myModal').modal('show');
					} else{
						$scope.releasePlannerProject = d;
						function convert(str) {
						    var date = new Date(str),
						        mnth = ("0" + (date.getMonth()+1)).slice(-2),
						        day  = ("0" + date.getDate()).slice(-2),
						        year = date.getFullYear();
						    return [ mnth, day, year ].join("/");
						}

					$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
					//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
					$scope.release.startDate = $scope.releaseStartDate;
					$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
					
					$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
					$scope.release.endDate = $scope.releaseEndDate;
					//$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
					$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate;
					$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.release.endDate;
					
					$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
					
					angular.forEach($scope.releasePlannerSprints, function(item, index){
						
						var sprintStartDate  = convert(item.startDate);
						var sprintEndDate = convert(item.endDate);
						//item.startDate = new Date(sprintStartDate);
						item.startDate = sprintStartDate;
						//item.endDate = new Date(sprintEndDate);
						item.endDate = sprintEndDate;
					});	
					
					$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
					$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
					$scope.tempPlannedVelocity=$scope.releasePlannerProject.releasePlannerReleases[0].plannedVelocity;
					$scope.tempVelocityTrend=$scope.releasePlannerProject.releasePlannerReleases[0].velocityTrend;
					$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);
					
					$scope.navigateToSaveButton = true;
					$scope.navigateToNextScreen = false; 
					$scope.changesSavedMessage = false;
					}
			
				}, function(d){
					function convert(str) {
					    var date = new Date(str),
					        mnth = ("0" + (date.getMonth()+1)).slice(-2),
					        day  = ("0" + date.getDate()).slice(-2),
					        year = date.getFullYear();
					    return [ mnth, day, year ].join("/");
					}
					$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
					$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
					
					
					$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
					$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate; 
					
				}
		
				);
		}
};
	
	
	$scope.saveRelease=function()
	{
		if($scope.fileUploaded==false){
			$scope.calledonetime==false;
		}
		
	    if($scope.calledonetime== false || $scope.dataSaved==false)
	    {
	        $scope.calledonetime = true;
	        $scope.saveReleaseData();
	    }else
	    {
	        $scope.updateSprintData();
	    }

	}
	
	$scope.saveReleaseData=function(){
		
		function convert(str) {
		    var date = new Date(str),
		        mnth = ("0" + (date.getMonth()+1)).slice(-2),
		        day  = ("0" + date.getDate()).slice(-2),
		        year = date.getFullYear();
		    return [ mnth, day, year ].join("/");
		}
		
		if(validateForm()) {
//			if($scope.release.sprintDuration=='Select') {
//				$scope.release.sprintDuration='1';
//			}
			
			if(!$scope.release.endDate==""){
				$scope.release.autoEndDate=false;
				$scope.release.endDate = convert($scope.release.endDate);
			}
				
				
			ReleasePlannerService.savesaveReleaseData($scope.release).then (

				function(d) {
					if (angular
							.isDefined(d.errorMessage)
						) {
						//$scope.errorMessage = d.errorMessage;
						$('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
						
					} else {
						
						$scope.dataSaved=true;
						function convert(str) {
						    var date = new Date(str),
						        mnth = ("0" + (date.getMonth()+1)).slice(-2),
						        day  = ("0" + date.getDate()).slice(-2),
						        year = date.getFullYear();
						    return [ mnth, day, year ].join("/");
						}
						
						$scope.release.startDate=convert(d.data.startDate);
						$scope.release.endDate = convert(d.data.endDate);
						$scope.releasePlannerRelease=d.data;
						$scope.navigateToSaveButton=false;
						$scope.updateSprintData($scope.releasePlannerRelease);
//					
//						$(location)
//						.attr(
//								'href',
//								'sprintpage');
					}
				}, function(d) {
					function convert(str) {
					    var date = new Date(str),
					        mnth = ("0" + (date.getMonth()+1)).slice(-2),
					        day  = ("0" + date.getDate()).slice(-2),
					        year = date.getFullYear();
					    return [ mnth, day, year ].join("/");
					}

					var startDate = convert($scope.startDate);
					$scope.startDate = startDate
					var endDate = convert($scope.endDate);
					$scope.endDate = endDate
					
					
				});
		};
	};
		
		$scope.releaseNameChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			if ($scope.tempReleaseName != $scope.release.releaseName) {
				
				$('#p2').text("Release name has changed please click on 'Go'.");
				 $('#myModal1').modal('show');
				//alert("Release name has changed please click on 'Go'.");
				$scope.tempReleaseName = $scope.release.releaseName;
				$scope.releasePlannerRelease.releaseName=$scope.release.releaseName;
			}
			}
		}
		
		
		
		$scope.releaseStartDateChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
				function convert(str) {
				    var date = new Date(str),
				        mnth = ("0" + (date.getMonth()+1)).slice(-2),
				        day  = ("0" + date.getDate()).slice(-2),
				        year = date.getFullYear();
				    return [ mnth, day, year ].join("/");
				}
			$scope.releasePlannerRelease.startDate=convert($scope.release.startDate);
			$('#p2').text("Sprint structure needs to be realigned as Release Start Date has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			}
		}
		
		
		$scope.releaseEndDateChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			$scope.releasePlannerRelease.endDate= $scope.release.endDate;
			$('#p2').text("Sprint structure needs to be realigned as Release End Date has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			 if($scope.release.endDate!=""){
			 $scope.release.autoEndDate=false;
			 $scope.releasePlannerRelease.autoEndDate=false;
			 }else{
				 $scope.release.autoEndDate=true;
				 $scope.releasePlannerRelease.autoEndDate=true;
			 }
			}
		}
		
		$scope.releaseSprintDurationChanged = function () {
			$scope.releasePlannerRelease.sprintDuration = $scope.release.sprintDuration;
			$('#p2').text("Sprint structure needs to be realigned as Release Sprint Duration  has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			//alert("Sprint structure needs to be realigned as Release Sprint Duration has changed, please click on 'Go'");
		}
		
		$scope.releaseTeamNameChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			if ($scope.tempTeamName != $scope.release.team) {
				$('#p2').text("Release Team has changed please click on 'Go'.");
				 $('#myModal1').modal('show');
				$scope.tempTeamName = $scope.release.team;
				$scope.releasePlannerRelease.team=$scope.release.team;
			}
			}
		}
		$scope.sprint0=false;
		$scope.sprintHardening=false;
		$scope.sprintDeploy=false;

		$scope.releaseSprintTypeChanged = function ($event) {
			if($event.target.id == "sprint0"){
				$scope.sprint0 = !$scope.release.sprint0;
				$scope.release.sprint0 = $scope.sprint0;
				$scope.releasePlannerRelease.sprint0 = $scope.sprint0;
			} else if($event.target.id == "hardening"){
				$scope.sprintHardening = !$scope.release.sprintHardening;
				$scope.release.sprintHardening=$scope.sprintHardening;
				$scope.releasePlannerRelease.sprintHardening = $scope.sprintHardening;
			} else {
				$scope.sprintDeploy = !$scope.release.sprintDeploy;
				$scope.release.sprintDeploy=$scope.sprintDeploy;
				$scope.releasePlannerRelease.sprintDeploy = $scope.sprintDeploy;
			}
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			$('#p2').text("Release Sprint Type has changed please click on 'Go'.");
			 $('#myModal1').modal('show');
 			}
		}
		
		$scope.releasePlannedVelocityChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			if ($scope.tempPlannedVelocity != $scope.release.plannedVelocity){
			$('#p2').text("Sprint structure needs to be realigned as Release Planned Velocity has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			 $scope.releasePlannerRelease.plannedVelocity=$scope.release.plannedVelocity;
		}}}
		
		$scope.releaseVelocityTrendChanged = function () {
			if(($scope.fileUploaded==true) && ($scope.dataSaved==true)){
			if ($scope.tempVelocityTrend != $scope.release.velocityTrend){
			
			$('#p2').text("Sprint structure needs to be realigned as Release Velocity Trend has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			 $scope.releasePlannerRelease.velocityTrend=$scope.release.velocityTrend;
			//alert("Sprint structure needs to be realigned as Release Start Date has changed, please click on 'Go'");
		}}}
		
	
		
		$scope.sprintDateChanged = function(index, dateType) {
			function GetDateFormat(date) {
		           var month = (date.getMonth() + 1).toString();
		           month = month.length > 1 ? month : '0' + month;
		           var day = date.getDate().toString();
		           day = day.length > 1 ? day : '0' + day;
		           //return date.getFullYear() + '-' +  month + '-' + day;
		           return month + '/' + day + '/' + date.getFullYear();
		           
		    }
			var oldDate;
			var newDate;
			
			if (dateType == "start") {
				oldDate = new Date($scope.tempSprints[index].startDate);
				newDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[index].startDate);
			} else {
				oldDate = new Date($scope.tempSprints[index].endDate);
				newDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[index].endDate);
			}
			
			var diffInDays = (newDate.getTime() - oldDate.getTime()) / 1000 / 3600 / 24;
			
			var count=index;
			for (count=index; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++) {
				if (count == index) {
					if (dateType == "start") {
						$scope.tempSprints[count].startDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate;
						
						var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()));
						newEndDate.setDate(newEndDate.getDate() + diffInDays);
						$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate = GetDateFormat(newEndDate);
						$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;
						
						if (index != 0) {
							var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate).getTime()));
							newEndDate.setDate(newEndDate.getDate() + diffInDays);
							$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate = GetDateFormat(newEndDate);
							$scope.tempSprints[count-1].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate;
						}
					} else {
						if($scope.tempSprints[count].startDate>$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate){
							$('#p1').text("sprint end date cannot be less than sprint start date.");
							 $('#myModal').modal('show');
							$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate= $scope.tempSprints[count].endDate;
							return false;
						}
						$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;
					}
					
				} else {
					var newStartDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate).getTime()));
					newStartDate.setDate(newStartDate.getDate() + diffInDays);
					$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate = GetDateFormat(newStartDate);
					$scope.tempSprints[count].startDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate;

					var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()));
					newEndDate.setDate(newEndDate.getDate() + diffInDays);
					$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate = GetDateFormat(newEndDate);
					$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;

				}
			}
		
			$timeout(function(){}, 5000);
			
			$scope.changesSavedMessage = false;
			$scope.navigateToNextScreen = false;
			
			$scope.sameSprintDurationCheck(index);
//			$scope.lastSprintReleaseEndOverlap();
//			$scope.firstSprintReleaseStartOverlap();
		}

		 $scope.saveUpdatedSprintData=function(){
			 $scope.lastSprintReleaseEndOverlap = function() {
					var indexLastSprint =  $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length;
					
					if ( new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[indexLastSprint-1].endDate).getTime() > new Date($scope.releasePlannerProject.releasePlannerReleases[0].endDate).getTime()) {
						//alert("Release End Date should be equal to last sprint's end Date. Please adjust Release or Sprint dates.");
							$('#p1').text("Correct the Sprint end date / change the release end date.");
							 $('#myModal').modal('show');

					//	alert('Correct the Sprint end date / change the release end date.');
						return false;
					}
					
					return true;
				}
				
			 
			 $scope.checkForSprintDate = function(){
                 var count;
                 for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
                              if (new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate).getTime() > new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()) {
                                     $('#p1').text("Correct the Sprint end date.");
                                     $('#myModal').modal('show');
                                     return false;
                              }      
                 }                    
                 return true;
			 }
			 
				$scope.firstSprintReleaseStartOverlap = function() {
					var indexLastSprint =  $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length;
					
					if ( new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[0].startDate).getTime() != new Date($scope.releasePlannerProject.releasePlannerReleases[0].startDate).getTime()) {
						//alert("Release Start Date should be equal to first sprint's start Date. Please adjust Release or Sprint dates.");
						$('#p1').text("Correct the Sprint start date / change the release start date.");
						 $('#myModal').modal('show');
						//alert('Correct the Sprint start date / change the release start date');
						return false;
					}
					
					return true;
				}
				
				$scope.checkForSprintName = function(){
					var count;
					for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
							if (($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintName == "")) {
								$('#p1').text("Sprint Name cannot be empty.");
								 $('#myModal').modal('show');
								return false;
							}	
					}
					
					return true;
				}
				
				$scope.checkForSameSprintName= function(){
					
					var sprintNames=[];
					var count;
					for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
						sprintNames.push($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintName);
					}
//					var hasDup = sprintNames.some((val,i)=>{
//						  return sprintNames.indexOf(val.trim())!=i
//						})	
					var hasDup = false;
					var nameMap = new Map();
					
					sprintNames.forEach(function(sprintName){
						if (nameMap.has(sprintName.trim())) {
							 hasDup = true;
						} else {
							nameMap.set(sprintName.trim(), 1);
						}
					});
					
					if(hasDup==true){
						$('#p1').text("Sprints cannot have same name.");
						$('#myModal').modal('show');
						return false;
					}
					return true;
				}
				
				$scope.checkForSprintVelocity = function() {
					var count;
					for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
						if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintType == "Development Sprint") {
							if (($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity == "")) {
								$('#p1').text("Sprint planned velocity cannot be empty.");
								 $('#myModal').modal('show');
								//alert('Sprint planned velocity cannot be empty.');
								return false;
							}
							
							if (!Number.isInteger(parseInt($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity))) {
								$('#p1').text("Sprint planned velocity must be an integer.");
								 $('#myModal').modal('show');
								//alert('Sprint planned velocity must be an integer.');
								return false;
							}
							
							if (parseInt($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity) <= 0) {
								$('#p1').text("Sprint planned velocity must be greater than zero.");
								 $('#myModal').modal('show');
								//alert("Sprint planned velocity must be greater than zero.");
								
								return false;
							}
						}
					}
					
					return true;
				}
				
				
			 
			 if (($scope.lastSprintReleaseEndOverlap())&&
				 ($scope.firstSprintReleaseStartOverlap()) &&
				 ($scope.checkForSprintVelocity()) &&
				 ($scope.checkForSprintName())&&
				 ($scope.checkForSameSprintName())&&
				 ($scope.checkForSprintDate())
				 //&& ($scope.checkForProductBacklogReadiness())
				 ) {
				  ReleasePlannerService.saveUpdateSprintsData($scope.releasePlannerProject.releasePlannerReleases[0]).then (
				  
				  function(d) {
					  if (angular 
							  .isDefined(d.errorMessage)
							 ) { 
						  $scope.errorMessage = d.errorMessage; 
						  $('#p1').text("Something went wrong. Please contact support team.");
							 $('#myModal').modal('show');
					  } else {
				  
						  $scope.release = d; 
						  
							function convert(str) {
							    var date = new Date(str),
							        mnth = ("0" + (date.getMonth()+1)).slice(-2),
							        day  = ("0" + date.getDate()).slice(-2),
							        year = date.getFullYear();
							    return [ mnth, day, year ].join("/");
							}
							
							$scope.releasePlannerRelease.sprintDuration=$scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration
							$scope.release.sprintDuration=$scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration;
//							$scope.release.sprintDurations=[{'name' : 'Select', 'value' : 'Select'},{'name' : '1 week', 'value' : '1'},{'name' : '2 weeks', 'value' : '2'},{'name' : '3 weeks', 'value' : '3'},{'name' : '4 weeks', 'value' : '4'}];
//							$scope.release.sprintDuration=$scope.release.sprintDurations[$scope.release.sprintDuration].value;
//							
							$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
							//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
							$scope.releasePlannerProject.releasePlannerReleases[0].startDate=$scope.releaseStartDate;
							$scope.releasePlannerRelease.startDate=$scope.releaseStartDate;
							$scope.release.startDate=$scope.releaseStartDate;
							//$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
							$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
							$scope.releasePlannerProject.releasePlannerReleases[0].endDate=	$scope.releaseEndDate;
							$scope.release.endDate=$scope.releaseEndDate;
							$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
							
							angular.forEach($scope.releasePlannerSprints, function(item, index){
								
								var sprintStartDate  = convert(item.startDate);
								var sprintEndDate = convert(item.endDate);
								//item.startDate = new Date(sprintStartDate);
								item.startDate = sprintStartDate;
								//item.endDate = new Date(sprintEndDate);
								item.endDate = sprintEndDate;
							});	
							
							$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
							$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
							$scope.tempPlannedVelocity=$scope.releasePlannerProject.releasePlannerReleases[0].plannedVelocity;
							$scope.tempVelocityTrend=$scope.releasePlannerProject.releasePlannerReleases[0].velocityTrend;
							$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);
						  
						  $scope.changesSavedMessage = true;
						  $scope.navigateToNextScreen = true;
						  $scope.dataSaved=true;
						 
					  } 
					  
				  });
			 }
		   };
		/*
		 * $http.post('/saveNewRelease',{release:$scope.release})
		 * .success(onSuccess) .error(onError);
		 */
	
	$scope.navigateToBacklogScreen = function() {
		if ($scope.navigateToNextScreen) {
			$(location) .attr( 'href', 'backlogScreen');
		}
	};
	
	$scope.showDateCalendar = function (id) {
		$('#'+id).datepicker('show');
	}

	$scope.showDateCalendar1 = function(index, dateType) {
		$('#'+'datepickerSprint'+index+dateType).datepicker('show');
	}
	function confirmToMoveToDashbaord(dashboardURL) {
		sessionStorage.removeItem("selectedStories");
//		if(confirm('UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?')) {
//			window.location.href = dashboardURL;
//		}
		
	$('#myModal2').modal('show');

	}
	}	
	]);

releasePlannerApp.controller('newlyReleaseController',['$scope','ReleasePlannerService',
	function($scope,ReleasePlannerService)
	{
	$scope.originalRelease={
		releaseName: '',
		startDate:'' ,
		endDate  : '',
		sprintDurations :[{'name' : 'Select', 'value' : 'Select'},{'name' : '1 week', 'value' : '1'},{'name' : '2 weeks', 'value' : '2'},{'name' : '3 weeks', 'value' : '3'},{'name' : '4 weeks', 'value' : '4'}] ,
		team :'' ,
		sprintDeploy:'',
		sprint0: '',
		sprintHardening:''
	};
	
	$scope.release = angular.copy($scope.originalRelease);
	
	$scope.release.sprintDuration = $scope.release.sprintDurations[0].value;
	
	$scope.saveReleaseData=function(){

		sessionStorage.setItem("applicationflow","getSpint");

		function GetDateFormat(date) {
	           var month = (date.getMonth() + 1).toString();
	           month = month.length > 1 ? month : '0' + month;
	           var day = date.getDate().toString();
	           day = day.length > 1 ? day : '0' + day;
	           //return date.getFullYear() + '-' +  month + '-' + day;
	           return month + '/' + day + '/' + date.getFullYear();
	           
	    }

		function validateForm(){

			var today = new Date();
			var dateFormattoday = GetDateFormat(today); 
		       
			if(($('[name=startDate]').val()) < (dateFormattoday)){
				
				$('#p1').text("Start Date can not be in past.");
				 $('#myModal').modal('show');
				//alert('Start Date can not be in past.');
				return false;
			}
			
			if(($('[name=endDate]').val()) < (dateFormattoday)){
				$('#p1').text("End Date can not be in past.");
				 $('#myModal').modal('show');
				//alert('End Date can not be in past.');
				return false;
			}
			
			
			var startDate = $('[name=startDate]').val().split(
					'/'), // 2018 01 11
			startYear = parseInt(startDate[0], 10), // cast
			// Strings
			// as
			// Numbers
			startMo = parseInt(startDate[1], 10), startDay = parseInt(
					startDate[2], 10);

			var endDate = $('[name=endDate]').val().split('/'), endYear = parseInt(
					endDate[0], 10), // cast Strings as
			// Numbers
			endMo = parseInt(endDate[1], 10), endDay = parseInt(
					endDate[2], 10);

			// end date should be greater than start date
			
			if (startYear > endYear || endYear == startYear
					&& startMo > endMo || endYear == startYear
					&& startMo == endMo && (startDay > endDay ||
					startDay == endDay)) {
				
				$('#p1').text("End Date should be later than Start Date.");
				 $('#myModal').modal('show');
				//alert('End Date should be later than Start Date.');
				return false;
			}
			
			
			var sprints=1;
			if($scope.release.sprint0){
				sprints++;
			}
			if($scope.release.sprintHardening){
				sprints++;
			}
			if( $scope.release.sprintDeploy){
				sprints++;
			}
			
			var duration = 7;
			if($scope.release.sprintDuration=='1'){
			     duration = 7;	
			}
			if($scope.release.sprintDuration=='2'){
				 duration= 14;
			}
			if($scope.release.sprintDuration=='3'){
				 duration =21;
			}
			if($scope.release.sprintDuration=='4'){
			     duration = 28;
			}
										
			var startDate = new Date($scope.release.startDate);
			var endDate = new Date($scope.release.endDate);
			var date1_ms = startDate.getTime();
			var date2_ms = endDate.getTime();
			var diff = date2_ms-date1_ms; 
			// get days
			var days = (diff/1000/60/60/24) + 1;
				
			if(!((days)>=(sprints*duration))){
				
				$('#p1').text("Release duration should be in multiple of Sprint Duration.");
				 $('#myModal').modal('show');
			  	//alert('Release duration should be in multiple of Sprint Duration. ');
			   	return false;
			}

			var dateOfStart= new Date($scope.release.startDate);
			var UTCstartDate= new Date(Date.UTC(dateOfStart.getFullYear(), dateOfStart.getMonth(), dateOfStart.getDate(), dateOfStart.getHours(), dateOfStart.getMinutes()));
			$scope.release.startDate=UTCstartDate;
			
			var dateOfEnd = new Date($scope.release.endDate);
			var UTCendDate= new Date(Date.UTC(dateOfEnd.getFullYear(), dateOfEnd.getMonth(), dateOfEnd.getDate(), dateOfEnd.getHours(), dateOfEnd.getMinutes()));
			$scope.release.endDate=UTCendDate;
			
			return true;
		}

		if(validateForm()) {
			if($scope.release.sprintDuration=='Select') {
				$scope.release.sprintDuration='1';
			}
		ReleasePlannerService.savesaveReleaseData($scope.release).then (

				function(d) {
					if (angular
							.isDefined(d.errorMessage)
						) {
						//$scope.errorMessage = d.errorMessage;
						$('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
						
					} else {
						
						$scope.release = d;
						$(location)
						.attr(
								'href',
								'sprintpage');
					}
				}, function(d) {
					function convert(str) {
					    var date = new Date(str),
					        mnth = ("0" + (date.getMonth()+1)).slice(-2),
					        day  = ("0" + date.getDate()).slice(-2),
					        year = date.getFullYear();
					    return [ mnth, day, year ].join("/");
					}

					var startDate = convert($scope.release.startDate);
					$scope.release.startDate = startDate
					var endDate = convert($scope.release.endDate);
					$scope.release.endDate = endDate
					
					
				});
		} 
		

		/*
		 * $http.post('/saveNewRelease',{release:$scope.release})
		 * .success(onSuccess) .error(onError);
		 */
	};
	
	$scope.showDateCalendar = function (id) {
		$('#'+id).datepicker('show');
	}

	
	}	
	]);


releasePlannerApp.controller('sprintPageController',['$scope', '$timeout', 'ReleasePlannerService',
	function($scope,$timeout, ReleasePlannerService)
	{
	
	$scope.releasePlannerProject = {};
	$scope.releasePlannerSprints = {};
	$scope.changesSavedMessage = false;
	$scope.navigateToNextScreen = false;

	onLoad();
	
	function onLoad() {
	
	var appflow = sessionStorage.getItem("applicationflow");

		ReleasePlannerService.getSprintPageOnLoad(appflow).then(
				
				function(d) {
			
					$("#projectmodel").on
					if (angular
							.isDefined(d.errorMessage)
							) {
						
						//$scope.errorMessage = d.errorMessage;
						$('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
						
					} else {
						$scope.releasePlannerProject = d;	
						
						function convert(str) {
						    var date = new Date(str),
						        mnth = ("0" + (date.getMonth()+1)).slice(-2),
						        day  = ("0" + date.getDate()).slice(-2),
						        year = date.getFullYear();
						    return [ mnth, day, year ].join("/");
						}
	
						$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
						
						$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate;
						
						$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
						
						angular.forEach($scope.releasePlannerSprints, function(item, index){
							
							var sprintStartDate  = convert(item.startDate);
							var sprintEndDate = convert(item.endDate);
							//item.startDate = new Date(sprintStartDate);
							item.startDate = sprintStartDate;
							//item.endDate = new Date(sprintEndDate);
							item.endDate = sprintEndDate;
						});	
						
						$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
						$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
						$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);
						
						getProductBacklog();
					}
				
				},
				function(errResponse) {
					//$scope.errorMessage = "Something went wrong. please contact support Team."
					$('#p1').text("Something went wrong. Please contact support team.");
					 $('#myModal').modal('show');
						
				});
		
		function getProductBacklog() {
				ReleasePlannerService
			.getProductBacklog()
			.then(
					function(d) {
						if (angular
								.isDefined(d.errorMessage)
								) {
							console.log(d);
							$('#p1').text("Something went wrong. Please contact support team.");
							 $('#myModal').modal('show');
						} else {
							$scope.productBacklog = d;
							
							var count =0;
							var found = 0;
							for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++) {
								if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity == "") {
									found = 1;
								}
							}
							
							if (found == 0) {
								$scope.navigateToNextScreen = true;
							}
							
						}
					},
					function(errResponse) {
					//	$scope.errorMessage = "Something went wrong. please contact support Team."
						$('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
					});
			}

	}
	
	function GetDateFormat(date) {
        var month = (date.getMonth() + 1).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        //return date.getFullYear() + '-' +  month + '-' + day;
        return  month + '/' + day + '/' + date.getFullYear()
        
	}

	$scope.updateSprintData=function(){

		console.log($scope.releasePlannerProject.releasePlannerReleases);
		

		function validateForm() {
			// Release Name is mandatory.
			if ($scope.releasePlannerProject.releasePlannerReleases[0].releaseName == "") {
				$('#p1').text("Release name can not be empty.");
				 $('#myModal').modal('show');
				//alert("Release name can not be empty.");
				return false;
			}
			
			// Team name is mandatory.
			if($scope.releasePlannerProject.releasePlannerReleases[0].team == "") {
				$('#p1').text("Team name can not be empty.");
				 $('#myModal').modal('show');
				//alert("Team name can not be empty.");
				return false;
			}
			

			// Start and End date validations.
			var today = new Date();
		    var dateFormattoday = GetDateFormat(today); 
		       
			
			if(($('[name=startDate]').val()) < (dateFormattoday)){
				
				$('#p1').text("Start Date can not be in past.");
				 $('#myModal').modal('show');
				//alert('Start Date can not be in past.');
				return false;
			}
			
			if(($('[name=endDate]').val()) < (dateFormattoday)){
				
				$('#p1').text("End Date can not be in past.");
				 $('#myModal').modal('show');
				//alert('End Date can not be in past.');
				return false;
			}
			
			var startDate = $('[name=startDate]').val().split(
					'/'), // 2018 01 11
			startYear = parseInt(startDate[0], 10), // cast
			// Strings
			// as
			// Numbers
			startMo = parseInt(startDate[1], 10), startDay = parseInt(
					startDate[2], 10);

			var endDate = $('[name=endDate]').val().split('/'), endYear = parseInt(
					endDate[0], 10), // cast Strings as
			// Numbers
			endMo = parseInt(endDate[1], 10), endDay = parseInt(
					endDate[2], 10);

			// end date should be greater than start date
			
			if (startYear > endYear || endYear == startYear
					&& startMo > endMo || endYear == startYear
					&& startMo == endMo && (startDay > endDay ||
					startDay == endDay)) {
				$('#p1').text("End Date should be later than Start Date.");
				 $('#myModal').modal('show');
				//alert('End Date should be later than Start Date.');
				return false;
			}
			
			
			
			var sprints=1;
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprint0){
				sprints++;
			}
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintDeploy){
				sprints++;
			}
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintHardening){
				sprints++;
			}
			
			var duration = 7;
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration=='1'){
			     duration = 7;	
			}
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration=='2'){
				 duration= 14;
			}
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration=='3'){
				 duration =21;
			}
			if($scope.releasePlannerProject.releasePlannerReleases[0].sprintDuration=='4'){
			     duration = 28;
			}
										
			var startDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
			var endDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
			var date1_ms = startDate.getTime();
			var date2_ms = endDate.getTime();
			var diff = date2_ms-date1_ms; 
			// get days
			var days = (diff/1000/60/60/24) + 1;
				
			if(!((days)>=(sprints*duration))){
				
				$('#p1').text("Release duration should be in multiple of Sprint Duration.");
				 $('#myModal').modal('show');
			  	//alert('Release duration should be in multiple of Sprint Duration. ');
			   	return false;
			}

			return true;
		}
		
		if (validateForm()){
			ReleasePlannerService.updateSprintsData($scope.releasePlannerProject.releasePlannerReleases[0]).then (
	
					function(d) {
		
						if (angular
								.isDefined(d.errorMessage)
							) {
							  	$('#p1').text("Something went wrong. Please contact support team.");
						 		$('#myModal').modal('show');
						} else{
							$scope.releasePlannerProject = d;
							function convert(str) {
							    var date = new Date(str),
							        mnth = ("0" + (date.getMonth()+1)).slice(-2),
							        day  = ("0" + date.getDate()).slice(-2),
							        year = date.getFullYear();
							    return [ mnth, day, year ].join("/");
							}
	
						$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
						
						$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate;
						
						$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
						
						angular.forEach($scope.releasePlannerSprints, function(item, index){
							
							var sprintStartDate  = convert(item.startDate);
							var sprintEndDate = convert(item.endDate);
							//item.startDate = new Date(sprintStartDate);
							item.startDate = sprintStartDate;
							//item.endDate = new Date(sprintEndDate);
							item.endDate = sprintEndDate;
						});	
						
						$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
						$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
						$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);

						$scope.navigateToNextScreen = false; 
						$scope.changesSavedMessage = false;
						}
				
					}, function(d){
						function convert(str) {
						    var date = new Date(str),
						        mnth = ("0" + (date.getMonth()+1)).slice(-2),
						        day  = ("0" + date.getDate()).slice(-2),
						        year = date.getFullYear();
						    return [ mnth, day, year ].join("/");
						}
						$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
						
						$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate; 
						
					}
					
					);
		}
	};
	

	 $scope.saveUpdatedSprintData=function(){
	 
		 if (($scope.lastSprintReleaseEndOverlap()) &&
			 ($scope.firstSprintReleaseStartOverlap()) &&
			 ($scope.checkForSprintVelocity()) &&
			 ($scope.checkForSprintName())&&
			 ($scope.checkForSameSprintName())
			 //&& ($scope.checkForProductBacklogReadiness())
			 ) {
			  ReleasePlannerService.saveUpdateSprintsData($scope.releasePlannerProject.releasePlannerReleases[0]).then (
			  
			  function(d) {
				  if (angular 
						  .isDefined(d.errorMessage)
						 ) { 
					  $scope.errorMessage = d.errorMessage; 
					  $('#p1').text("Something went wrong. Please contact support team.");
						 $('#myModal').modal('show');
				  } else {
			  
					  $scope.release = d; 
					  
						function convert(str) {
						    var date = new Date(str),
						        mnth = ("0" + (date.getMonth()+1)).slice(-2),
						        day  = ("0" + date.getDate()).slice(-2),
						        year = date.getFullYear();
						    return [ mnth, day, year ].join("/");
						}

						$scope.releaseStartDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].startDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].startDate = new Date($scope.releaseStartDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].startDate = $scope.releaseStartDate;
						
						$scope.releaseEndDate = convert($scope.releasePlannerProject.releasePlannerReleases[0].endDate);
						//$scope.releasePlannerProject.releasePlannerReleases[0].endDate = new Date($scope.releaseEndDate);
						$scope.releasePlannerProject.releasePlannerReleases[0].endDate = $scope.releaseEndDate;
						
						$scope.releasePlannerSprints = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints;
						
						angular.forEach($scope.releasePlannerSprints, function(item, index){
							
							var sprintStartDate  = convert(item.startDate);
							var sprintEndDate = convert(item.endDate);
							//item.startDate = new Date(sprintStartDate);
							item.startDate = sprintStartDate;
							//item.endDate = new Date(sprintEndDate);
							item.endDate = sprintEndDate;
						});	
						
						$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
						$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
						$scope.tempSprints = angular.copy($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints);
					  
					  $scope.changesSavedMessage = true;
					  $scope.navigateToNextScreen = true;
				  } 
				  
			  });
		 }
	   };
   
   

		$scope.releaseNameChanged = function () {
			if ($scope.tempReleaseName != $scope.releasePlannerProject.releasePlannerReleases[0].releaseName) {
				$('#p2').text("Release name has changed please click on 'Go'.");
				 $('#myModal1').modal('show');
				//alert("Release name has changed please click on 'Go'.");
				$scope.tempReleaseName = $scope.releasePlannerProject.releasePlannerReleases[0].releaseName;
			}
		}
		
		
		$scope.releaseStartDateChanged = function () {
			$('#p2').text("Sprint structure needs to be realigned as Release Start Date has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			//alert("Sprint structure needs to be realigned as Release Start Date has changed, please click on 'Go'");
		}
		
		$scope.releaseEndDateChanged = function () {
			$('#p2').text("Sprint structure needs to be realigned as Release End Date has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			//alert("Sprint structure needs to be realigned as Release End Date has changed, please click on 'Go'");
		}
		
		$scope.releaseSprintDurationChanged = function () {
			$('#p2').text("Sprint structure needs to be realigned as Release Sprint Duration  has changed, please click on 'Go'.");
			 $('#myModal1').modal('show');
			//alert("Sprint structure needs to be realigned as Release Sprint Duration has changed, please click on 'Go'");
		}
		
		$scope.releaseTeamNameChanged = function () {
			if ($scope.tempTeamName != $scope.releasePlannerProject.releasePlannerReleases[0].team) {
				$('#p2').text("Release Team has changed please click on 'Go'.");
				 $('#myModal1').modal('show');
				//alert("Release Team has changed please click on 'Go'.");
				$scope.tempTeamName = $scope.releasePlannerProject.releasePlannerReleases[0].team;
			}
		}
		
		$scope.releaseSprintTypeChanged = function () {
			$('#p2').text("Release Sprint Type has changed please click on 'Go'.");
			 $('#myModal1').modal('show');
			//alert("Release Sprint Type has changed please click on 'Go'.");
		}
		
		$scope.sprintDateChanged = function(index, dateType) {
			var oldDate;
			var newDate;
			
			if (dateType == "start") {
				oldDate = new Date($scope.tempSprints[index].startDate);
				newDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[index].startDate);
			} else {
				oldDate = new Date($scope.tempSprints[index].endDate);
				newDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[index].endDate);
			}
			
			var diffInDays = (newDate.getTime() - oldDate.getTime()) / 1000 / 3600 / 24;
			
			var count=index;
			for (count=index; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++) {
				if (count == index) {
					if (dateType == "start") {
						$scope.tempSprints[count].startDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate;
						
						var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()));
						newEndDate.setDate(newEndDate.getDate() + diffInDays);
						$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate = GetDateFormat(newEndDate);
						$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;
						
						if (index != 0) {
							var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate).getTime()));
							newEndDate.setDate(newEndDate.getDate() + diffInDays);
							$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate = GetDateFormat(newEndDate);
							$scope.tempSprints[count-1].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count-1].endDate;
						}
					} else {
						$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;
					}
					
				} else {
					var newStartDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate).getTime()));
					newStartDate.setDate(newStartDate.getDate() + diffInDays);
					$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate = GetDateFormat(newStartDate);
					$scope.tempSprints[count].startDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate;

					var newEndDate = new Date((new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()));
					newEndDate.setDate(newEndDate.getDate() + diffInDays);
					$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate = GetDateFormat(newEndDate);
					$scope.tempSprints[count].endDate = $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate;

				}
			}
			
			$timeout(function(){}, 500);
			
			$scope.changesSavedMessage = false;
			$scope.navigateToNextScreen = false;
			
			$scope.sameSprintDurationCheck(index);
//			$scope.lastSprintReleaseEndOverlap();
//			$scope.firstSprintReleaseStartOverlap();
		}
		
		$scope.sameSprintDurationCheck = function (index) {
			var diff = undefined;
			var count;
			if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[index].sprintType != "Development Sprint"){
				return false;
			}
			for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
				if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintType == "Development Sprint") {
					var startDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate);
					var endDate = new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate);
					
					if (diff == undefined) { 
						diff = (startDate.getTime() - endDate.getTime()) / 1000 / 3600 / 24;
					} else {
						var tempDiff = (startDate.getTime() - endDate.getTime()) / 1000 / 3600 / 24;
						
						if (tempDiff != diff) {
							$('#p2').text("Agile Principles suggest to have sprints of equal length.");
							 $('#myModal1').modal('show');
							//alert('Agile Principles suggest to have sprints of equal length.');
							return false;
						}
					}
				}
			}
			
			return true;
		}
		
		$scope.lastSprintReleaseEndOverlap = function() {
			var indexLastSprint =  $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length;
			
			if ( new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[indexLastSprint-1].endDate).getTime() != new Date($scope.releasePlannerProject.releasePlannerReleases[0].endDate).getTime()) {
				//alert("Release End Date should be equal to last sprint's end Date. Please adjust Release or Sprint dates.");
					$('#p1').text("Correct the Sprint end date / change the release end date.");
					 $('#myModal').modal('show');

			//	alert('Correct the Sprint end date / change the release end date.');
				return false;
			}
			
			return true;
		}
		
		$scope.firstSprintReleaseStartOverlap = function() {
			var indexLastSprint =  $scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length;
			
			if ( new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[0].startDate).getTime() != new Date($scope.releasePlannerProject.releasePlannerReleases[0].startDate).getTime()) {
				//alert("Release Start Date should be equal to first sprint's start Date. Please adjust Release or Sprint dates.");
				$('#p1').text("Correct the Sprint start date / change the release start date.");
				 $('#myModal').modal('show');
				//alert('Correct the Sprint start date / change the release start date');
				return false;
			}
			
			return true;
		}
		
		$scope.checkForSprintDate = function(){
			var count;
			for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
					if (new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].startDate).getTime() > new Date($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].endDate).getTime()) {
						$('#p1').text("Correct the Sprint end date.");
						 $('#myModal').modal('show');
						return false;
					}	
			}			
			return true;
		}
		
		$scope.checkForSprintName = function(){
			var count;
			for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
					if (($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintName == "")) {
						$('#p1').text("Sprint Name cannot be empty.");
						 $('#myModal').modal('show');
						return false;
					}	
			}
			
			return true;
		}
		
		$scope.checkForSameSprintName= function(){
			var sprintNames=[];
			var count;
			for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
				sprintNames.push($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintName);
			}
//			var hasDup = sprintNames.some((val,i)=>{
//				  return sprintNames.indexOf(val.trim())!=i
//				})	
				
			var hasDup = false;
			var nameMap = new Map();
					
			sprintNames.forEach(function(sprintName){
				if (nameMap.has(sprintName.trim())) {
					 hasDup = true;
				} else {
					nameMap.set(sprintName.trim(), 1);
				}
			});
			
			if(hasDup==true){
				$('#p1').text("Sprints cannot have same name.");
				$('#myModal').modal('show');
				return false;
			}
			return true;
		}
		
		$scope.checkForSprintVelocity = function() {
			var count;
			for (count=0; count<$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length; count++){
				if ($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].sprintType == "Development Sprint") {
					if (($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity == "")) {
						$('#p1').text("Sprint planned velocity cannot be empty.");
						 $('#myModal').modal('show');
						//alert('Sprint planned velocity cannot be empty.');
						return false;
					}
					
					if (!Number.isInteger(parseInt($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity))) {
						$('#p1').text("Sprint planned velocity must be an integer.");
						 $('#myModal').modal('show');
						//alert('Sprint planned velocity must be an integer.');
						return false;
					}
					
					if (parseInt($scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints[count].plannedVelocity) <= 0) {
						$('#p1').text("Sprint planned velocity must be greater than zero.");
						 $('#myModal').modal('show');
						//alert("Sprint planned velocity must be greater than zero.");
						
						return false;
					}
				}
			}
			
			return true;
		}
		
		$scope.checkForProductBacklogReadiness = function() {
			var productBacklogScope = 0;
			
			$scope.productBacklog.forEach(function(story){
				productBacklogScope = productBacklogScope + parseInt(story.storyPoints);
			});
			
			var totalReleaseVelocity = 0;
			
			$scope.releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
				if (sprint.sprintType == "Development Sprint") {
					totalReleaseVelocity = totalReleaseVelocity + parseInt(sprint.plannedVelocity);
				}
			});
			
			var eligibilityScore = (productBacklogScope / totalReleaseVelocity) * 100;
			
			if (eligibilityScore < 20) {
				alert('Product backlog is not sufficient for release planning. Total product backlog scope is less than 20% of sprint planned velocity. You may want to revisit product backlog.');
   			}
			
			return true;
		}
		
		$scope.onSprintPlannedVelocityChange = function() {
			$scope.changesSavedMessage = false;
			$scope.navigateToNextScreen = false;
		};
		
		$scope.navigateToBacklogScreen = function() {
			if ($scope.navigateToNextScreen) {
				$(location) .attr( 'href', 'backlogScreen');
			}
		};
		
		$scope.showDateCalendar1 = function(index, dateType) {
			$('#'+'datepickerSprint'+index+dateType).datepicker('show');
		}
		
		$scope.showDateCalendar = function (id) {
			$('#'+id).datepicker('show');
		}

		function confirmToMoveToDashbaord(dashboardURL) {
//			if(confirm('UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?')) {
//				window.location.href = dashboardURL;
//			}
			
		$('#myModal2').modal('show');

		}
		
		}


	
	]);

releasePlannerApp.controller( 'uploadFileController', [ '$scope',
	
	'ReleasePlannerService',
	'$timeout',
		function( $scope,
				ReleasePlannerService, $timeout) {
	/*
	 * provision(); function provision() { SprintService .getProvision() .then(
	 * function(d) { if (angular .isDefined(d.errorMessage) && !angular .equals(
	 * d.errorMessage, null)) { $("#ajax_load_div") .hide(); $scope.errorMessage =
	 * d.errorMessage; } $("#ajax_load_div").hide(); }, function(errResponse) {
	 * $scope.errorMessage = "Something went wrong. please contact support
	 * Team." $("#ajax_load_div").hide(); }); }
	 */
	$scope.uploadFile = function() {
	
	var filePath = angular.element('#productBacklogFile')[0].files;

	if (filePath.length == 0) {
		$('#p1').text("Please select a product backlog file.");
		$('#myModal').modal('show');
		//alert('Please select a product backlog file.');
	} else {
	
		var fd = new FormData();
		fd.append("file", filePath[0]);
		var file = fd;
	
		ReleasePlannerService
				.submitFormData(file)
				.then(
						function(d) {
							if (angular
									.isDefined(d.errorMessage)) {
								if (angular.equals(d.errorMessage, null)) {
									$('#p1').text("Error processing product backlog file.");
									$('#myModal').modal('show');
									//alert('Error processing product backlog file.');
								} else {
									$scope.errorMessage = d.errorMessage;
									$('#p1').text($scope.errorMessage);
									$('#myModal').modal('show');
								}
							} else {
								$(location)
								.attr(
										'href',
										'newRelease');
							}
							
						},
						function(errResponse) {
							$('#p1').text("Something went wrong. Please contact support team.");
							$('#myModal').modal('show');
						} );
	}
}
}
]);

releasePlannerApp
.controller(
		'ReleasePlannerViabilityController',
		[
				'$scope',
				'$timeout',
				'ReleasePlannerService',
				'ReleasePlannerFilterService',
				function($scope, $timeout, ReleasePlannerService, ReleasePlannerFilterService) {
					$scope.displayProductBacklog = true;

					onLoad();

					//$('#gaugeDemo .gauge-arrow').cmGauge();
					
					$("#confidenceSlider").on("slideStop", function(data) {
						angular.element('[ng-controller=ReleasePlannerViabilityController]').scope().updateConfidenceFilterValue(data);
						});
					
					
					function onLoad() {
						ReleasePlannerService
								.getProjectDetails()
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											} else {
												$scope.projectResponse = d;
												
												$scope.sprintMap = new Map();
												
												$scope.sprintDetails = [];
												
												$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
													if (sprint.sprintType == "Development Sprint") {
														$scope.sprintMap.set(sprint.sprintId, sprint);
													}
												});
												
												
												$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
													if (sprint.sprintType == "Development Sprint") {
														var sprintDetail = [];
														sprintDetail[0] = sprint.sprintId;
														sprintDetail[1] = sprint.sprintName;
														
														$scope.sprintDetails.push(sprintDetail);
													}
												});
												
												// Calculating story points for
												// each priority type for each
												// sprint.
												$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
													sprint.mustHave = 0;
													sprint.overAllScope = 0;
													
													if ((sprint.releasePlannerStories != undefined) && (sprint.releasePlannerStories != null)) {
														sprint.releasePlannerStories.forEach(function(story){
															switch(story.storyPriority) {
															case "Critical":
															case "High":
																sprint.mustHave = sprint.mustHave + parseInt(story.storyPoints);
																break;
															case "Medium":
															case "Low":
															case "Unassigned":
																sprint.overAllScope = sprint.overAllScope + parseInt(story.storyPoints);
																break;
															default:
																break;
															}
														});
													} 
													
													sprint.releasePlannerStories.forEach(function(story){
														if(story.viable==undefined){
															story.viable=true;
														}
														
												});
													
													var selectedStories=JSON.parse(sessionStorage.getItem("selectedStories"));
													sprint.mustHaveBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? (sprint.tentativeVelocity) : (sprint.mustHave))/ (sprint.plannedVelocity)) * 100;
													var mustHaveBarWidthPercent = sprint.mustHaveBarWidth + "%";
													sprint.mustHaveBarStyle = {
															"background-color" : "rgb(127,77,0)",
															"width" : mustHaveBarWidthPercent
													};
													
													sprint.overAllScopeBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? 0 : (((sprint.mustHave + sprint.overAllScope) > sprint.tentativeVelocity) ? (sprint.tentativeVelocity - sprint.mustHave) : sprint.overAllScope)) / (sprint.plannedVelocity)) * 100;
													var overAllScopeBarWidthPercent = sprint.overAllScopeBarWidth + "%";
													sprint.overAllScopeBarStyle = {
															"background-color" : "rgb(116,205,156)",
															"width" : overAllScopeBarWidthPercent
													};

													sprint.unusedStoryPointBarWidth = ((sprint.tentativeVelocity-sprint.mustHave-sprint.overAllScope)/ sprint.tentativeVelocity) * 100;
													var unusedStoryPointBarWidthPercent = sprint.unusedStoryPointBarWidth + "%";
													sprint.unusedStoryPointBarStyle = {
															"width" : unusedStoryPointBarWidthPercent
													};
													
													sprint.overRunMustHavePointBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? (sprint.mustHave - sprint.tentativeVelocity) : 0) /  sprint.plannedVelocity) * 100;
													var overRunMustHavePointBarWidthPercent = sprint.overRunMustHavePointBarWidth + "%";
													sprint.overRunMustHavePointBarStyle = {
															"width" : overRunMustHavePointBarWidthPercent,
													};
													
													sprint.overRunOverAllScopePointBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? sprint.overAllScope : ((sprint.mustHave + sprint.overAllScope) >= sprint.tentativeVelocity) ? (sprint.mustHave + sprint.overAllScope - sprint.tentativeVelocity) : 0 ) /  sprint.plannedVelocity) * 100;
													var overRunOverAllScopePointBarWidthPercent = sprint.overRunOverAllScopePointBarWidth + "%";
													sprint.overRunOverAllScopePointBarStyle = {
															"width" : overRunOverAllScopePointBarWidthPercent,
													};
													
													sprint.overRunPointBarWidth = ((sprint.plannedVelocity - sprint.tentativeVelocity) /  sprint.plannedVelocity) * 100;
													var overRunPointBarWidthPercent = sprint.overRunPointBarWidth + "%";
													sprint.overRunPointBarStyle = {
															"width" : overRunPointBarWidthPercent
													};


													
												});

												getProductBacklog();
																						
											}
										},
										function(errResponse) {
											$('#p1').text("Something went wrong. Please contact support team.");
											$('#myModal').modal('show');
										});
					}
					 
					
					function getReleaseBacklog() {
						ReleasePlannerService
						.getReleaseBacklog()
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
										) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										$scope.releaseBacklog = d;
										$scope.applyFilter();
										//updateView($scope.productBacklog, $scope.releaseBacklog, $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints);
									}
								},
								function(errResponse) {
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								});

					}
					
					function getProductBacklog() {
						ReleasePlannerService
					.getProductBacklog()
					.then(
							function(d) {
								if (angular
										.isDefined(d.errorMessage)
										) {
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								} else {
									$scope.productBacklog = d;
									
									getReleaseBacklog();

								}
							},
							function(errResponse) {
								$('#p1').text("Something went wrong. Please contact support team.");
								$('#myModal').modal('show');
							});
					}
			
					
					function updateView(pBacklog, rBacklog, sprints) {
						angular.element('#carousel-example-generic').carousel('pause');
						angular.element('#carousel-example-generic').removeData();

						$scope.storyDisplaySplit1 = [];
						$scope.storyDisplaySplit2 = [];
						var pageSprints = 3;
						
						if ($scope.displayProductBacklog) {
							var productBacklog = new Object();
							productBacklog.stories = pBacklog;
							productBacklog.overAllScope = 0;
							productBacklog.mustHaveScope = 0;
							
							productBacklog.stories.forEach(function(element){
								productBacklog.overAllScope = productBacklog.overAllScope + parseInt(element.storyPoints);
								
								if ((element.storyPriority == 'Critical') || (element.storyPriority == 'High')) {
									productBacklog.mustHaveScope = productBacklog.mustHaveScope + parseInt(element.storyPoints);
								}
							});
							
							$scope.storyDisplaySplit1.push(productBacklog);
							
							pageSprints = 2;
						}
						
						var releaseBacklog = new Object();
						releaseBacklog.stories = rBacklog;
						releaseBacklog.overAllScope = 0;
						releaseBacklog.mustHaveScope = 0;
						
						releaseBacklog.stories.forEach(function(element){
							releaseBacklog.overAllScope = releaseBacklog.overAllScope + parseInt(element.storyPoints);
							
							if ((element.storyPriority == 'Critical') || (element.storyPriority == 'High')) {
								releaseBacklog.mustHaveScope = releaseBacklog.mustHaveScope + parseInt(element.storyPoints);
							}
						});
						
						$scope.storyDisplaySplit1.push(releaseBacklog);

						sprints = sprints.filter(function(sprint){
							return (sprint.sprintType == "Development Sprint");
						});

						var counter;
						var remainingSprint = [];
						for (counter=0;counter<sprints.length; counter++) {
							if (counter!=pageSprints) {
								$scope.storyDisplaySplit2[counter] = sprints[counter];
							} else {
								remainingSprint = sprints.slice(pageSprints);
								break;
							}
						}
						
						var temp = [];
						$scope.storyDisplaySplit3 = [];
						remainingSprint.reverse();
						for (counter=0; remainingSprint.length != 0; counter++) {
							if (((counter%4) != 0) || (counter == 0)) {
								temp.push(remainingSprint.pop());
							} else {
								$scope.storyDisplaySplit3.push(temp);
								temp = [];
								counter=-1;
							}
						}
						
						if (temp.length != 0) {
							$scope.storyDisplaySplit3.push(temp);
						}

						angular.element('#newCarouselItem').attr('class', 'item margint-25');
						angular.element('#activeCarouselItem').attr('class', 'item active margint-25');
						angular.element('#carousel-example-generic').carousel({interval : false});
						
						$timeout(function(){}, 500);
						
					}
					
					$scope.hideShowProductBacklog = function() {
						$scope.displayProductBacklog = !$scope.displayProductBacklog;
						
						if ($scope.displayProductBacklog) {
							angular.element('#productbacklogdisplay').attr('src','resources/images/show_icon.png');
							
						} else {
							angular.element('#productbacklogdisplay').attr('src','resources/images/prod_backlog.png');
						}
						
						$scope.applyFilter();  
					}
					
					$scope.filters = new Map();
					var value = new Object();
					value.func = ReleasePlannerFilterService.filterConfidenceScore;
					value.parameters = [0,100];
					$scope.filters.set("ConfidenceScore", value);
					
					
					
					$scope.applyFilter = function() {

						// Adding or Removing the filters
						if ($scope.filters.get(arguments[0]) == undefined) {
							switch (arguments[0]) {
								case "DependentOn":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentOn;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "DependentBy":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentBy;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;

								case "Priority":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByPriority;
									value.parameters = new Map();
									value.parameters.set(arguments[1], 1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Viable":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByViable;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Not Viable":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByNotViable;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Neutral":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByNeutral;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
								
								default:
									break;
							}
						} else {	
							if (arguments[0] == "Priority") {
								if ($scope.filters.get("Priority").parameters.has(arguments[1])) {
									$scope.filters.get("Priority").parameters.delete(arguments[1]);
									
									if ($scope.filters.get("Priority").parameters.size == 0) {
										$scope.filters.delete(arguments[0]);
									}
								} else {
									$scope.filters.get("Priority").parameters.set(arguments[1], 1);
								}
							}
							
							else {
							    $scope.filters.delete(arguments[0]);
							}
						}
						
						// Applying filters
						var resultProductBacklog = $scope.productBacklog;
						
						$scope.filters.forEach(function(value, key, mapObj){
							resultProductBacklog = value.func(resultProductBacklog, value.parameters);
						});
						
						var resultReleaseBacklog = $scope.releaseBacklog;
						
						$scope.filters.forEach(function(value, key, mapObj){
							resultReleaseBacklog = value.func(resultReleaseBacklog, value.parameters);
						});

						var resultSprints =  [];
						
						var counter;
						for (counter=0; counter<$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.length; counter++) {
								var i;
								
								resultSprints[counter] = new Object();

								resultSprints[counter].endDate =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].endDate;
								resultSprints[counter].plannedVelocity =parseInt($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].plannedVelocity);
								resultSprints[counter].projectId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].projectId;
								resultSprints[counter].releaseId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releaseId;
								resultSprints[counter].scope = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].scope;
								resultSprints[counter].sprintId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintId;
								resultSprints[counter].sprintName = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintName;
								resultSprints[counter].sprintType = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintType;
								resultSprints[counter].startDate = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].startDate;
								resultSprints[counter].tentativeVelocity =parseInt($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].tentativeVelocity);
								resultSprints[counter].mustHave =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHave;
								resultSprints[counter].overAllScope =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScope;
								resultSprints[counter].confidence =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].confidence;
								resultSprints[counter].releasePlannerStories = [];
								
								resultSprints[counter].mustHaveBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHaveBarWidth;
								resultSprints[counter].mustHaveBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHaveBarStyle;
								
								resultSprints[counter].overAllScopeBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScopeBarWidth;
								resultSprints[counter].overAllScopeBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScopeBarStyle;
								
								resultSprints[counter].unusedStoryPointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].unusedStoryPointBarWidth;
								resultSprints[counter].unusedStoryPointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].unusedStoryPointBarStyle;
								
								resultSprints[counter].overRunMustHavePointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunMustHavePointBarWidth;
								resultSprints[counter].overRunMustHavePointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunMustHavePointBarStyle;
								
								resultSprints[counter].overRunOverAllScopePointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunOverAllScopePointBarWidth;
								resultSprints[counter].overRunOverAllScopePointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunOverAllScopePointBarStyle;

								if ($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories != null ){
									for (i=0; i<$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories.length; i++) {
										resultSprints[counter].releasePlannerStories.push($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories[i]);
									}
								} else {
									resultSprints[counter].releasePlannerStories = null;
								}
						}

						for (counter=0; counter<resultSprints.length; counter++) {
							if (!(resultSprints[counter].releasePlannerStories == null)) {
								$scope.filters.forEach(function(value, key, mapObj){
									resultSprints[counter].releasePlannerStories = value.func(resultSprints[counter].releasePlannerStories, value.parameters);
								});
							}
						}
						
						updateView(resultProductBacklog, resultReleaseBacklog, resultSprints);
					
					}
					
					$scope.ConfidenceFilter=function(story){
						if(story.viable){
						if(0<=story.confidence &&story.confidence<=49){
							return "gauge gauge-red pull-right margint10";
						}
						if(50<=story.confidence && story.confidence<=75){
							return "gauge gauge-amber pull-right margint10";
						}
						if(76<=story.confidence && story.confidence<=100){
							return "gauge gauge-green pull-right margint10";
						}
						}
						else{
							if(0<=(100-story.confidence) && (100-story.confidence)<=49){
								return "gauge gauge-red pull-right margint10";
							}
							if(50<=(100-story.confidence) && (100-story.confidence)<=75){
								return "gauge gauge-amber pull-right margint10";
							}
							if(76<=(100-story.confidence) && (100-story.confidence)<=100){
								return "gauge gauge-green pull-right margint10";
							}
						}
					}
					
					$scope.publish = function() {
							ReleasePlannerService
							.publishReleasePlan($scope.projectResponse.releasePlannerReleases[0].releaseId)
							.then(
									function(d) {
										if (angular
												.isDefined(d.errorMessage)
												) {
											$('#p1').text("Something went wrong. Please contact support team.");
											$('#myModal').modal('show');
										} else {
											sessionStorage.removeItem("selectedStories");
											$(location) .attr( 'href', 'pubishSprintDetailsPage');
										}
									},
									function(errResponse) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									});

					};
					
					$scope.updateConfidenceFilterValue  = function(data) {
						$scope.filters.delete('ConfidenceScore');
						
						var value = new Object();
						value.func = ReleasePlannerFilterService.filterConfidenceScore;
						value.parameters = [data.value[0],data.value[1]];
						$scope.filters.set("ConfidenceScore", value);
						
						$scope.applyFilter();
					};
					
					$scope.moveStory = function(storyId, fromId, fromName, toId, toName, storyPoints, storyPriority, confidence, viable) {
						$scope.confirmationRequired=false;
						var moveStoryRequest = new Object();
						
						moveStoryRequest.storyId = storyId;
						moveStoryRequest.fromId = fromId;
						moveStoryRequest.fromName = fromName;
						moveStoryRequest.toId = toId;
						moveStoryRequest.toName = toName;
						moveStoryRequest.storyPoints = storyPoints;
						moveStoryRequest.storyPriority = storyPriority;
						moveStoryRequest.confidence = confidence;
						moveStoryRequest.viable = viable
						
						$('#awaiting_response').show();
						ReleasePlannerService
						.moveStory(moveStoryRequest)
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#awaiting_response').hide();
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										// TO DO for success handling.
										$scope.storyMoveResponse = d.data;
										
										console.log($scope.storyMoveResponse);
										if ($scope.storyMoveResponse.status == "Move Not Possible") {
											$('#awaiting_response').hide();
											$('#p1').text($scope.storyMoveResponse.message);
											$('#myModal').modal('show');
										} else if ($scope.storyMoveResponse.status == "Moved") {
											onLoad();
											$('#awaiting_response').hide();
										} else if ($scope.storyMoveResponse.status == "Confirmation Required") {
											$scope.confirmationRequired=true;
											$scope.storyMoveResponse.sprintChanges.forEach(function(sprintChange) {
												
												sprintChange.before.mustHaveStyle = {
														'width': sprintChange.before.mustHaveBarWidth+'%',
														'background-color' : 'rgb(127,77,0)'	
												};
												
												sprintChange.before.overAllScopeStyle = {
													'width': sprintChange.before.overAllScopeBarWidth+'%',
													'background-color' : 'rgb(116,205,156)'
												};
												
												sprintChange.before.overRunMustHaveStyle = {
														'width': sprintChange.before.overRunMustHaveBarWidth+'%',
												};

												sprintChange.before.overRunOverAllScopeStyle = {
														'width': sprintChange.before.overRunOverAllScopeBarWidth+'%',
												};
												
												sprintChange.after.mustHaveStyle = {
														'width': sprintChange.after.mustHaveBarWidth+'%',
														'background-color' : 'rgb(127,77,0)'	
												};
												
												sprintChange.after.overAllScopeStyle = {
													'width': sprintChange.after.overAllScopeBarWidth+'%',
													'background-color' : 'rgb(116,205,156)'
												};
												
												sprintChange.after.overRunMustHaveStyle = {
														'width': sprintChange.after.overRunMustHaveBarWidth+'%',
												};

												sprintChange.after.overRunOverAllScopeStyle = {
														'width': sprintChange.after.overRunOverAllScopeBarWidth+'%',
												};

											});
											
											$('#awaiting_response').hide();
											$('#myModal3').modal('show');
										}
									}
								},
								function(errResponse) {
									$('#awaiting_response').hide();
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								});

					}
					
					$scope.moveConfirmed = function () {
						$('#myModal3').modal('hide');
						
						$('#awaiting_response').show();
						ReleasePlannerService
						.moveConfirmed($scope.storyMoveResponse)
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#awaiting_response').hide();
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										$scope.storyMoveResponse = d.data;
										
										console.log($scope.storyMoveResponse);
										if ($scope.storyMoveResponse.status == "Moved") {
											onLoad();
											$('#awaiting_response').hide();
										} else {
											$('#awaiting_response').hide();
										}
									}
								},
								function(errResponse) {
									$('#awaiting_response').hide();
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								});
					};
					
					$scope.deleteSprint = function(sprintId, sprintName) {
						$('#awaiting_response').show();
						ReleasePlannerService
						.deleteSprint(sprintId, sprintName)
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#awaiting_response').hide();
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										onLoad();
										$('#awaiting_response').hide();
										
										if ($scope.projectResponse.releasePlannerReleases[0].autoEndDate) {
											$('#p1').text("Release end date has changed.");
											$('#myModal').modal('show');
										}
									}
								},
								function(errResponse) {
									$('#awaiting_response').hide();
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
								});
					}
				}]);

releasePlannerApp
.controller(
		'ReleasePlannerViewPastAnalysisController',
		[
				'$scope',
				'$timeout',
				'ReleasePlannerService',
				function($scope, $timeout, ReleasePlannerService) {
					onLoad();
					
					function onLoad() {
						ReleasePlannerService
								.getProjectReleases()
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
												
											} else {
												$scope.releasePlannerReleases = d;
											}
										},
										function(errResponse) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
										});
					}

				}
				]);

releasePlannerApp
.controller(
		'ReleasePlannerViewPastAnalysisDetailedController',
		[
				'$scope',
				'$timeout',
				'$location',
				'ReleasePlannerService',
				'ReleasePlannerFilterService',
				function($scope, $timeout, $location, ReleasePlannerService, ReleasePlannerFilterService) {
					$scope.displayProductBacklog = true;

					$scope.releaseId = window.location.search.substring(11);
					onLoad();
					 //$('#gaugeDemo .gauge-arrow').cmGauge();
					 $("#confidenceSlider").on("slideStop", function(data) {
							angular.element('[ng-controller=ReleasePlannerViewPastAnalysisDetailedController]').scope().updateConfidenceFilterValue(data);
							});
						
					function onLoad() {
						ReleasePlannerService
								.getProjectDetailsForPastAnalysis($scope.releaseId)
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											} else {
												$scope.projectResponse = d;
												// setting velocity trend to zero if it is null
												if($scope.projectResponse.releasePlannerReleases[0].velocityTrend=='')
											{
													$scope.projectResponse.releasePlannerReleases[0].velocityTrend='0';	
											}
												// Calculating story points for
												// each priority type for each
												// sprint.
												$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.forEach(function(sprint){
												sprint.mustHave = 0;
													sprint.overAllScope = 0;
													
													if ((sprint.releasePlannerStories != undefined) && (sprint.releasePlannerStories != null)) {
														sprint.releasePlannerStories.forEach(function(story){
															switch(story.storyPriority) {
															case "Critical":
															case "High":
																sprint.mustHave = sprint.mustHave + parseInt(story.storyPoints);
																break;
															case "Medium":
															case "Low":
															case "Unassigned":
																sprint.overAllScope = sprint.overAllScope + parseInt(story.storyPoints);
																break;
															default:
																break;
															}
														});
													} 
													
													sprint.releasePlannerStories.forEach(function(story){
														if(story.viable==undefined){
															story.viable=true;
														}
														
													});
													sprint.mustHaveBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? (sprint.tentativeVelocity) : (sprint.mustHave))/ (sprint.plannedVelocity)) * 100;
													var mustHaveBarWidthPercent = sprint.mustHaveBarWidth + "%";
													sprint.mustHaveBarStyle = {
															"background-color" : "rgb(127,77,0)",
															"width" : mustHaveBarWidthPercent
													};
													
													sprint.overAllScopeBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? 0 : (((sprint.mustHave + sprint.overAllScope) > sprint.tentativeVelocity) ? (sprint.tentativeVelocity - sprint.mustHave) : sprint.overAllScope)) / (sprint.plannedVelocity)) * 100;
													var overAllScopeBarWidthPercent = sprint.overAllScopeBarWidth + "%";
													sprint.overAllScopeBarStyle = {
															"background-color" : "rgb(116,205,156)",
															"width" : overAllScopeBarWidthPercent
													};

													sprint.unusedStoryPointBarWidth = ((sprint.tentativeVelocity-sprint.mustHave-sprint.overAllScope)/ sprint.tentativeVelocity) * 100;
													var unusedStoryPointBarWidthPercent = sprint.unusedStoryPointBarWidth + "%";
													sprint.unusedStoryPointBarStyle = {
															"width" : unusedStoryPointBarWidthPercent
													};
													
													sprint.overRunMustHavePointBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? (sprint.mustHave - sprint.tentativeVelocity) : 0) /  sprint.plannedVelocity) * 100;
													var overRunMustHavePointBarWidthPercent = sprint.overRunMustHavePointBarWidth + "%";
													sprint.overRunMustHavePointBarStyle = {
															"width" : overRunMustHavePointBarWidthPercent,
													};
													
													sprint.overRunOverAllScopePointBarWidth = (((sprint.mustHave >= sprint.tentativeVelocity) ? sprint.overAllScope : ((sprint.mustHave + sprint.overAllScope) >= sprint.tentativeVelocity) ? (sprint.mustHave + sprint.overAllScope - sprint.tentativeVelocity) : 0 ) /  sprint.plannedVelocity) * 100;
													var overRunOverAllScopePointBarWidthPercent = sprint.overRunOverAllScopePointBarWidth + "%";
													sprint.overRunOverAllScopePointBarStyle = {
															"width" : overRunOverAllScopePointBarWidthPercent,
													};
													
													sprint.overRunPointBarWidth = ((sprint.plannedVelocity - sprint.tentativeVelocity) /  sprint.plannedVelocity) * 100;
													var overRunPointBarWidthPercent = sprint.overRunPointBarWidth + "%";
													sprint.overRunPointBarStyle = {
															"width" : overRunPointBarWidthPercent
													};
													
												});

												getProductBacklog();
												
											}
										},
										function(errResponse) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
										});
					}
					
					function getReleaseBacklog() {
						ReleasePlannerService
						.getReleaseBacklogForPastAnalysis($scope.releaseId)
						.then(
								function(d) {
									if (angular
											.isDefined(d.errorMessage)
											) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
									} else {
										$scope.releaseBacklog = d;
										
//										new JustGage(
//												{
//													id : "g5",
//													// value: getRandomInt(0,
//													// 100),
//													value : $scope.projectResponse.releasePlannerReleases[0].confidence,
//													min : 0,
//													max : 100,
//													title : "Release",
//												// label: "oz"
//												});
										
										updateView($scope.productBacklog, $scope.releaseBacklog, $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints);
										
									}
								},
								function(errResponse) {
										$('#p1').text("Something went wrong. Please contact support team.");
										$('#myModal').modal('show');
								});

					}
					
					function getProductBacklog() {
						ReleasePlannerService
					.getProductBacklogForPastAnalysis($scope.releaseId)
					.then(
							function(d) {
								if (angular
										.isDefined(d.errorMessage)
										) {
									console.log(d);
								} else {
									$scope.productBacklog = d;
									
									getReleaseBacklog();

								}
							},
							function(errResponse) {
									$('#p1').text("Something went wrong. Please contact support team.");
									$('#myModal').modal('show');
							});
					}
					
			
					function updateView(pBacklog, rBacklog, sprints) {
						angular.element('#carousel-example-generic').carousel('pause');
						angular.element('#carousel-example-generic').removeData();

						$scope.storyDisplaySplit1 = [];
						$scope.storyDisplaySplit2 = [];
						var pageSprints = 3;
						
						if ($scope.displayProductBacklog) {
							var productBacklog = new Object();
							productBacklog.stories = pBacklog;
							productBacklog.overAllScope = 0;
							productBacklog.mustHaveScope = 0;
							
							productBacklog.stories.forEach(function(element){
								productBacklog.overAllScope = productBacklog.overAllScope + parseInt(element.storyPoints);
								
								if ((element.storyPriority == 'Critical') || (element.storyPriority == 'High')) {
									productBacklog.mustHaveScope = productBacklog.mustHaveScope + parseInt(element.storyPoints);
								}
							});
							
							$scope.storyDisplaySplit1.push(productBacklog);
							
							pageSprints = 2;
						}
						
						var releaseBacklog = new Object();
						releaseBacklog.stories = rBacklog;
						releaseBacklog.overAllScope = 0;
						releaseBacklog.mustHaveScope = 0;
						
						releaseBacklog.stories.forEach(function(element){
							releaseBacklog.overAllScope = releaseBacklog.overAllScope + parseInt(element.storyPoints);
							
							if ((element.storyPriority == 'Critical') || (element.storyPriority == 'High')) {
								releaseBacklog.mustHaveScope = releaseBacklog.mustHaveScope + parseInt(element.storyPoints);
							}
						});
						
// sprints.forEach(function(sprint){
// if ((sprint.releasePlannerStories != undefined) &&
// (sprint.releasePlannerStories != null)) {
// sprint.releasePlannerStories.forEach(function(element){
// releaseBacklog.overAllScope = releaseBacklog.overAllScope +
// parseInt(element.storyPoints);
//									
// if ((element.storyPriority == 'Critical') || (element.storyPriority ==
// 'High')) {
// releaseBacklog.mustHaveScope = releaseBacklog.mustHaveScope +
// parseInt(element.storyPoints);
// }
// });
// }
// });
						
						

						$scope.storyDisplaySplit1.push(releaseBacklog);

						sprints = sprints.filter(function(sprint){
							return (sprint.sprintType == "Development Sprint");
						});
						
						var counter;
						var remainingSprint = [];
						for (counter=0;counter<sprints.length; counter++) {
							if (counter!=pageSprints) {
								$scope.storyDisplaySplit2[counter] = sprints[counter];
							} else {
								remainingSprint = sprints.slice(pageSprints);
								break;
							}
						}
						
						var temp = [];
						$scope.storyDisplaySplit3 = [];
						remainingSprint.reverse();
						for (counter=0; remainingSprint.length != 0; counter++) {
							if (((counter%4) != 0) || (counter == 0)) {
								temp.push(remainingSprint.pop());
							} else {
								$scope.storyDisplaySplit3.push(temp);
								temp = [];
								counter=0;
							}
						}
						
						if (temp.length != 0) {
							$scope.storyDisplaySplit3.push(temp);
						}


						angular.element('#newCarouselItem').attr('class', 'item margint-25');
						angular.element('#activeCarouselItem').attr('class', 'item active margint-25');
						angular.element('#carousel-example-generic').carousel({interval: false});
						
						$timeout(function(){}, 500);
						
					}
					
					
					
					$scope.hideShowProductBacklog = function() {
						$scope.displayProductBacklog = !$scope.displayProductBacklog;
						
						if ($scope.displayProductBacklog) {
							angular.element('#productbacklogdisplay').attr('src','resources/images/show_icon.png');
							
						} else {
							angular.element('#productbacklogdisplay').attr('src','resources/images/prod_backlog.png');
						}
						
						$scope.applyFilter();  
					}
					
					
					$scope.filters = new Map();
					
					$scope.applyFilter = function() {

						// Adding or Removing the filters
						if ($scope.filters.get(arguments[0]) == undefined) {
							switch (arguments[0]) {
								case "DependentOn":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentOn;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "DependentBy":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByDependentBy;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;

								case "Priority":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByPriority;
									value.parameters = new Map();
									value.parameters.set(arguments[1], 1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Viable":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByViable;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Not Viable":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByNotViable;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
								case "Neutral":
									var value = new Object();
									value.func = ReleasePlannerFilterService.filterByNeutral;
									value.parameters = ""; //Array.from(arguments).slice(1);
									$scope.filters.set(arguments[0], value);
									break;
									
									
								default:
									break;
							}
						} else {
							if (arguments[0] == "Priority") {
								if ($scope.filters.get("Priority").parameters.has(arguments[1])) {
									$scope.filters.get("Priority").parameters.delete(arguments[1]);
									
									if ($scope.filters.get("Priority").parameters.size == 0) {
										$scope.filters.delete(arguments[0]);
									}
								} else {
									$scope.filters.get("Priority").parameters.set(arguments[1], 1);
								}
							} else {
							    $scope.filters.delete(arguments[0]);
							}
						}
						
						// Applying filters
						
						var resultProductBacklog = $scope.productBacklog;
						
						$scope.filters.forEach(function(value, key, mapObj){
							resultProductBacklog = value.func(resultProductBacklog, value.parameters);
						});
						
						var resultReleaseBacklog = $scope.releaseBacklog;
						
						$scope.filters.forEach(function(value, key, mapObj){
							resultReleaseBacklog = value.func(resultReleaseBacklog, value.parameters);
						});

						var resultSprints =  [];
						
						var counter;
						for (counter=0; counter<$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints.length; counter++) {
								var i;
								
								resultSprints[counter] = new Object();

								resultSprints[counter].endDate =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].endDate;
								resultSprints[counter].plannedVelocity =parseInt($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].plannedVelocity);
								resultSprints[counter].projectId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].projectId;
								resultSprints[counter].releaseId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releaseId;
								resultSprints[counter].scope = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].scope;
								resultSprints[counter].sprintId = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintId;
								resultSprints[counter].sprintName = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintName;
								resultSprints[counter].sprintType = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].sprintType;
								resultSprints[counter].startDate = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].startDate;
								resultSprints[counter].tentativeVelocity =parseInt($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].tentativeVelocity);
								resultSprints[counter].mustHave =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHave;
								resultSprints[counter].overAllScope =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScope;
								resultSprints[counter].confidence =$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].confidence;
								resultSprints[counter].releasePlannerStories = [];

								resultSprints[counter].mustHaveBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHaveBarWidth;
								resultSprints[counter].mustHaveBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].mustHaveBarStyle;
								
								resultSprints[counter].overAllScopeBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScopeBarWidth;
								resultSprints[counter].overAllScopeBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overAllScopeBarStyle;
								
								resultSprints[counter].unusedStoryPointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].unusedStoryPointBarWidth;
								resultSprints[counter].unusedStoryPointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].unusedStoryPointBarStyle;
								
								resultSprints[counter].overRunMustHavePointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunMustHavePointBarWidth;
								resultSprints[counter].overRunMustHavePointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunMustHavePointBarStyle;
								
								resultSprints[counter].overRunOverAllScopePointBarWidth = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunOverAllScopePointBarWidth;
								resultSprints[counter].overRunOverAllScopePointBarStyle = $scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].overRunOverAllScopePointBarStyle;

								if ($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories != null ){
									for (i=0; i<$scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories.length; i++) {
										resultSprints[counter].releasePlannerStories.push($scope.projectResponse.releasePlannerReleases[0].releasePlannerSprints[counter].releasePlannerStories[i]);
									}
								} else {
									resultSprints[counter].releasePlannerStories = null;
								}
						}

						for (counter=0; counter<resultSprints.length; counter++) {
							if (!(resultSprints[counter].releasePlannerStories == null)) {
								$scope.filters.forEach(function(value, key, mapObj){
									resultSprints[counter].releasePlannerStories = value.func(resultSprints[counter].releasePlannerStories, value.parameters);
								});
							}
						}
						
						updateView(resultProductBacklog, resultReleaseBacklog, resultSprints);
					
					}
					
					$scope.downloadPastPublishedPlan = function() {
						ReleasePlannerService.downloadPastPublishedPlan($scope.releaseId);
					};
					
		
			
					$scope.updateConfidenceFilterValue = function(data) {
						$scope.filters.delete('ConfidenceScore');
						
						var value = new Object();
						value.func = ReleasePlannerFilterService.filterConfidenceScore;
						value.parameters = [data.value[0],data.value[1]];
						$scope.filters.set("ConfidenceScore", value);
						
						$scope.applyFilter();
					};
					
					$scope.ConfidenceFilterParameter=function(story){
						if(story.viable){
						if(0<=story.confidence &&story.confidence<=49){
							return "gauge gauge-red pull-right margint10";
						}
						if(50<=story.confidence && story.confidence<=75){
							return "gauge gauge-amber pull-right margint10";
						}
						if(76<=story.confidence && story.confidence<=100){
							return "gauge gauge-green pull-right margint10";
						}
						}
						if(!story.viable){
							if(0<=(100-story.confidence) && (100-story.confidence)<=49){
								return "gauge gauge-red pull-right margint10";
							}
							if(50<=(100-story.confidence) && (100-story.confidence)<=75){
								return "gauge gauge-amber pull-right margint10";
							}
							if(76<=(100-story.confidence) && (100-story.confidence)<=100){
								return "gauge gauge-green pull-right margint10";
							}
						}
					}
				
				}]);

releasePlannerApp
.controller(
		'ReleasePlannerWSJFScreenController',
		[
				'$scope',
				'$timeout',
				'$location',
				'ReleasePlannerService',
				'ReleasePlannerFilterService',
				function($scope, $timeout, $location, ReleasePlannerService, ReleasePlannerFilterService) {
					onLoad();
					var stories =[];
					var productStories=[];
					$scope.productBacklog;
					$scope.stories;
					$scope.priorStories;
					var priorStories=[];
				
				
				
					$scope.sliderChanged = function(storyId){
						
						$('#demo'+storyId).html($('#myRange'+storyId).val());
						$scope.changesSavedMessage=false;
						stories.forEach(function(story){
							//business value is empty
							if((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0)){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement is empty
							if((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))
							{
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							
							// storypoints is empty
							if((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0')){
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//business value and riskReductionOpportunityEnablement is empty
							if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0))&&((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//business value and story points is empty 
							if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0'))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement and story points is empty
						
							if(((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0'))){
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement, business value and storypoints is empty
							
							if(((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0')
									&&((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0)))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							
							if(((story.businessValue!=null)&&(story.businessValue!="")&&(story.businessValue!=undefined)&&(isInt(story.businessValue))&&(!(story.businessValue<0)))&&((story.riskReductionOpportunityEnablement!=null)&&(story.riskReductionOpportunityEnablement!="")&&(story.riskReductionOpportunityEnablement!=undefined)&&(isInt(story.riskReductionOpportunityEnablement))&&(!(story.riskReductionOpportunityEnablement<0))
									&&((story.storyPoints!=null)&&(story.storyPoints!="")&&(story.storyPoints!=undefined)&&(isInt(story.storyPoints))&&(!(story.storyPoints<0))&&(story.storyPoints!='0')))){
								story.wsjf= ((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
						});

					}
					
					
					function onLoad() {
						ReleasePlannerService
								.getProjectDetails()
								.then(
										function(d) {
											if (angular
													.isDefined(d.errorMessage)
													) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											}else {
												$scope.projectResponse = d; 
												getProductBacklog();
												
												function getProductBacklog() {
													ReleasePlannerService
												.getProductBacklog()
												.then(
														function(d) {
															if (angular
																	.isDefined(d.errorMessage)
																	) {
																$('#p1').text("Something went wrong. Please contact support team.");
																$('#myModal').modal('show');
															} else {
																$scope.productBacklog = d;
																productStories = $scope.productBacklog;
																angular.copy(productStories, stories);
																
																var selectStories=JSON.parse(sessionStorage.getItem("selectedStories"));
																
																stories.forEach(function(story){
																		story.isSelected=false;
																	});
																
																if(!(selectStories==undefined)&& !(selectStories==null)&& !(selectStories.length==0))
																{
																	stories.forEach(function(story){
																		selectStories.forEach(function(selectStory){
																			if(story.storyId==selectStory.storyId){
																				story.isSelected=true;
																			}
																		});
																	});
																}
																
																$scope.stories=stories;
																angular.copy(stories,priorStories);
																$scope.priorStories=priorStories;
																for(var i=0;i<stories.length;i++){
																	
//																	stories[i].decomposedUserStory="Yes";
																	
																	if(stories[i].storyPriority=="Critical"){
																		stories[i].storyPriority="5";
																	}
																	if(stories[i].storyPriority=="High"){
																		stories[i].storyPriority="4";
																	}
																	if(stories[i].storyPriority=="Medium"){
																		stories[i].storyPriority="3";
																	}
																	if(stories[i].storyPriority=="Low"){
																		stories[i].storyPriority="2";
																	}
																	if(stories[i].storyPriority=="Unassigned"){
																		stories[i].storyPriority="1";
																	}
																	
																};
														
																
																//calculating wsjf
																
																stories.forEach(function(story){
																	if((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0)){
																		story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	if((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))
																	{
																		story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0))&&((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))){
																		story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	if(((story.businessValue!=null)&&(story.businessValue!="")&&(story.businessValue!=undefined)&&(isInt(story.businessValue))&&(!(story.businessValue<0)))&&((story.riskReductionOpportunityEnablement!=null)&&(story.riskReductionOpportunityEnablement!="")&&(story.riskReductionOpportunityEnablement!=undefined)&&(isInt(story.riskReductionOpportunityEnablement))&&(!(story.riskReductionOpportunityEnablement<0)))){
																		story.wsjf= ((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																});
															
																var storiesorted=[];
																for(var i=0;i<stories.length;i++){
																	if(stories[i].isSelected){
																		storiesorted.push(stories[i]);
																	}
																}
																
																for(var i=0;i<stories.length;i++){
																	if(!stories[i].isSelected){
																		storiesorted.push(stories[i]);
																	}
																}
															
																angular.copy(storiesorted,stories);
																
															//	getSelectedBacklog();
																
															}
														},
														function(errResponse) {
															$('#p1').text("Something went wrong. Please contact support team.");
															$('#myModal').modal('show');
														});
												}
												
												function getSelectedBacklog() {
													ReleasePlannerService
												.getSelectedBacklog()
												.then(
														function(d) {
															if (angular
																	.isDefined(d.errorMessage)
																	) {
																$('#p1').text("Something went wrong. Please contact support team.");
																$('#myModal').modal('show');
															} else {
																$scope.selectedBacklog = d;	
																selectedStories=$scope.selectedBacklog;
																stories.push.apply(stories, selectedStories);
																
																$scope.stories=stories;
//																angular.copy(stories,priorStories);
																
																for(var i=0;i<stories.length;i++){
																	
//																	stories[i].decomposedUserStory="Yes";
																	
																	if(stories[i].storyPriority=="Critical"){
																		priorStories[i].storyPriority="5";
																	}
																	if(stories[i].storyPriority=="High"){
																		priorStories[i].storyPriority="4";
																	}
																	if(stories[i].storyPriority=="Medium"){
																		priorStories[i].storyPriority="3";
																	}
																	if(stories[i].storyPriority=="Low"){
																		priorStories[i].storyPriority="2";
																	}
																	if(stories[i].storyPriority=="Unassigned"){
																		priorStories[i].storyPriority="1";
																	}
																	
																};
															
																//calculating wsjf
																
																stories.forEach(function(story){
																	if(story.businessValue==null){
																		story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	if(story.riskReductionOpportunityEnablement==null)
																	{
																		story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	if((story.businessValue==null)&&(story.riskReductionOpportunityEnablement==null)){
																		story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																	else{
																		story.wsjf= ((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
																		story.wsjf=story.wsjf.toFixed(2);
																	}
																});
																
													
//																for(var i=0;i<stories.length;i++){
////																	if((stories[i].businessValue==undefined)||(stories[i].businessValue=="")||(stories[i].businessValue==null)){
////																		stories[i].businessValue='1';
////																	}
////																	if((stories[i].riskReductionOpportunityEnablement==undefined)||(stories[i].riskReductionOpportunityEnablement=="")||(stories[i].riskReductionOpportunityEnablement==null)){
////																		stories[i].riskReductionOpportunityEnablement='1';
////																	}
//																	
//																	stories[i].wsjf= ((parseInt(stories[i].businessValue) + parseInt(priorStories[i].storyPriority) + parseInt(stories[i].riskReductionOpportunityEnablement))/parseInt(stories[i].storyPoints));
//																	stories[i].wsjf=stories[i].wsjf.toFixed(2);
//																}
															
															}
																
														},
														function(errResponse) {
															$('#p1').text("Something went wrong. Please contact support team.");
															$('#myModal').modal('show');
														});
												}	
											}
											},
											function(errResponse) {
												$('#p1').text("Something went wrong. Please contact support team.");
												$('#myModal').modal('show');
											});
						}
					
						
					//sorting business value 
					$(document).on("click","#sort_businessValue", function(){
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="asc"){
							$scope.orderType="asc";
						}
						if($scope.orderType=="asc"){
						stories.sort(function(a, b){return a.businessValue - b.businessValue});
						$scope.orderType="dsc";
						}
						else{
						stories.sort(function(a, b){return b.businessValue - a.businessValue});
						$scope.orderType="asc";
						}
						$scope.$apply();
					});
					
					
					//sorting wsjf vaulue
					$(document).on("click","#sort_wsjf", function(){
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="asc"){
							$scope.orderType="asc";
						}
						if($scope.orderType=="asc"){
						stories.sort(function(a, b){return a.wsjf - b.wsjf});
						$scope.orderType="dsc";
						}
						else{
						stories.sort(function(a, b){return b.wsjf - a.wsjf});
						$scope.orderType="asc";
						}
						$scope.$apply();
					});
					
					
					//sorting storyId
					$(document).on("click","#sort_storyID", function(){
						var sortedTitle=[];
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="desc"){
							$scope.orderType="desc";
						}
						if($scope.orderType=="desc"){
						for(var i=0;i<stories.length;i++){
							if(!stories[i].isSelected){
								sortedTitle.push(stories[i]);
							}
						}
						
						for(var i=0;i<stories.length;i++){
							if(stories[i].isSelected){
								sortedTitle.push(stories[i]);
							}
						}
					
						angular.copy(sortedTitle, stories);
						$scope.orderType="asc";
						}else{
							for(var i=0;i<stories.length;i++){
								if(stories[i].isSelected){
									sortedTitle.push(stories[i]);
								}
							}
							
							for(var i=0;i<stories.length;i++){
								if(!stories[i].isSelected){
									sortedTitle.push(stories[i]);
								}
							}
						
							angular.copy(sortedTitle, stories);
							$scope.orderType="desc";
						}
						
						$scope.$apply();
					});
					
					//sorting risk reduction
					$(document).on("click","#sort_risk", function(){
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="asc"){
							$scope.orderType="asc";
						}
						if($scope.orderType=="asc"){
						stories.sort(function(a, b){return a.riskReductionOpportunityEnablement - b.riskReductionOpportunityEnablement});
						$scope.orderType="dsc";
						}else{
						stories.sort(function(a, b){return b.riskReductionOpportunityEnablement - a.riskReductionOpportunityEnablement});
						$scope.orderType="asc";
						}
						
						$scope.$apply();
					});
					
					//sorting highLevelSizing
					$(document).on("click","#sort_sizing", function(){
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="asc"){
							$scope.orderType="asc";
						}
						if($scope.orderType=="asc"){
						stories.sort(function(a, b){return a.storyPoints - b.storyPoints});
						$scope.orderType="dsc";
						}else{
						stories.sort(function(a, b){return b.storyPoints - a.storyPoints});
						$scope.orderType="asc";	
						}
						$scope.$apply();
					});
					
					//sorting story title
					$(document).on("click","#sort_title", function(){
						var sortedTitle=[];
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="desc"){
							$scope.orderType="desc";
						}
						if($scope.orderType=="desc"){
						for(var i=0;i<stories.length;i++){
							if(!stories[i].isSelected){
								sortedTitle.push(stories[i]);
							}
						}
						
						for(var i=0;i<stories.length;i++){
							if(stories[i].isSelected){
								sortedTitle.push(stories[i]);
							}
						}
						angular.copy(sortedTitle, stories);
						$scope.orderType="asc";
						}else{
							for(var i=0;i<stories.length;i++){
								if(stories[i].isSelected){
									sortedTitle.push(stories[i]);
								}
							}
							
							for(var i=0;i<stories.length;i++){
								if(!stories[i].isSelected){
									sortedTitle.push(stories[i]);
								}
							}
							angular.copy(sortedTitle, stories);
							$scope.orderType="desc";
						}
						
						$scope.$apply();
						
					});
					
					//sorting time criticality
					
					$(document).on("click","#sort_time", function(){
						var sortedTime=[];
						$scope.orderType;
						if($scope.orderType=="" || $scope.orderType==undefined || $scope.orderType=="asc"){
							$scope.orderType="asc";
						}
						if($scope.orderType=="asc"){
						for(var i=0;i<stories.length;i++){
							if(stories[i].storyPriority=="5"){
								sortedTime.push(stories[i]);
							}
						}
						for(var i=0;i<stories.length;i++){
							if(stories[i].storyPriority=="4"){
								sortedTime.push(stories[i]);
							}
						}
						for(var i=0;i<stories.length;i++){
							if(stories[i].storyPriority=="3"){
								sortedTime.push(stories[i]);
							}
						}
						for(var i=0;i<stories.length;i++){
							if(stories[i].storyPriority=="2"){
								sortedTime.push(stories[i]);
							}
						}
						for(var i=0;i<stories.length;i++){
							if(stories[i].storyPriority=="1"){
								sortedTime.push(stories[i]);
							}
						}
						angular.copy(sortedTime, stories);
						$scope.orderType="dsc";
						}else{
							
							for(var i=0;i<stories.length;i++){
								if(stories[i].storyPriority=="1"){
									sortedTime.push(stories[i]);
								}
							}
							for(var i=0;i<stories.length;i++){
								if(stories[i].storyPriority=="2"){
									sortedTime.push(stories[i]);
								}
							}
							for(var i=0;i<stories.length;i++){
								if(stories[i].storyPriority=="3"){
									sortedTime.push(stories[i]);
								}
							}
							for(var i=0;i<stories.length;i++){
								if(stories[i].storyPriority=="4"){
									sortedTime.push(stories[i]);
								}
							}
							for(var i=0;i<stories.length;i++){
								if(stories[i].storyPriority=="5"){
									sortedTime.push(stories[i]);
								}
							}
							angular.copy(sortedTime, stories);
							$scope.orderType="asc";
								
						}
						$scope.$apply();
					});
					
					
					$scope.cancelChanges = function(){
						$('#awaiting_response').show();
						onLoad();
						$('#awaiting_response').hide();
					};
					
					 $scope.changesSavedMessage=false;
						console.log(stories);
					$scope.saveWSJFData = function(){
						if(validateForm()){
							angular.copy(stories,priorStories);
						
							$('#awaiting_response').show();
							
							for(var i=0;i<stories.length;i++){
								
//								stories[i].decomposedUserStory="Yes";
								
								if(stories[i].storyPriority=="5"){
									priorStories[i].storyPriority="Critical";
								}
								if(stories[i].storyPriority=="4"){
									priorStories[i].storyPriority="High";
								}
								if(stories[i].storyPriority=="3"){
									priorStories[i].storyPriority="Medium";
								}
								if(stories[i].storyPriority=="2"){
									priorStories[i].storyPriority="Low";
								}
								if(stories[i].storyPriority=="1"){
									priorStories[i].storyPriority="Unassigned";
								}
								
							};

						
						ReleasePlannerService.saveWSJFData($scope.priorStories).then(
								 function(d) {
									  if (angular 
											  .isDefined(d.errorMessage)
											 ) { 
										  $('#awaiting_response').hide();
										  $scope.errorMessage = d.errorMessage; 
										  $('#p1').text("Something went wrong. Please contact support team.");
											 $('#myModal').modal('show');
									  } else {
										  
										  $scope.productBacklog =d;

										  $scope.changesSavedMessage=true;
										  $('#awaiting_response').hide();
										  
					}
									  
					});
					}
					};
					
					//search functionality
					
					 $scope.search = function(){
						    $scope.criteria = angular.copy($scope.criteria1);
						  }
					 
					//cancel button
					 $scope.navigateToBacklogScreen = function() {
								$(location) .attr( 'href', 'backlogScreen');
						};
						
					//on change 
					$scope.changed = function () {
						$scope.changesSavedMessage=false;
						stories.forEach(function(story){
							//business value is empty
							if((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0)){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement is empty
							if((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))
							{
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							
							// storypoints is empty
							if((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0')){
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//business value and riskReductionOpportunityEnablement is empty
							if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0))&&((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//business value and story points is empty 
							if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0'))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement and story points is empty
						
							if(((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0'))){
								story.wsjf=((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(1))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							//riskReductionOpportunityEnablement, business value and storypoints is empty
							
							if(((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined)||(!isInt(story.riskReductionOpportunityEnablement))||(story.riskReductionOpportunityEnablement<0))&&((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined)||(!isInt(story.storyPoints))||(story.storyPoints<0)||(story.storyPoints=='0')
									&&((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined)||(!isInt(story.businessValue))||(story.businessValue<0)))){
								story.wsjf=((parseInt(1) + parseInt(story.storyPriority) + parseInt(1))/parseInt(1));
								story.wsjf=story.wsjf.toFixed(2);
							}
							
							if(((story.businessValue!=null)&&(story.businessValue!="")&&(story.businessValue!=undefined)&&(isInt(story.businessValue))&&(!(story.businessValue<0)))&&((story.riskReductionOpportunityEnablement!=null)&&(story.riskReductionOpportunityEnablement!="")&&(story.riskReductionOpportunityEnablement!=undefined)&&(isInt(story.riskReductionOpportunityEnablement))&&(!(story.riskReductionOpportunityEnablement<0))
									&&((story.storyPoints!=null)&&(story.storyPoints!="")&&(story.storyPoints!=undefined)&&(isInt(story.storyPoints))&&(!(story.storyPoints<0))&&(story.storyPoints!='0')))){
								story.wsjf= ((parseInt(story.businessValue) + parseInt(story.storyPriority) + parseInt(story.riskReductionOpportunityEnablement))/parseInt(story.storyPoints));
								story.wsjf=story.wsjf.toFixed(2);
							}
						});
//						for(var i=0;i<stories.length;i++){
//							stories[i].wsjf= ((parseInt(stories[i].businessValue) + parseInt(stories[i].storyPriority) + parseInt(stories[i].riskReductionOpportunityEnablement))/parseInt(stories[i].storyPoints));
//							stories[i].wsjf=stories[i].wsjf.toFixed(2);
//						}
//						angular.copy(stories,priorStories);
//						for(var i=0;i<stories.length;i++){
//							
////							stories[i].decomposedUserStory="Yes";
//							
//							if(stories[i].storyPriority=="Critical"){
//								priorStories[i].storyPriority="5";
//							}
//							if(stories[i].storyPriority=="High"){
//								priorStories[i].storyPriority="4";
//							}
//							if(stories[i].storyPriority=="Medium"){
//								priorStories[i].storyPriority="3";
//							}
//							if(stories[i].storyPriority=="Low"){
//								priorStories[i].storyPriority="2";
//							}
//							if(stories[i].storyPriority=="Unassigned"){
//								priorStories[i].storyPriority="1";
//							}
//							
//						};
								
							}
						
					function validateForm(){
						for(var i=0;i<stories.length;i++){
							if(($scope.stories[i].businessValue!=null)&&($scope.stories[i].businessValue!="")&&($scope.stories[i].businessValue!=undefined)){
							if(!isInt($scope.stories[i].businessValue)){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
							if($scope.stories[i].businessValue<0){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
							if(($scope.stories[i].businessValue=="0") || ($scope.stories[i].businessValue=="+0") || ($scope.stories[i].businessValue=="0.0") || ($scope.stories[i].businessValue=="-0")){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							}
							if(($scope.stories[i].riskReductionOpportunityEnablement!=null)&&($scope.stories[i].riskReductionOpportunityEnablement!="")&&($scope.stories[i].riskReductionOpportunityEnablement!=undefined)){
							if(!isInt($scope.stories[i].riskReductionOpportunityEnablement)){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
							if($scope.stories[i].riskReductionOpportunityEnablement<0){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
							if(($scope.stories[i].riskReductionOpportunityEnablement=="0") || ($scope.stories[i].riskReductionOpportunityEnablement=="+0") || ($scope.stories[i].riskReductionOpportunityEnablement=="0.0") || ($scope.stories[i].riskReductionOpportunityEnablement=="-0")){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							}
							
							if(!isInt($scope.stories[i].storyPoints)){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
							if($scope.stories[i].storyPoints<0){
								$('#p1').text("Please provide correct values to calculate WSJF");
								$('#myModal').modal('show');	
								return false;
							}
							
//							if(($scope.stories[i].businessValue=="")||($scope.stories[i].riskReductionOpportunityEnablement=="")){
//								$('#p1').text("Please provide required values to calculate WSJF");
//								$('#myModal').modal('show');	
//								return false;
//							}
							
							if(($scope.stories[i].storyPoints=="0") || ($scope.stories[i].storyPoints=="+0") || ($scope.stories[i].storyPoints=="0.0") || ($scope.stories[i].storyPoints=="-0")){
								$('#p1').text("High level sizing  should not be zero");
								$('#myModal').modal('show');	
								return false;
							}
							if((stories[i].storyPoints!=null)&&(stories[i].storyPoints!="")&&(stories[i].storyPoints!=undefined)){
							stories[i].storyPoints= Math.round(stories[i].storyPoints);}
							if((stories[i].businessValue!=null)&&(stories[i].businessValue!="")&&(stories[i].businessValue!=undefined)){
							stories[i].businessValue= Math.round(stories[i].businessValue);}
							if((stories[i].riskReductionOpportunityEnablement!=null)&&(stories[i].riskReductionOpportunityEnablement!="")&&(stories[i].riskReductionOpportunityEnablement!=undefined)){
							stories[i].riskReductionOpportunityEnablement= Math.round(stories[i].riskReductionOpportunityEnablement);}
							
						}
						
						return true;
						
					}
					
					$scope.BusinessValueClass=function(story){
						if(((story.businessValue==null)||(story.businessValue=="")||(story.businessValue==undefined))&&(story.isSelected)){
							return "business_class highlighted_red";
						}
						if((story.businessValue!=null)||(story.businessValue!="")||(story.businessValue!=undefined)){
							return "business_class";
						}
					}
					
					$scope.RiskValueClass=function(story){
						if(((story.riskReductionOpportunityEnablement==null)||(story.riskReductionOpportunityEnablement=="")||(story.riskReductionOpportunityEnablement==undefined))&&(story.isSelected)){
							return "risk_class highlighted_red";
						}
						if((story.riskReductionOpportunityEnablement!=null)||(story.riskReductionOpportunityEnablement!="")||(story.riskReductionOpportunityEnablement!=undefined)){
							return "risk_class";
						}
					}
					
					$scope.StoryPointsClass=function(story){
						if(((story.storyPoints==null)||(story.storyPoints=="")||(story.storyPoints==undefined))&&(story.isSelected)){
							return "level_class highlighted_red";
						}
						if((story.storyPoints!=null)||(story.storyPoints!="")||(story.storyPoints!=undefined)){
							return "level_class";
						}
					}
					
					function confirmToMoveToDashbaord(dashboardURL) {
//						if(confirm('UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?')) {
//							window.location.href = dashboardURL;
//						}
						sessionStorage.setItem("fileName","");
					$('#myModal4').modal('show');

					}

					
			}]);

function confirmToMoveToDashbaord(dashboardURL) {
//	if(confirm('UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?')) {
//		window.location.href = dashboardURL;
//	}
	sessionStorage.setItem("fileName","");
$('#myModal2').modal('show');

}

function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}

function isInt(value) {
	  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
	}

Number.isInteger = Number.isInteger || function(value) {
	  return typeof value === 'number' && 
	    isFinite(value) && 
	    Math.floor(value) === value;
	};
	
