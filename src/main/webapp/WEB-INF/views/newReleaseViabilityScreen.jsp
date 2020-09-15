<!DOCTYPE html>
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Agile Release Planner</title>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
<link href="resources/css/layout.css" rel="stylesheet" />
<link href="resources/css/custom.css" rel="stylesheet" />
<link href="resources/css/jquery-ui.min.css" rel="stylesheet" />
<link rel="stylesheet" href="resources/css/ion.rangeSlider.css" />
<link rel="stylesheet" href="resources/css/ion.rangeSlider.skinFlat.css" />
<link rel="stylesheet" href="resources/css/cmGauge.css" />
<link rel="stylesheet" href="resources/css/spinner-loading.css" />
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
<script src="resources/js/ion.rangeSlider.js" type="text/javascript"></script>
<script src="resources/js/raphael.js"></script>
<script src="resources/js/justgage.js"></script>
<script src="resources/js/cmGauge.js"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap-slider.js" type="text/javascript"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js" type="text/javascript"></script>
<script src="resources/js/appService.js" type="text/javascript"></script>
<script src="resources/js/appFilterService.js" type="text/javascript"></script>
<script src="resources/js/appController.js" type="text/javascript"></script>
<script src="resources/js/raphael-2.1.4.min.js"></script>
<script src="resources/js/justgage.js"></script>



<script type="text/javascript">
//$( document ).ready(function() {
    //$('#gaugeDemo .gauge-arrow').cmGauge();
  
// $(document).ready(function () {
// 	$("#confidenceSlider").on("slideStop", function(data) {
// 		angular.element('[ng-controller=ReleasePlannerViabilityController]').scope().updateConfidenceFilterValue(data);
// 		});
// });
</script>

</head>
<body ng-controller="ReleasePlannerViabilityController">
									<%@ page
										import="com.accenture.automation.authentication.UserDetails"%>
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
						<img src="resources/images/logo_accenture_old.png" alt="Accenture Technology" class="img-responsive" />
					</div>
						<div class="header-col col-xs-12 col-sm-8 text-right">
							<div class="clearfix settings-panel">
								<div class="pull-right user-wrap">
									<div class="user-toggle">
										<strong><%=userid %></strong> 
									</div>
								</div>
							</div>
							<div class="clearfix va-alerts-wrap">
								&nbsp;
							</div>
						</div>
				</div>
			</header>
			<!-- /header -->
			<nav class="nav-bar navbar-default">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-menu" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
					</button>
				</div>
				<div id="navbar-menu" class="collapse navbar-collapse">
					<div class="navbar-left agilerelease_title col-sm-6">Agile Release Planner</div>
					<div class="navbar-right col-xs-12 col-sm-6">
						<div class="scope-selector">
							<div class="scope-selector-toggle" title="Client Name | Engagement Name | Project Name">
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
					<div class="col-xs-9 container_margin">
						<h1 class="text-left">
							<a class="back-link" href="" onclick="confirmToMoveToDashbaord('/releaseplanner/dashboard?action=back')"><span class="glyphicon glyphicon-menu-left"></span>Back</a>
							<p class="header_style">Release Planning</p>
						</h1>
					</div>
				</div>
				<div class="row tile-wrap">
					<div class="col-md-12 content-bg paddint0">
						<div class="content-header row">
							<ul class="nav navbar-inline">
								<li  title="{{projectResponse.releasePlannerReleases[0].releaseName}}"><strong>Release :</strong> {{projectResponse.releasePlannerReleases[0].releaseName}}</li>|
								<li>{{projectResponse.releasePlannerReleases[0].startDate}} - {{projectResponse.releasePlannerReleases[0].endDate}}</li>|
								<li><strong>Sprint Duration :</strong> {{projectResponse.releasePlannerReleases[0].sprintDuration}} Week(s)</li>|
								 <li><strong>Sprint Type :</strong>
								  	
                                    <label class="checkbox-inline white" ng-if="projectResponse.releasePlannerReleases[0].sprint0" style="padding-left: 0px; margin-left:0px;"> Sprint 0&nbsp,</label>
                                    <label class="checkbox-inline  white" ng-if="true" style="padding-left: 0px; margin-left:0px;"> Sprints 1 - N</label>
                                    <label class="checkbox-inline  white"ng-if="projectResponse.releasePlannerReleases[0].sprintHardening" style="padding-left: 0px; margin-left:0px;">,&nbspHardening</label>
                                    <label class="checkbox-inline  white" ng-if="projectResponse.releasePlannerReleases[0].sprintDeploy" style="padding-left: 0px; margin-left:0px;">,&nbspDeploy</label>
                                    
                                </li>|
