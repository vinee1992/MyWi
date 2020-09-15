<!DOCTYPE html>
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Accenture myWizard</title>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
<link href="resources/css/layout.css" rel="stylesheet" />
<link href="resources/css/custom.css" rel="stylesheet" />
<link href="resources/css/custom_1.css" rel="stylesheet" />
<link href="resources/css/jquery-ui.min.css" rel="stylesheet" />
<link rel="stylesheet" href="resources/css/ion.rangeSlider.css" />
<link rel="stylesheet" href="resources/css/ion.rangeSlider.skinFlat.css" />
<link rel="stylesheet" href="resources/css/spinner-loading.css" />
<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
<script src="resources/js/ion.rangeSlider.js" type="text/javascript"></script>
<script src="resources/js/raphael.js"></script>
<script src="resources/js/justgage.js"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js" type="text/javascript"></script>
<script src="resources/js/appService.js" type="text/javascript"></script>
<script src="resources/js/appFilterService.js" type="text/javascript"></script>
<script src="resources/js/appController.js" type="text/javascript"></script>
</head>
<body ng-controller="ReleasePlannerController">
	<%@ page import="com.accenture.automation.authentication.UserDetails"%>
	<%
		UserDetails userDetails = (UserDetails) session.getAttribute("userDetails");

		String projectName = userDetails.getProjectName();
		String clientName = userDetails.getClientName();
		String engagementName = userDetails.getEngagementName();

		String projectId = (String) session.getAttribute("receivedProjectId");
		String enterpriseId = (String) session.getAttribute("receivedEnterpriseId");

		String userid = userDetails.getUserid();
	%>
	<div class="wrapper">
		<div class="wrap">
		<div id="awaiting_response" class="wait" style="display: none;">
				<i class="fa fa-spinner fa-spin"
					style="font-size: 80px; color: white"></i>
			</div>
			<header class="container-fluid header">
				<div class="row">
					<div class="header-col col-xs-12 col-sm-4 branding">
						<img src="resources/images/logo_accenture_old.png"
							alt="Accenture Technology" class="img-responsive" />
					</div>
					<div class="header-col col-xs-12 col-sm-8 text-right">
						<div class="clearfix settings-panel">
							<div class="pull-right user-wrap">
								<div class="user-toggle" data-toggle="dropdown">
									<strong><%=userid%></strong>
								</div>
								<ul>
									<li><a href="javascript:;">Logout <span
											class="glyphicon glyphicon-off"></span></a></li>
								</ul>
							</div>
							<div class="pull-right settings-config disabled">
								<span class="glyphicon glyphicon-cog"></span>
							</div>
						</div>
						<div class="clearfix va-alerts-wrap">&nbsp;</div>
					</div>
				</div>
			</header>
			<!-- /header -->
			<nav class="nav-bar navbar-default">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed"
						data-toggle="collapse" data-target="#navbar-menu"
						aria-expanded="false">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
				</div>
				<div id="navbar-menu" class="collapse navbar-collapse">
					<div class="navbar-left agilerelease_title col-sm-6">Agile
						Release Planner</div>
					<div class="navbar-right col-xs-12 col-sm-6">
						<div class="scope-selector scope_titles">
							<div class="scope-selector-toggle"
								title="Client Name | Engagement Name | Project Name">
								<div>
									<span><%=clientName%></span><span><%=engagementName%></span><span><%=projectName%></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<!-- /nav bar -->

			<div class="content-wrap container-fluid">
				<div class="row page-title">
					<div class="col-xs-9">
						<h1 class="text-left">
							<a class="back-link" href=""
								onclick="confirmToMoveToDashbaord('/releaseplanner/dashboard?action=back')"><span
								class="glyphicon glyphicon-menu-left"></span>Back</a> Release
							Planning
						</h1>
					</div>
				</div>
				<div class="row tile-wrap margint_top15">

					<div class="col-md-12 content-bg paddint0">
						<div class="content-header row">
							<ul class="nav navbar-inline">
								<li
									title="{{projectResponse.releasePlannerReleases[0].releaseName}}"><strong>Release
										:</strong> {{projectResponse.releasePlannerReleases[0].releaseName}}</li>|
								<li>{{projectResponse.releasePlannerReleases[0].startDate}}
									- {{projectResponse.releasePlannerReleases[0].endDate}}</li>|
								<li><strong>Sprint Duration :</strong>
									{{projectResponse.releasePlannerReleases[0].sprintDuration}}
									Week(s)</li>|
								<li><strong>Sprint Type :</strong> <label
									class="checkbox-inline white"
									ng-if="projectResponse.releasePlannerReleases[0].sprint0 " style="padding-left: 0px; margin-left:0px;">
										Sprint 0&nbsp,</label> <label class="checkbox-inline  white" style="padding-left: 0px; margin-left:0px;" ng-if="true">
										Sprints 1 - N</label><label class="checkbox-inline  white"
									ng-if="projectResponse.releasePlannerReleases[0].sprintHardening" style="padding-left: 0px; margin-left:0px;">
										,&nbspHardening</label> <label class="checkbox-inline  white"
									ng-if="projectResponse.releasePlannerReleases[0].sprintDeploy" style="padding-left: 0px; margin-left:0px;">
										,&nbspDeploy</label></li>|
								<li title="{{projectResponse.releasePlannerReleases[0].team}}"><strong>Team
										:</strong> {{projectResponse.releasePlannerReleases[0].team}}</li>|
								<li><strong>Planned Velocity :</strong>
									{{projectResponse.releasePlannerReleases[0].plannedVelocity}}</li>|
								<li><strong>Velocity Increment :</strong>
									{{projectResponse.releasePlannerReleases[0].velocityTrend}}%</li>
							</ul>
						</div>
						<div class="row search_by">
							<div class="col-md-3 white score_points">
								Scope:<span class="text350">
									{{productBacklog.totalStoryPoints}} </span> Story pts
							</div>
							<div class="col-md-1">
								<div class="row row1 text-center margint10">
									<div class="col-md-12">
										<div class="row">
											<img src="resources/images/priority.png" width="80" alt="">
										</div>
									</div>
									<a class="prior-1 dropdown-toggle hover" type="button"
										data-toggle="dropdown">Priority</a>
									<div class="dropdown-menu priority_dropdown">
										<label class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('Priority', 'Critical')"><img
											src="resources/images/red1.png" width="13" alt=""> Critical</label> <label
											class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('Priority', 'High')"><img
											src="resources/images/purple1.png" width="13" alt=""> High</label> <label
											class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('Priority', 'Medium')"><img
											src="resources/images/yellow1.png" width="13" alt=""> Medium</label> <label
											class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('Priority', 'Low')"><img
											src="resources/images/green.png" width="13" alt=""> Low</label>
											<label
											class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('Priority', 'Unassigned')"><img
											src="resources/images/grey.png" width="13" alt=""> Unassigned</label>
									</div>
								</div>
							</div>
							<div class="col-md-1">
						     <div class="row row1 text-center margint10">
                                                            <img src="resources/images/dependency.png" width="25" alt="">
                                                       <p class="dropdown-toggle hover" type="button" data-toggle="dropdown" aria-expanded="false">Dependency</p>
                                                        <div class="dropdown-menu priority_dropdown dd1">
                                                           <label class="checkbox-inline"><input type="checkbox"
											value="" ng-click="applyFilter('DependentOn')">
											Dependent On</label>
                                                        </div>
                                                    </div></div>
					
							<div class="col-md-2">


								<div class="row row2">
									<div class=" box2 col-md-12">
										<input type="text" id="range" value="" name="range" />
										<p>
											Story Points <label class="checkbox-inline pull-right"><input
												type="checkbox" value="" ng-checked="true"
												ng-model="storyPointsFilterDisabled"
												ng-change="applyFilter('StoryPoints')">NA</label>
										</p>
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="row row2">
									<div class="box2 col-md-12">
										<input type="text" id="range1" value="" name="range1" />
										<p>
											Rank <label class="checkbox-inline pull-right"><input
												type="checkbox" value="" ng-checked="true"
												ng-model="storyRankFilterDisabled"
												ng-change="applyFilter('StoryRank')">NA</label>
										</p>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="input-group margint10 input-cus">
									<span class="input-group-addon"><i
										ng-click="searchStories()" class="glyphicon glyphicon-search"></i></span>
									<input type="text" class="form-control input-sm" name="email"
										placeholder="Search" ng-model="storySearchString"> <img
										src="resources/images/pin.png" alt="" class="pin_button"
										ng-click="showPinnedStories()">
								</div>
								<div class="white">
									<small>Search by ID, Title and Assignee only</small>
								</div>
							</div>
						</div>

						<di v class="row hide_panel"> <!-- 	<button type="button" class="btn btn-primary btn-sm push_pin" data-toggle="toggle" data-target="#demo">
                                    <img src="images/collapse-icon.png" alt="collapseleft" width="20">
                        </button> --> <!--  <div class="col-md-3 leftsidebar" id="demo">
                                                    <div class="pdt-backlog row">Product Backlog</div>
                                                    <div class="rlg-backlog row">Release Backlog <span class="text-right">1 Nov- 22 Nov</span></div>
                                                    <ul class="sprint-list">
                                                        <li><img src="images/nav-arrow.png" alt=""> Sprint 1<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Sprint 2<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Sprint 3<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Sprint 4<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Sprint 5<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Deploy Release<span class="text-right">1 Nov- 22 Nov</span></li>
                                                        <li><img src="images/nav-arrow.png" alt=""> Post Deploy Release<span class="text-right">1 Nov- 22 Nov</span></li>
                                                    </ul>
                                                </div> -->
						<div class="col-md-9 righttsidebar">
							<div class="text-left margint_5">
								<h4>
									<a ng-if="storyPinnedView || storySearchView" class="" href="#"
										ng-click="applyFilter()"><< Back to backlog</a>
								</h4>
							</div>
							<div class="col-md-9 righttsidebar">
							  <h5 class="margint15">Product Backlog</h5> 
							<div class="text-right margint_5 font_style">
								Click the <strong>Story card</strong> for individual select. | <a
									class="text_line" href="#" ng-click="selectAll()"
									id="defaultSelect">Select All</a> | <a class="" href="#"
									ng-click="deSelectAll()">Deselect All</a>
							</div>
							<div>
								<div id="collapse1" class="panel-collapse collapse in margint25">
									<div class="panel-body">
										<div class="row">
											<div id="carousel-example-generic" class="carousel slide"
												data-ride="carousel" data-interval="false">
												<!-- Indicators -->
												<!-- Wrapper for slides -->
												<div class="col-md-12">
													<div class="col-md-5 left-arrow pull-left text-right">
														<a class="left" href="#carousel-example-generic"
															role="button" data-slide="prev"> <i
															class="indicator glyphicon glyphicon-chevron-left left_arrow"
															aria-hidden="true"></i> <span class="sr-only">Previous</span>
														</a>
													</div>
													<div class="col-md-5 left-arrow pull-right text-left">
														<a class="right" href="#carousel-example-generic"
															role="button" data-slide="next"> <i
															class="glyphicon glyphicon-chevron-right right_arrow"
															aria-hidden="true"></i> <span class="sr-only">Next</span>
														</a>
													</div>
													<ul class="carousel-indicators carousel_indicator">

														<li data-target="#myCarousel" data-slide-to="0" class=""></li>
														<li data-target="#myCarousel" data-slide-to="1"
															class="active"></li>
														<li data-target="#myCarousel" data-slide-to="2" class=""></li>
													</ul>

												</div>

												<div class="carousel-inner margin_top25"
													id="carousel-inner-id">
													<div class="item active" id="activeCarouselItem">
														<div class="col-md-3"
															ng-repeat="story in productBacklogSplit1">
															<div class="panel panel-default panel-box panel_width">
																<div class="panel-heading">
																	<p class="panel-title" ng-click="storySelectDeselect(story.storyId)">
																		<img src="resources/images/book.png" alt=""> 
																		<span class="panel-title-text" title="{{story.storyId}}">Story {{story.storyId}}</span>
																		 <img src="resources/images/after-check.png"
																			width="16" class="pull-right selected_img"
																			ng-show="story.isSelected" />
																			<img
																			src="resources/images/grey_tick.png" width="16"
																			class="pull-right selected_img" ng-show="!story.isSelected" />
																	
 <span class="pull-right story_images"> 
