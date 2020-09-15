<%
	String projectId = (String) session.getAttribute("receivedProjectId");
	String enterpriseId = (String) session.getAttribute("receivedEnterpriseId");
%>

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
<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js"></script>
<script src="resources/js/appService.js"></script>
<script src="resources/js/appController.js"></script>
<link href="resources/css/jquery-ui.min.css" rel="stylesheet" />
<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
</head>
<body ng-controller="ReleasePublishController">
									<%@ page import="com.accenture.automation.authentication.UserDetails"%>
									<%
										UserDetails userDetails = (UserDetails)session.getAttribute("userDetails");
									
										String projectName = userDetails.getProjectName();
										String clientName = userDetails.getClientName();
										String engagementName = userDetails.getEngagementName();
										
										String userid = userDetails.getUserid();
									%>
								
	<div class="wrapper">
		<div class="wrap">
			<header class="container-fluid header">
				<div class="row">
					<div class="header-col col-xs-12 col-sm-4 branding">
						<img src="resources/images/logo_accenture_old.png"
							alt="Accenture Technology" class="img-responsive" />
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
					<button type="button" class="navbar-toggle collapsed"
						data-toggle="collapse" data-target="#navbar-menu"
						aria-expanded="false">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
				</div>
				<div id="navbar-menu" class="collapse navbar-collapse">
				<div class="navbar-left agilerelease_title col-sm-6">Agile Release Planner</div>
					<div class="navbar-right col-xs-12 col-sm-6">
						<div class="scope-selector">
							<div class="scope-selector-toggle"
								title="Client Name | Engagement Name | Project Name">
																<div>
									<span><%=clientName %></span><span><%=engagementName %></span><span><%=projectName %></span>
								</div>

							</div>
						</div>
					</div>
				</div>
			</nav>
			<!-- /nav bar -->

			<div class="content-wrap container-fluid">
				<!-- <div class="row page-title">
					<div class="col-xs-9">
						<h1 class="text-left">
							<a class="back-link" href="manage.html"><span
								class="glyphicon glyphicon-menu-left"></span>Back</a> Release
							Planning
						</h1>
					</div>
				</div>  -->
				<div class="row tile-wrap">
					<!-- <div class="col-md-12">
						<div class="col-md-2 stand-text">
							<span class="glyphicon"><img width="20"
								src="resources/images/stand-up.png" alt=""></span> Stand-Up
							Analyst
						</div>
						<div class="col-md-2 stand-text">
							<span class="glyphicon"><img width="23"
								src="resources/images/retrospective.png" alt=""></span>
							Retrospective assistant
						</div>
						<div class="col-md-2 stand-text">
							<span class="glyphicon"><img width="22"
								src="resources/images/report.png" alt=""></span> Report Assistant
						</div>
						<div class="col-md-2 stand-text">
							<span class="glyphicon"><img width="24"
								src="resources/images/sprint.png" alt=""></span> Sprint Planning
						</div>
						<div class="col-md-2 stand-text">
							<span class="glyphicon"><img width="18"
								src="resources/images/backlog-assistant.png" alt=""></span>
							Backlog Assistant
						</div>
						<div class="col-md-2 stand-text">
							<span class="stand_active"><span class="glyphicon"><img
									width="18" src="resources/images/release.png" alt=""></span>
								Release Planning</span>
						</div>
					</div> -->
					<div class="col-md-12 content-bg paddint0">
					<div class="row">
                            <div class="content-header col-md-12">
                                 
                                <div class="col-md-6"><div class="row">
                                <span class="publish"><strong>Publish</strong></span>
                                </div>
                                </div>
                                <div class="col-md-6 text-right">
                                 <span ><strong class="plan text-right">Release Plan Generated Successfully</strong></span>
                                    <big><span class="glyphicon glyphicon-remove remove" title="Close" onclick="window.location.href='/releaseplanner/dashboard?action=back'"></span></big>
                                </div>
                            </div></div>
						<!-- <div class="content-header row">
							<p class="publish">
								<strong>Publish</strong>
							</p>
						</div>  -->
						<div class="">
							<table class="table table-custom table-custom2 margint15"
								cellspacing="0">
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th class="text-center"
											ng-repeat="sprint in projectResponse.releasePlannerReleases[0].releasePlannerSprints"
											id="sprintName" title="{{sprint.sprintName}}"><small class="stop_1  panel_style">{{sprint.sprintName}} </small></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Start Date</td>
										<td class="text-center"
											ng-repeat="sprint in projectResponse.releasePlannerReleases[0].releasePlannerSprints">{{sprint.startDate}}
										</td>
									</tr>
									<tr>
										<td>Planned Velocity</td>
										<td class="text-center"
											ng-repeat="sprint in projectResponse.releasePlannerReleases[0].releasePlannerSprints">
											<div
												ng-if="(sprint.sprintType!='Sprint 0') && (sprint.sprintType!='Sprint Deploy') && (sprint.sprintType!='Sprint Hardening')">
												<div class="row vale">
													<div class="col-md-6 pull-left text_yellow">
														<strong>{{sprint.scopeUtilized}}</strong>
													</div>
													<div class="col-md-6 pull-right val_right">{{sprint.plannedVelocity}}</div>
												</div>
												<div class="col-md-12"
													>
													<!-- <div style="width: 100%; background-color: #bbb;">
														<div style="width: {{barWidth}}% height: 8px; background-color:rgb(251,181,0);"
															></div>
													</div>  -->
													<div id="myProgress">
                                    				<div id="myBar" ng-style="sprint.scopeUtilizedBar"></div></div>
													 
												</div>
											</div>
										</td>
									</tr>
									<tr ng-repeat="i in maxNumberOfStoriesInASprintRange">
										<td class="text-center">&nbsp;</td>
										<td class="text-center"
											ng-repeat="sprint in projectResponse.releasePlannerReleases[0].releasePlannerSprints">
											<span class="panel-title-text" ng-if="sprint.releasePlannerStories[i]" style="width: 165px" title="Story{{sprint.releasePlannerStories[i].storyId}}">Story
												{{sprint.releasePlannerStories[i].storyId}}</span>
										</td>

									</tr>
								</tbody>
							</table>
						</div>
						
						<div class="row marginb25">
							<div class="col-md-6">
								<button class="btn btn-default btn-blue sa-su" ng-click="downloadPublishedReleasePlan()">Download Release Plan</button>
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
                                                    <div class="col-md-12"><img src="resources/images/mark.png" alt="" class="img-responsive"></div>
                                                </div>
                                                <div class="col-md-8" >
                                                    <p class="popup_text_height" id="p1">
                                                    </p>
                                                    <button type="button" class="btn  pull-right btn-primary moreBtn ok" data-dismiss="modal">OK</button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
						</div>
                     </div>
                     </div>
                     
		<footer class="footer text-center"> &copy; 2001-2018
			Accenture. All Rights Reserved. Accenture Confidential. For Internal
			Use Only. </footer>
	</div>
</body>
</html>