<!-- 								<li><strong>Sprint Type :</strong> <label class="checkbox-inline white" style="font-size:13px"> <input ng-disabled="true" type="checkbox" value="" ng-checked="projectResponse.releasePlannerReleases[0].sprint0">Sprint 0 -->
<!-- 								</label><label class="checkbox-inline  white" style="font-size:13px"> <input ng-disabled="true" type="checkbox" value="" checked ng-disabled="true">Sprints 1 - N -->
<!-- 								</label> <label class="checkbox-inline  white" style="font-size:13px"> <input ng-disabled="true" type="checkbox" value="" ng-checked="projectResponse.releasePlannerReleases[0].sprintHardening">Hardening -->
<!-- 								</label> <label class="checkbox-inline  white" style="font-size:13px"> <input ng-disabled="true" type="checkbox" value="" ng-checked="projectResponse.releasePlannerReleases[0].sprintDeploy">Deploy -->
<!-- 								</label></li>| -->
								<li  title="{{projectResponse.releasePlannerReleases[0].team}}"><strong>Team :</strong> {{projectResponse.releasePlannerReleases[0].team}}</li>|
								<li><strong>Planned Velocity :</strong> {{projectResponse.releasePlannerReleases[0].plannedVelocity}}</li>|
								<li><strong>Velocity Increment :</strong> {{projectResponse.releasePlannerReleases[0].velocityTrend}}%</li>
							</ul>
						</div>
						<div class="row short-nav search_by search_catalog">

							<ul class="short_nav_left pull-left">
								<div class="row row1 col-md-3 text-center margint10 choice_drpdwn">
									<div class="col-md-12">
										<div class="row story_items_img">
											<img src="resources/images/priority.png" width="75" alt="">
										</div>
									</div>
									<a class="dropdown-toggle margin_left0" type="button" data-toggle="dropdown" aria-expanded="true">Priority</a>
									<div class="dropdown-menu priority_dropdown">
										<label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('Priority', 'Critical')"><img src="resources/images/red1.png" width="13" alt="" >
											Critical</label><label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('Priority', 'High')"><img src="resources/images/purple1.png" width="13"
											alt=""> High</label> <label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('Priority', 'Medium')"><img src="resources/images/yellow1.png"
											width="13" alt=""> Medium</label> <label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('Priority', 'Low')"><img
											src="resources/images/green.png" width="13" alt=""> Low</label> <label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('Priority', 'Unassigned')"><img src="resources/images/grey.png" width="13" alt="" >
											Unassigned</label> 
									</div>
								</div>

								<div class="row row1 col-md-3 text-center margint10  choice_drpdwn story_items_img">
									<div class="story_items_img margin_left0">
										<img src="resources/images/dependency.png" width="24" alt="">
									</div>
									<p class="dropdown-toggle hover margin_left0" type="button" data-toggle="dropdown" aria-expanded="false">Dependency</p>
									<div class="dropdown-menu priority_dropdown dd1">
										<label class="checkbox-inline"><input type="checkbox" value="" ng-click="applyFilter('DependentOn')" >Dependent On</label>
									</div>
								</div>
								
<!-- 							 <div class="row row1 col-md-3 text-center margint10  choice_drpdwn"> -->
<!--                                     <div class="story_items_img margin_left0"> -->
<!--                                         <img alt="" src="resources/images/team.png" width="24" class="img-responsive" alt="Team"> </div> -->
<!--                                     <a><p class="margin_left0">Team</p></a> -->
<!--                                 </div> -->
                                
                                  <div class="row row1 col-md-3 text-center margint10  choice_drpdwn stories_selector">
                                    <div class="story_slider">
                                        <div class="sprint-slider marginl25">
                                            <input type="text" id="confidenceSlider"  data-provide="slider" data-slider-min="0" data-slider-max="100" data-slider-step="5" data-slider-value="[0,100]" 
                                            data-slider-ticks="[0,20,40,60,80,100]" data-orientation="horizontal" style="display: none;"> </div>
                                    </div>
                                    <p class="marginr25">Viability Score</p>
                                </div>
                                
								 <div class="row row1 col-md-4 text-center margint10  choice_drpdwn stories_selector">
                                    <div class="story_items_img margin_left0">
                                        <img alt="" src="resources/images/show_icon.png" ng-click="hideShowProductBacklog()" id="productbacklogdisplay" width="22" class="prod_image img-responsive" alt="Product Backlog">

										</div>
                                    <a><p class="margin_left0 hide_prod" >Product Backlog</p></a>
								<!-- <img alt="" src="resources/images/show_icon.png" id="show" width="22" class="team_image img-responsive" alt="Product Backlog"> -->
<!-- 								<div class="row row1 col-md-4 text-center margint10  choice_drpdwn stories_selector"> -->
<!-- 									<div class="story_slider"> -->
<!-- 										<div class="sprint-slider"> -->
<!-- 											<input type="text" id="confidenceSlider" data-provide="slider" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="[0,100]" -->
<!-- 												data-slider-ticks="[0,20,40,60,80,100]" data-orientation="horizontal" /> -->
<!-- 										</div> -->
<!-- 									</div> -->
<!-- 									<p class="">Confidence Score</p> -->
<!-- 								</div> -->
							</ul>

                            <ul class="short_nav_right pull-right">
                             	<li class="overscope"><a href="#"><img alt="" src="resources/images/overall_scope.png" width="15"> Overall Scope</a></li>	
                             	<li class="overscope"><a href="#"><img alt="" src="resources/images/overrun-scope.png" width="15"> Overrun Scope</a></li>
                             	<li  class="musthavescope"><a href="#"><img alt="" src="resources/images/must_have.png" width="15"> Must have Scope</a></li>
                            	<li  class="sp "><a href="#"><strong>SP:</strong> Story Points</a></li>
                            	</ul>
                            	<ul class="pull-right">
                                <li class="pull-right conf_score viability_check"><span class=""> Viability Score  :</span></li>
                                <li class="check_options"> <span class="option_spanoption_spanoption_spanoption_spanoption_span marginr45">
                                                   <img alt="" src="resources/images/VS1.png" width="21" class="img_align_1"><span class="num_1">0-49% </span><span class="partition_1">|</span></span> <span class="option_spanoption_spanoption_spanoption_spanoption_span marginr45"><img alt="" src="resources/images/VS2.png" width="21" class="img_align_2"><span class="num_2">50-75%</span> <span class="partition_2">|</span></span> <span class="option_span marginr10"><img alt="" src="resources/images/VS3.png" width="21" class="img_align_3"><span class="num_3">76-100% </span></span>
                                </li>
                            </ul>
<!--                                 <li class="confscore"><a href="#"><img alt="" src="resources/images/confidence_score.png" width="25"> Viability Score</a></li> -->
								