<!--                                                                             <img src="resources/images/pencil-book.png" alt="" class="pencil_book"> -->
                                                                            <a class="pin_class" href="">
    <img src="resources/images/book-pin.png" alt="" class="book_pin" ng-click="pinUnpin(story.storyId, $event)" ng-if="!story.isPinned"/><img
																					src="resources/images/book-pin-greyed.png" alt=""
																					ng-click="pinUnpin(story.storyId, $event)" ng-if="story.isPinned"/></a>
    <img src="resources/images/dependency-book.png" class="dependency_book" alt="" ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'> 
                                                                                </span>
																	</p>
																</div>

																<div class="panel-body" ng-click="storySelectDeselect(story.storyId)">
																	<div class="row">
																		<div class="col-md-6 name_1" title="{{story.assignedTo}}">{{story.assignedTo}}</div>
																		<div class="col-md-6 name_3">
																			<img width="10" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="10" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="10" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="10" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="10" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'">
																				{{story.storyPriority}}
																		</div>
																	</div>
																	<div class="name_2" title="{{story.storyTitle}}">{{story.storyTitle}}</div>

																	<div class="row">
																		<div class="col-md-6">
																			Story Points <br>
																			<button class="btn btn-book btn-book-1">{{story.storyPoints}}</button>
																		</div>
																		<div class="col-md-6">
																			Rank <br>
																			<button class="btn btn-book btn-book-2">{{story.stackRank}}</button>
																		</div>
																	</div>

																</div>

															</div>
														</div>


													</div>
													<div class="item" ng-repeat="storyGroup in productBacklogSplit2"
															ng-init="outerIndex = $index">
														<div class="col-md-3" ng-repeat="story in storyGroup"
																ng-init="innerIndex = $index">
													<div class="panel panel-default panel-box panel_width">
																<div class="panel-heading">
																	<p class="panel-title" ng-click="storySelectDeselect(story.storyId)">
																		<img src="resources/images/book.png" alt=""> 
																		<span class="panel-title-text" title="{{story.storyId}}">Story
																		{{story.storyId}}</span> <img src="resources/images/after-check.png"
																			width="16" class="pull-right selected_img"
																			ng-show="story.isSelected" />
																			<img
																			src="resources/images/grey_tick.png" width="16"
																			class="pull-right selected_img" ng-show="!story.isSelected" />
																	
 <span class="pull-right story_images"> 