<!-- <!-- 							<a href="" class="hide_product" ng-click="hideShowProductBacklog()" id="productbacklogdisplay">Hide Product Backlog</a> -->
<!-- 							<ul class="pull-right"> -->
<!-- 								<li class="pull-right conf_score"><span class=""> Confidence Score :</span></li> -->
<!-- 								<li class="check_options"> -->
<!-- 									<input type="checkbox" value="" class="neutral_chk1" ng-click="applyFilter('Neutral')"> -->
<!-- 									<span class="option_spanoption_spanoption_spanoption_spanoption_span marginr45"> -->
<!-- 									<img src="resources/images/neutral.png" width="22"/>Neutral</span> -->
<!-- 									<input type="checkbox" value="" ng-click="applyFilter('Viable')"><span class="option_spanoption_spanoption_spanoption_spanoption_span marginr45"><img src="resources/images/green_grph.png" width="22" />Viable</span> -->
<!-- 									<input type="checkbox" value="" ng-click="applyFilter('Not Viable')"><span class="option_span marginr10"><img src="resources/images/red_grph.png" width="22"/>Not Viable</span> -->
<!-- 								</li> -->
<!-- 							</ul> -->
						</div>




						<!-- Carousel Code Start -->
						<div id="carousel-example-generic" class="carousel slide" data-ride="carousel" data-interval="false">
							<!-- Indicators -->
							<!-- Wrapper for slides -->
							<div class="row">
								<a class="left" href="#carousel-example-generic" role="button" data-slide="prev"> <span class="glyphicon" aria-hidden="true"><img
										src="resources/images/left_arrow.png" width="50" alt=""></span> <span class="sr-only">Previous</span>
								</a> <a class="left1" href="#carousel-example-generic" role="button" data-slide="next"> <span class="glyphicon" aria-hidden="true"><img
										src="resources/images/right_arrow.png" width="50" alt=""></span> <span class="sr-only">Next</span>
								</a>
							</div>
							<div class="arrow_background"></div>

							<div class="carousel-inner">
								<div class="item active margint-25"  id="activeCarouselItem">
									<div class="row">
										<div class="col-md-3" ng-if="displayProductBacklog">
											<div class=" tile tile_new1">
												<div class="row">
													<div class="product-head">

														<span class="product">Product Backlog</span>
														<div class="col-md-12">
															<div class="row">
																<div class="col-md-3 green-txt">
																	<img src="resources/images/overall_scope.png" alt="" width="18"><strong>{{storyDisplaySplit1[0].overAllScope}}</strong>
																</div>
																<div class="col-md-3 purple-txt brown-txt">
																	<img src="resources/images/must_have.png" alt="" width="18"><strong>{{storyDisplaySplit1[0].mustHaveScope}}</strong>
																</div>
																<div class="col-md-6" ></div>
															</div>

														</div>
													</div>
												</div>
												<div class="inner-box_block">
													<div class="product_row"
														ng-if="(storyDisplaySplit1[0].stories == null) || (storyDisplaySplit1[0].stories.length == 0)">
														No Backlog.</div>
													<div class="product_row" ng-repeat="story in storyDisplaySplit1[0].stories">
														<div class="row margint10">
															<div class="col-md-8 pull-left">
																<span class="dblue strong panel-title-textviability" title="{{story.storyId}}">  {{story.storyId}} </span>
																<div class="margint5">
																	<div class="grey col-md-8">
																		<div class="row">
																			<img width="12" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="12" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="12" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="12" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="12" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'"> <small>{{story.storyPriority}}</small>
																		</div>
																	</div>
																	<div class="col-md-4">
																		<div class="row">
																		<strong class="purple-txt">{{story.storyPoints}}</strong>
																		<strong class="purple-txt">SP</strong>
																		</div>
																	</div>
																</div>
															</div>

															<div class="col-md-4 pull-right margint10">
																<div class="row margint10">

																	<div class="col-md-4 circle-blk text-left dropdown">
																		<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"> <img src="resources/images/menu_pop.png" width="17"
																			class="text-left margin7" alt="">
																		</a>
																		<ul class="dropdown-menu option_drpdwn" role="menu" aria-labelledby="menu1">
																			<li role="presentation"><a role="menuitem" tabindex="-1" data-toggle="modal" data-target="" ng-click="moveStory(story.storyId, null, 'Product Backlog', null, 'Release Backlog', story.storyPoints, story.storyPriority, 0, false)">Release Backlog</a></li>
																			<li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-repeat="sprintDetail in sprintDetails"  ng-click="moveStory(story.storyId, null, 'Product Backlog', sprintDetail[0], sprintDetail[1], story.storyPoints, story.storyPriority, 0,false)">{{sprintDetail[1]}}</a></li>
																		</ul>
																	</div>
																	<div class="col-md-8 circle-blk text-left">
																		<img src="resources/images/dependency-circle.png"
																			class="pull-left" width="28"
																			class="text-left margint5" alt=""
																			ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="col-md-3" ng-if="displayProductBacklog">
											<div class=" tile tile_new1">
												<div class="row">
													<div class="product-head">

														<span class="product">Release Backlog</span>
														<div class="col-md-12">
															<div class="row">
																<div class="col-md-3 green-txt">
																	<img src="resources/images/overall_scope.png" alt="" width="18"><strong>{{storyDisplaySplit1[1].overAllScope}}</strong>
																</div>
																<div class="col-md-3 purple-txt brown-txt">
																	<img src="resources/images/must_have.png" alt="" width="18"><strong>{{storyDisplaySplit1[1].mustHaveScope}}</strong>
																</div>
																<div class="col-md-6 font12" style="font-size: 10px; padding-left: 0px; padding-right:0px">{{projectResponse.releasePlannerReleases[0].startDate}}
																	- {{projectResponse.releasePlannerReleases[0].endDate}}</div>
															</div>
														</div>
													</div>
												</div>
												<div class="inner-box_block">
													<div class="product_row"
														ng-if="(storyDisplaySplit1[1].stories == null) || (storyDisplaySplit1[1].stories.length == 0)">
														No Backlog.</div>
													<div class="product_row" ng-repeat="story in storyDisplaySplit1[1].stories">
														<div class="row margint10">
															<div class="col-md-8 pull-left">
																<span class="dblue strong panel-title-textviability" title="{{story.storyId}}">  {{story.storyId}} </span>
																<div class="margint5">
																	<div class="grey col-md-8">
																		<div class="row">
																			<img width="12" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="12" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="12" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="12" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="12" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'"> <small>{{story.storyPriority}}</small>
																		</div>
																	</div>
																	<div class="col-md-4">
																		<div class="row">
																			<strong class="purple-txt">{{story.storyPoints}}</strong>
																			<strong class="purple-txt">SP</strong>
																		</div>
																	</div>
																</div>
															</div>
															<div class="col-md-4 pull-right margint10">
																<div class="row margint10">

																	<div class="col-md-4 circle-blk text-left dropdown">
																		<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"> <img src="resources/images/menu_pop.png" width="17"
																			class="text-left margin7" alt="">
																		</a>
																		<ul class="dropdown-menu option_drpdwn" role="menu" aria-labelledby="menu1">
																			<li role="presentation"><a role="menuitem" tabindex="-1" data-toggle="modal" data-target="" ng-click="moveStory(story.storyId, null, 'Release Backlog', null, 'Product Backlog', story.storyPoints, story.storyPriority, 0, false)">Product Backlog</a></li>
																			<li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-repeat="sprintDetail in sprintDetails" ng-click="moveStory(story.storyId, null, 'Release Backlog', sprintDetail[0], sprintDetail[1], story.storyPoints, story.storyPriority, 0, false)">{{sprintDetail[1]}}</a></li>																		
																		</ul>
																	</div>
																	<div class="col-md-8 circle-blk text-left">
																		<img src="resources/images/dependency-circle.png"
																			class="pull-left" width="28"
																			class="text-left margint5" alt=""
																			ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="col-md-3" ng-if="displayProductBacklog == false">
											<div class=" tile tile_new1">
												<div class="row">
													<div class="product-head">

														<span class="product">Release Backlog</span>
														<div class="col-md-12">
															<div class="row">
																<div class="col-md-3 green-txt">
																	<img src="resources/images/overall_scope.png" alt="" width="18"><strong>{{storyDisplaySplit1[0].overAllScope}}</strong>
																</div>
																<div class="col-md-3 purple-txt brown-txt">
																	<img src="resources/images/must_have.png" alt="" width="18"><strong>{{storyDisplaySplit1[0].mustHaveScope}}</strong>
																</div>
																<div class="col-md-6 font12" style="font-size: 10px; padding-left: 0px; padding-right:0px">{{projectResponse.releasePlannerReleases[0].startDate}}
																	- {{projectResponse.releasePlannerReleases[0].endDate}}</div>
															</div>
														</div>
													</div>
												</div>
												<div class="inner-box_block">
													<div class="product_row"
														ng-if="(storyDisplaySplit1[0].stories == null) || (storyDisplaySplit1[0].stories.length == 0)">
														No Backlog.</div>
													<div class="product_row" ng-repeat="story in storyDisplaySplit1[0].stories">
														<div class="row margint10">
															<div class="col-md-8 pull-left">
																<span class="dblue strong panel-title-textviability" title="{{story.storyId}}">  {{story.storyId}} </span>
																<div class="margint5">
																	<div class="grey col-md-8">
																		<div class="row">
																			<img width="12" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="12" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="12" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="12" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="12" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'"> <small>{{story.storyPriority}}</small>
																		</div>
																	</div>
																	<div class="col-md-4">
																		<div class="row">
																			<strong class="purple-txt">{{story.storyPoints}}</strong>
																			<strong class="purple-txt">SP</strong>
																		</div>
																	</div>
																</div>
															</div>
															<div class="col-md-4 pull-right margint10">
																<div class="row margint10">

																	<div class="col-md-4 circle-blk text-left dropdown">
																		<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"> <img src="resources/images/menu_pop.png" width="17"
																			class="text-left margin7" alt="">
																		</a>
																		<ul class="dropdown-menu option_drpdwn" role="menu" aria-labelledby="menu1">
																			<li role="presentation"><a role="menuitem" tabindex="-1" data-toggle="modal" data-target="" ng-click="moveStory(story.storyId, null, 'Release Backlog', null, 'Product Backlog', story.storyPoints, story.storyPriority, 0, false)">Product Backlog</a></li>
																			<li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-repeat="sprintDetail in sprintDetails" ng-click="moveStory(story.storyId, null, 'Release Backlog', sprintDetail[0], sprintDetail[1], story.storyPoints, story.storyPriority, 0, false)">{{sprintDetail[1]}}</a></li>																		
																		</ul>
																	</div>
																	<div class="col-md-8 circle-blk text-left">
																		<img src="resources/images/dependency-circle.png"
																			class="pull-left" width="28"
																			class="text-left margint5" alt=""
																			ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="col-md-3" ng-repeat="sprint in storyDisplaySplit2">
											<div class=" tile tile_new1">
												<div class="row">
													<div class="product-head">

														<span class="product panel-title-text-sprint " title="{{sprint.sprintName}}">{{sprint.sprintName}}</span>
														<div class="close-head" ng-if="(sprintMap.get(sprint.sprintId).releasePlannerStories == null) || (sprintMap.get(sprint.sprintId).releasePlannerStories.length == 0)"><a href="" ng-click="deleteSprint(sprint.sprintId, sprint.sprintName)"><img src="resources/images/close-icon.png" width="20" alt="close"/></a></div>
														<div class="col-md-12">
															<div class="row">
																<div class="col-md-12 font12 text-right"  style="font-size: 10px; padding-left: 0px;">{{sprint.startDate}} -
																	{{sprint.endDate}}</div>
															</div>
														</div>
													</div>
												</div>
												<div class="inner-box_block">
													<div class="progress">
														<div class="progress-bar"
															ng-style="sprint.mustHaveBarStyle" title="Must have Scope : {{sprint.mustHave}} Point(s)">
															<div class="label-txt">0</div>
														</div>
														<div class="progress-bar"
															ng-style="sprint.overAllScopeBarStyle" title="OverAll Scope : {{sprint.overAllScope + sprint.mustHave}} Point(s)">
															<div class="label-txt"
																ng-if="sprint.overAllScope!=0"></div>
														</div>
														<div ng-if="sprint.tentativeVelocity <= sprint.plannedVelocity" class="progress-bar bg-3"
															ng-style="sprint.unusedStoryPointBarStyle">
															<div class="label-txt1"
																ng-if="sprint.unassignedStoryPoints!=0"></div>
														</div>
                                                        <div ng-if="sprint.tentativeVelocity < sprint.plannedVelocity" class="progress-bar bg-4 pointer_val"
                                                         ng-style="sprint.overRunMustHavePointBarStyle" title="Must have Scope : {{sprint.mustHave}} Point(s)">
                                                               <img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprint.tentativeVelocity/ sprint.plannedVelocity)*100)) | number : 0}}%"/>
                                                               <div class="label-txt1">{{sprint.tentativeVelocity}}</div>
                                                        </div>
                                                        <div ng-if="sprint.tentativeVelocity < sprint.plannedVelocity" class="progress-bar bg-5 pointer_val"
                                                         ng-style="sprint.overRunOverAllScopePointBarStyle" title="OverAll Scope : {{sprint.overAllScope + sprint.mustHave}} Point(s)">
                                                               <span ng-if="sprint.overRunOverAllScopePointBarStyle.width == 0"><img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprint.tentativeVelocity/ sprint.plannedVelocity)*100)) | number : 0}}%"/>
                                                               <div class="label-txt1">{{sprint.tentativeVelocity}}</div></span>
                                                        </div>
														<div class="label-txt2" >{{sprint.plannedVelocity}}</div>
													</div>
													<div class="product_row" ng-repeat="story in sprint.releasePlannerStories">
														<div class="row margint10">
															<div class="col-md-6 pull-left">
																<span class="dblue strong panel-title-textviability" title="{{story.storyId}}"> {{story.storyId}}  </span>
																<div class="row  margint5">
																		<span class="grey col-md-8" style="padding-right:0px"><img width="12" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="12" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="12" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="12" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="12" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'"> <small>{{story.storyPriority}}</small></span>
																		<span class="col-md-4" style="padding-right:0px; padding-left:0px"><strong class="purple-txt">{{story.storyPoints}}</strong><strong class="purple-txt">SP</strong></span>
																</div>
															</div>

															<div class="col-md-6 pull-right" style="padding-left: 0px">
																<div class="col-md-5 pull-left" style="padding-top:15%; padding-left:0px; padding-right: 0px">
																<a href="javascript:void(0);" class="pull-left anchor_icon dropdown-toggle" class="dropdown-toggle" data-toggle="dropdown"><img src="resources/images/menu_pop.png" width="17" class="text-left margin7" alt=""></a>
																<ul class="dropdown-menu option_drpdwn" role="menu" aria-labelledby="menu1">
																	<li role="presentation"><a  class="menu_style" role="menuitem" tabindex="-1" data-toggle="modal" data-target="" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, null, 'Product Backlog', story.storyPoints, story.storyPriority, story.confidence,story.viable)">Product Backlog</a></li>
																	<li role="presentation"><a class="menu_style"  role="menuitem" tabindex="-1" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, null, 'Release Backlog', story.storyPoints, story.storyPriority, story.confidence, story.viable)">Release Backlog</a></li>
																	<li role="presentation"><a class="menu_style" role="menuitem" tabindex="-1" href="" ng-repeat="sprintDetail in sprintDetails | filter:'!'+sprint.sprintName" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, sprintDetail[0], sprintDetail[1], story.storyPoints, story.storyPriority, story.confidence, story.viable)"><span title="{{sprintDetail[1]}}">{{sprintDetail[1]}}</span></a></li>																		
																</ul>
																<img src="resources/images/dependency-circle.png" class="pull-left" width="25" class="text-left margint5" alt="" ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'>
																</div>
																<div class="col-md-7" style="padding-left: 0px; padding-right: 0px; padding-top:7px">
																<div id="{{story.storyId}}meter" confidence="{{story.confidence}}" viable="{{story.viable}}" class="gaugeTest" meterguage>