<!--                                                                             <img src="resources/images/pencil-book.png" alt="" class="pencil_book"> -->
                                                                            <a class="pin_class" href="">
    <img src="resources/images/book-pin.png" alt="" ng-click="pinUnpin(story.storyId, $event)" ng-if="!story.isPinned"/><img
																					src="resources/images/book-pin-greyed.png" alt=""
																					ng-click="pinUnpin(story.storyId, $event)" ng-if="story.isPinned"/></a>
    <img src="resources/images/dependency-book.png" class="dependency_book" alt="" ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'> 
                                                                                </span>
																	</p>
																</div>

																<div class="panel-body" ng-click="storySelectDeselect(story.storyId)">
																	<div class="row">
																		<div class="col-md-6 name_1" title="{{story.assignedTo}}">{{story.assignedTo}}</div>
																		<div class="col-md-6 name_3">
																			<img width="10" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="10" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="10" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="10" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="10" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'">
																				{{story.storyPriority}}
																		</div>
																	</div>
																	<div class="name_2" title="{{story.storyTitle}}">{{story.storyTitle}}</div>

																	<div class="row">
																		<div class="col-md-6">
																			Story Points <br>
																			<button class="btn btn-book btn-book-1">{{story.storyPoints}}</button>
																		</div>
																		<div class="col-md-6">
																			Rank <br>
																			<button class="btn btn-book btn-book-2">{{story.stackRank}}</button>
																		</div>
																	</div>

																</div>

															</div>
														</div>
													</div>
													
												</div>
												<div class="col-md-12">
													<div class="row">
														<div class="col-md-6">
<!-- 															<button class="btn map-btn">Map Dependency</button> -->
															<a href=""></a><button class="btn map-btn wsjf_btn" ng-click="createWSJFview()"
															id="createWSJFScreenButton">
																	<div class="progress progress-wsjf">
																		<div class="progress-bar bg-1 bg-blue" ng-attr-style="width:{{WSJFcompletenessPercentage+'%'}}"
																			style="width: 40%"></div>
																		<div class="progress-bar bg-2 bg-grey" style="width:"{{100-WSJFcompletenessPercentage}}%"
																			style="width: 60%"></div>



																	</div>


																	WSJF View
																</button></a>
														</div>
														<div class="col-md-6 text-right">
															<button class="btn map-btn"
																onclick="window.location.href='releaseTimeline'">&Lt;
																Back</button>
															<button class="btn map-btn map-btn1 btn-default"
																ng-click="createReleasePlan()"
																id="createReleasePlanButton">Create Release
																Plan</button>
														</div>

<div></div>
														<!-- Controls -->

													</div>

												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						</div>
						<!-- /tile-wrap -->
					</div>



					<!-- /content-wrap -->
				</div>
				<!-- /wrap -->
				
				<div class="col-md-4 margint25">
					<div id="myModal" class="modal" role="dialog">
						<div class="modal-dialog1">
							<div class="vertical-alignment-helper">
								<div class="modal-dialog vertical-align-center">
									<!-- Modal content-->
									<div class="modal-content">
										<div class="modal-header head1">
											<a class="close1" data-dismiss="modal">&times;</a>
											<h4 class="modal-title">Alert</h4>
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-md-4 ">
													<div class="col-md-12">
														<img src="resources/images/mark.png" alt=""
															class="img-responsive">
													</div>
												</div>
												<div class="col-md-8">
													<p class="popup_text_height" id="p1"></p>
													<button type="button"
														class="btn  pull-right btn-primary moreBtn ok"
														data-dismiss="modal">OK</button>
												</div>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 margint25">
					<div id="myModal2" class="modal fade" role="dialog">
						<div class="modal-dialog1">
							<div class="vertical-alignment-helper">
								<div class="modal-dialog vertical-align-center">
									<!-- Modal content-->
									<div class="modal-content">
										<div class="modal-header head1">
											<a class="close1" data-dismiss="modal">&times;</a>
											<h4 class="modal-title">Confirmation</h4>
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-md-4 ">
													<div class="col-md-12">
														<img src="resources/images/mark.png" alt=""
															class="img-responsive">
													</div>
												</div>
												<div class="col-md-8">
													<p>UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?
													</p>
													<div class="col-md-12">
														<div class="row">
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok pull-right"
																data-dismiss="modal">Cancel</button>
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok marginr10 pull-right"
																data-dismiss="modal"
																onclick="window.location.href='/releaseplanner/dashboard?action=back'">OK</button>
														</div>
													</div>
												</div>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
					<div class="col-md-4 margint25">
					<div id="myModal5" class="modal fade" role="dialog">
						<div class="modal-dialog1">
							<div class="vertical-alignment-helper">
								<div class="modal-dialog vertical-align-center">
									<!-- Modal content-->
									<div class="modal-content">
										<div class="modal-header head1">
											<a class="close1" data-dismiss="modal">&times;</a>
											<h4 class="modal-title">Confirmation</h4>
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-md-4 ">
													<div class="col-md-12">
														<img src="resources/images/mark.png" alt=""
															class="img-responsive">
													</div>
												</div>
												<div class="col-md-8">
													<p>Please click 'OK' to consider WSJF or click 'Cancel' to consider story Rank for creating Release Plan.
													</p>
													<div class="col-md-12">
														<div class="row">
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok pull-right"
																data-dismiss="modal" ng-click="StackRanking()">Cancel</button>
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok marginr10 pull-right"
																data-dismiss="modal"
																ng-click="createWSJFview()">OK</button>
														</div>
													</div>
												</div>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 margint25">
					<div id="myModal3" class="modal fade" role="dialog">
						<div class="modal-dialog1">
							<div class="vertical-alignment-helper">
								<div class="modal-dialog vertical-align-center">
									<!-- Modal content-->
									<div class="modal-content">
										<div class="modal-header head1">
											<a class="close1" data-dismiss="modal">&times;</a>
											<h4 class="modal-title">Confirmation</h4>
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-md-4 ">
													<div class="col-md-12">
														<img src="resources/images/mark.png" alt=""
															class="img-responsive">
													</div>
												</div>
												<div class="col-md-8">
													<p id="p2"></p>
													<div class="col-md-12">
														<div class="row">
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok pull-right"
																data-dismiss="modal">Cancel</button>
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok marginr10 pull-right"
																data-dismiss="modal"
																ng-click="autoSelectDependency()">OK</button>
														</div>
													</div>
												</div>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 margint25">
					<div id="myModal4" class="modal fade" role="dialog">
						<div class="modal-dialog1">
							<div class="vertical-alignment-helper">
								<div class="modal-dialog vertical-align-center">
									<!-- Modal content-->
									<div class="modal-content">
										<div class="modal-header head1">
											<a class="close1" data-dismiss="modal">&times;</a>
											<h4 class="modal-title">Confirmation</h4>
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-md-4 ">
													<div class="col-md-12">
														<img src="resources/images/mark.png" alt=""
															class="img-responsive">
													</div>
												</div>
												<div class="col-md-8">
													<p id="p3"></p>
													<div class="col-md-12">
														<div class="row">
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok pull-right"
																data-dismiss="modal">Cancel</button>
															<button type="button"
																class="btn pull-right btn-primary moreBtn ok marginr10 pull-right"
																data-dismiss="modal"
																ng-click="autoDeselectDependent()">OK</button>
														</div>
													</div>
												</div>
											</div>

										</div>

									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
				<footer class="footer text-center left_align"> 
				&copy; 2001-2018
					Accenture. All Rights Reserved. Accenture Confidential. For
					Internal Use Only. </footer>
			</div>
			<!-- /wrapper -->
			<script>
				
			</script>
			<script type="text/javascript">
				$(function() {
					$("#range,#range1").ionRangeSlider({
						hide_min_max : true,
						keyboard : false,
						min : 0,
						max : 100,
						from : 20,
						to : 80,
						type : 'double',
						step : 4,
						prefix : "",
						grid : false
					});
				});
			</script>
		</div>
</body>
</html>