<!-- 																	<div meterguage storyid="{{story.storyId}}" percentagevalue="{{story.confidence}}"></div> -->
																</div>
																</div>
<!-- 																<div id="gaugeDemo" ng-class="ConfidenceFilter(story)" > -->
<!-- 																	<div ng-if="story.viable" class="gauge-arrow" data-percentage="{{story.confidence}}" style="transform: rotate({{( 1.8 * story.confidence) -90}}deg)"></div> -->
<!-- 																	<div ng-if="!story.viable" class="gauge-arrow" data-percentage="{{100-story.confidence}}" style="transform: rotate({{( 1.8 * (100-story.confidence)) -90}}deg)"></div> -->
<!-- 																	<div ng-if="story.viable" class="percent-text">{{story.confidence}}%</div> -->
<!-- 																	<div ng-if="!story.viable" class="percent-text">{{100-story.confidence}}%</div> -->
<!-- 																</div> -->
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="item margint-25" ng-repeat="sprintSet in storyDisplaySplit3" id="newCarouselItem" >
									<div class="row">
										<div class="col-md-3" ng-repeat="sprint in sprintSet" >
											<div class=" tile tile_new1">
												<div class="row">
													<div class="product-head">

														<div class="close-head" ng-if="(sprintMap.get(sprint.sprintId).releasePlannerStories == null) || (sprintMap.get(sprint.sprintId).releasePlannerStories.length == 0)"><a href="" ng-click="deleteSprint(sprint.sprintId, sprint.sprintName)"><img src="resources/images/close-icon.png" width="20" alt="close"/></a></div>
														<span class="product panel-title-text-sprint " title="{{sprint.sprintName}}">{{sprint.sprintName}}</span>
														<div class="col-md-12">
															<div class="row">
																<div class="col-md-12 font12 text-right"  style="font-size: 10px; padding-left: 0px;">{{sprint.startDate}} -
																	{{sprint.endDate}}</div>
															</div>
														</div>
													</div>
												</div>
												<div class="inner-box_block">
													<div class="progress">
														<div class="progress-bar"
															ng-style="sprint.mustHaveBarStyle" title="Must have Scope : {{sprint.mustHave}} Point(s)">
															<div class="label-txt">0</div>
														</div>
														<div class="progress-bar"
															ng-style="sprint.overAllScopeBarStyle" title="OverAll Scope : {{sprint.overAllScope + sprint.mustHave}} Point(s)">
															<div class="label-txt"
																ng-if="sprint.overAllScope!=0"></div>
														</div>
														<div ng-if="spring.tentativeVelocity <= spring.plannedVelocity" class="progress-bar bg-3"
															ng-style="sprint.unusedStoryPointBarStyle" >
															<div class="label-txt1"
																ng-if="sprint.unassignedStoryPoints!=0"></div>
														</div>
                                                        <div ng-if="sprint.tentativeVelocity < sprint.plannedVelocity" class="progress-bar bg-4 pointer_val"
                                                         ng-style="sprint.overRunMustHavePointBarStyle" title="Must have Scope : {{sprint.mustHave}} Point(s)">
                                                               <img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprint.tentativeVelocity/ sprint.plannedVelocity)*100)) | number : 0}}%"/>
                                                               <div class="label-txt1">{{sprint.tentativeVelocity}}</div>
                                                        </div>
                                                        <div ng-if="sprint.tentativeVelocity < sprint.plannedVelocity" class="progress-bar bg-5 pointer_val"
                                                         ng-style="sprint.overRunOverAllScopePointBarStyle" title="OverAll Scope : {{sprint.overAllScope + sprint.mustHave}} Point(s)">
                                                               <span ng-if="sprint.overRunMustHavePointBarStyle.width == 0"><img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprint.tentativeVelocity/ sprint.plannedVelocity)*100)) | number : 0}}%"/>
                                                               <div class="label-txt1">{{sprint.tentativeVelocity}}</div></span>
                                                        </div>
														<div class="label-txt2" >{{sprint.plannedVelocity}}</div>
													</div>
													<div class="product_row" ng-repeat="story in sprint.releasePlannerStories">
														<div class="row margint10">
															<div class="col-md-6 pull-left">
																<span class="dblue strong panel-title-textviability" title="{{story.storyId}}"> {{story.storyId}}  </span>
																<div class="row  margint5">
																		<span class="grey col-md-8" style="padding-right:0px;"><img width="12" src="resources/images/red1.png"
																				ng-if="story.storyPriority=='Critical'"> <img
																				width="12" src="resources/images/grey.png"
																				ng-if="story.storyPriority=='Unassigned'"> <img
																				width="12" src="resources/images/purple1.png"
																				ng-if="story.storyPriority=='High'"> <img
																				width="12" src="resources/images/yellow1.png"
																				ng-if="story.storyPriority=='Medium'"> <img
																				width="12" src="resources/images/green.png"
																				ng-if="story.storyPriority=='Low'"> <small>{{story.storyPriority}}</small></span>
																		<span class="col-md-4" style="padding-right:0px; padding-left:0px"><strong class="purple-txt">{{story.storyPoints}}</strong><strong class="purple-txt">SP</strong> </span>
																</div>
															</div>

															<div class="col-md-6 pull-right" style="padding-left: 0px">
																<div class="col-md-5 pull-left" style="padding-top:15%; padding-left:0px; padding-right: 0px">
																<a href="javascript:void(0);" class="pull-left anchor_icon dropdown-toggle" class="dropdown-toggle" data-toggle="dropdown"><img src="resources/images/menu_pop.png" width="17" class="text-left margin7" alt=""></a>
																<ul class="dropdown-menu option_drpdwn" role="menu" aria-labelledby="menu1">
																	<li role="presentation"><a  class="menu_style" role="menuitem" tabindex="-1" data-toggle="modal" data-target="" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, null, 'Product Backlog', story.storyPoints, story.storyPriority, story.confidence,story.viable)">Product Backlog</a></li>
																	<li role="presentation"><a class="menu_style"  role="menuitem" tabindex="-1" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, null, 'Release Backlog', story.storyPoints, story.storyPriority, story.confidence, story.viable)">Release Backlog</a></li>
																	<li role="presentation"><a class="menu_style" role="menuitem" tabindex="-1" href="" ng-repeat="sprintDetail in sprintDetails | filter:'!'+sprint.sprintName" ng-click="moveStory(story.storyId, sprint.sprintId, sprint.sprintName, sprintDetail[0], sprintDetail[1], story.storyPoints, story.storyPriority, story.confidence, story.viable)"><span title="{{sprintDetail[1]}}">{{sprintDetail[1]}}</span></a></li>																		
																</ul>
																<img src="resources/images/dependency-circle.png" class="pull-left" width="25" class="text-left margint5" alt="" ng-if='((story.storyDependentOn.length!=0) && (story.storyDependentOn!=null))'>
																</div>
																<div class="col-md-7" style="padding-left: 0px; padding-right: 0px; padding-top:7px">
																	<div id="{{story.storyId}}meter" confidence="{{story.confidence}}" viable="{{story.viable}}" class="gaugeTest" meterguage></div>
																</div>
<!-- 																<div id="gaugeDemo" ng-class="ConfidenceFilter(story)" > -->
<!-- 																	<div ng-if="story.viable" class="gauge-arrow" data-percentage="{{story.confidence}}" style="transform: rotate({{( 1.8 * story.confidence) -90}}deg)"></div> -->
<!-- 																	<div ng-if="!story.viable" class="gauge-arrow" data-percentage="{{100-story.confidence}}" style="transform: rotate({{( 1.8 * (100-story.confidence)) -90}}deg)"></div> -->
<!-- 																	<div ng-if="story.viable" class="percent-text">{{story.confidence}}%</div> -->
<!-- 																	<div ng-if="!story.viable" class="percent-text">{{100-story.confidence}}%</div> -->
<!-- 																</div> -->
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- Carousel code end-->

						</div>
					</div>

					<div class="row marginb25">
						<div class="col-md-12 text-right">
							<button class="btn map-btn cancel_margin" onclick="window.location.href='backlogScreen'"><< Back</button>
							<a href=""><button class="btn btn-primary moreBtn" ng-click="publish()">Publish</button></a>
						</div>

					</div>
				</div>
				<!-- /tile-wrap -->
			</div>
			<!-- /content-wrap -->
		</div>
		<!-- /wrap -->
		<footer class="footer text-center left_align"> &copy; 2001-2018 Accenture. All Rights Reserved. Accenture Confidential. For Internal Use Only. </footer>
	</div>
	<!-- /wrapper -->

	<div class="modal" tabindex="-1" role="dialog" id="myModal3">
		<div class="modal-dialog" role="document">
			<div class="modal-content option_popup">
				<div class="modal-header header_story">
					<h5 class="modal-title">Story Move</h5>
					<button type="button" class="close" title="Close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row margint10">
						<div class="col-md-12 pull-left">
							<span class="dblue strong"> {{storyMoveResponse.storyDetails[0].storyId}} </span>
							<div class="margint5">
								<div class="grey col-md-12">
									<div class="col-md-3 margin15t margin20t" style="padding-right:0px; padding-left:0px">
										<span ng-if="storyMoveResponse.storyDetails[0].storyPriority=='Critical'"><img width="12" src="resources/images/red1.png" > <small>Critical</small></span>
										<span ng-if="storyMoveResponse.storyDetails[0].storyPriority=='Unassigned'"><img width="12" src="resources/images/grey.png" > <small>Unassigned</small></span>
										<span ng-if="storyMoveResponse.storyDetails[0].storyPriority=='High'"><img width="12" src="resources/images/purple1.png" > <small>High </small></span>
										<span ng-if="storyMoveResponse.storyDetails[0].storyPriority=='Medium'"><img width="12" src="resources/images/yellow1.png" > <small>Medium </small></span>
										<span ng-if="storyMoveResponse.storyDetails[0].storyPriority=='Low'"><img width="12" src="resources/images/green.png" > <small>Low</small></span>
									</div>
									<div class="col-md-2 margin15t">
										<div class="row">
											<strong class="purple-txt">{{storyMoveResponse.storyDetails[0].storyPoints}} </strong>
											<strong class="purple-txt">SP</strong>
										</div>
									</div>
									<div class="col-md-2 margin15t" ng-if="storyMoveResponse.storyDetails[0].fromId != null">
										<div id="moveStorymeter" confidence="{{storyMoveResponse.storyDetails[0].confidence}}" viable="{{storyMoveResponse.storyDetails[0].viable}}" class="gaugeTest" ng-if="confirmationRequired" style="margin-top: -23px" meterguage>
										</div>
										
<!-- 										<div id="gaugeDemo" ng-class="ConfidenceFilter(storyMoveResponse.storyDetails[0])"> -->
<!-- 											<div ng-if="storyMoveResponse.storyDetails[0].viable" class="gauge-arrow" data-percentage="{{storyMoveResponse.storyDetails[0].confidence}}" style="transform: rotate({{( 1.8 * storyMoveResponse.storyDetails[0].confidence) -90}}deg)"></div> -->
<!-- 											<div ng-if="!storyMoveResponse.storyDetails[0].viable" class="gauge-arrow" data-percentage="{{100-storyMoveResponse.storyDetails[0].confidence}}" style="transform: rotate({{( 1.8 * (100-storyMoveResponse.storyDetails[0].confidence)) -90}}deg)"></div> -->
<!-- 											<div  ng-if="storyMoveResponse.storyDetails[0].viable" class="percent-text">{{storyMoveResponse.storyDetails[0].confidence}}%</div> -->
<!-- 											<div  ng-if="!storyMoveResponse.storyDetails[0].viable" class="percent-text">{{100-storyMoveResponse.storyDetails[0].confidence}}%</div> -->
<!-- 										</div> -->
									</div>
									<div class="col-md-4 margin15t text-left">
										<span class="stop_3" title="{{storyMoveResponse.storyDetails[0].fromName}}"> {{storyMoveResponse.storyDetails[0].fromName}}</span> - <span class="stop_3" title="{{storyMoveResponse.storyDetails[0].toName}}">{{storyMoveResponse.storyDetails[0].toName}} </span>
									</div>
								</div>


							</div>
						</div>
					</div>
					<br/>
					<div>
						<div class="story_list" ng-repeat="story in storyMoveResponse.storyDetails | limitTo: (1 - storyMoveResponse.storyDetails.length)">
							<div class="circle-blk">
								<img src="resources/images/dependency-circle.png" width="25" class="text-left margint5" alt=""><span style="color: rgb(102, 102, 102)"> <span class="stop_2" title="{{story.storyId}}">{{story.storyId}}</span> - <span class="stop_2" title="{{story.fromName}}">{{story.fromName}} </span>- <span class="stop_2" title="{{story.toName}}">{{story.toName}}</span></span>
							</div>
						</div>
					</div>
					<br/>
					<div class="row move_items" ng-if="storyMoveResponse.sprintChanges!=null && storyMoveResponse.sprintChanges.length!=0">
						<div class="col-md-6">&nbsp;Before Move</div>

						<div class="col-md-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After Move</div>
					</div>


					<div class="row move_sprint" ng-repeat="sprintDetail in storyMoveResponse.sprintChanges">
						<div class="col-md-2 product" title="{{sprintDetail.sprintName}}">{{sprintDetail.sprintName}}</div>
						<div class="col-md-5">
						    <div class="progress">
								<div class="progress-bar"
									ng-style="sprintDetail.before.mustHaveStyle" style="width:{{sprintDetail.before.mustHaveBarWidth}}%;" title="Must have Scope : {{sprintDetail.before.mustHavePoints}} Point(s)">
								<div class="label-txt">0</div>
								</div>
								<div class="progress-bar"
									ng-style="sprintDetail.before.overAllScopeStyle" title="OverAll Scope : {{sprintDetail.before.mustHavePoints + sprintDetail.before.overAllScopePoints}} Point(s)">
								</div>
								<div class="progress-bar bg-3"
									style="width:{{sprintDetail.before.unusedBarWidth}}%">
								</div>
								<div ng-if="sprintDetail.before.tentativeVelocity < sprintDetail.before.plannedVelocity" class="progress-bar bg-4 pointer_val"
									ng-style="sprintDetail.before.overRunMustHaveStyle" title="Must have Scope : {{sprintDetail.before.mustHavePoints}} Point(s)">
									<img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprintDetail.before.tentativeVelocity/ sprintDetail.before.plannedVelocity)*100)) | number : 0}}%"/>
                                    <div class="label-txt1">{{sprintDetail.before.tentativeVelocity}}</div>
								</div>
								<div ng-if="sprintDetail.before.tentativeVelocity < sprintDetail.before.plannedVelocity" class="progress-bar bg-5 pointer_val"
									ng-style="sprintDetail.before.overRunOverAllScopeStyle" title="OverAll Scope : {{sprintDetail.before.mustHavePoints + sprintDetail.before.overAllScopePoints}} Point(s)">
									<span ng-if="sprintDetail.before.overRunMustHaveStyle.width == 0"><img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprintDetail.before.tentativeVelocity/ sprintDetail.before.plannedVelocity)*100)) | number : 0}}%"/>
                                    <div class="label-txt1">{{sprintDetail.before.tentativeVelocity}}</div></span>
								</div>
								<div class="label-txt2">{{sprintDetail.before.plannedVelocity}}</div>
							</div>
						</div>
						<div class="col-md-5">
						    <div class="progress">
								<div class="progress-bar"
									ng-style="sprintDetail.after.mustHaveStyle" style="width:{{sprintDetail.after.mustHaveBarWidth}}%;" title="Must have Scope : {{sprintDetail.after.mustHavePoints}} Point(s)">
								<div class="label-txt">0</div>
								</div>
								<div class="progress-bar"
									ng-style="sprintDetail.after.overAllScopeStyle" title="OverAll Scope : {{sprintDetail.after.mustHavePoints + sprintDetail.after.overAllScopePoints}} Point(s)">
								</div>
								<div class="progress-bar bg-3"
									style="width:{{sprintDetail.after.unusedBarWidth}}%">
								</div>
								<div ng-if="sprintDetail.after.tentativeVelocity < sprintDetail.after.plannedVelocity" class="progress-bar bg-4 pointer_val"
									ng-style="sprintDetail.after.overRunMustHaveStyle" title="Must have Scope : {{sprintDetail.after.mustHavePoints}} Point(s)">
									<img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprintDetail.after.tentativeVelocity/ sprintDetail.after.plannedVelocity)*100)) | number : 0}}%"/>
                                    <div class="label-txt1">{{sprintDetail.after.tentativeVelocity}}</div>
								</div>
								<div ng-if="sprintDetail.after.tentativeVelocity < sprintDetail.after.plannedVelocity" class="progress-bar bg-5 pointer_val"
									ng-style="sprintDetail.after.overRunOverAllScopeStyle" title="OverAll Scope : {{sprintDetail.after.mustHavePoints + sprintDetail.after.overAllScopePoints}} Point(s)">
									<span ng-if="printDetail.after.overRunMustHaveStyle.width == 0"><img src="resources/images/pointer_val.png" style="right : {{(99 - ((sprintDetail.after.tentativeVelocity/ sprintDetail.after.plannedVelocity)*100)) | number : 0}}%"/>
                                    <div class="label-txt1">{{sprintDetail.after.tentativeVelocity}}</div></span>
								</div>
								<div class="label-txt2">{{sprintDetail.after.plannedVelocity}}</div>
							</div>
						</div>
<!-- 						<br> -->
<!-- 						<br> -->
<!-- 						<div class="img_grey"> -->
<!-- 							<img src="resources/images/menu_pop.png" /> -->
<!-- 						</div> -->
						
					</div>
				</div>
				<div class="modal-footer footer_border">
					<div class="col-md-12 text-right">
						<button class="btn map-btn cancel_margin" data-dismiss="modal">Cancel</button>
						<button class="btn btn-primary moreBtn" ng-click="moveConfirmed()">Confirm</button>
					</div>
				</div>
			</div>
		</div>
	</div>
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
</body>
</html>