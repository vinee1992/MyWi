<!DOCTYPE html>
<html lang="en" ng-app="releasePlannerApp">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Accenture mywizard</title>
		<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
		<link href="resources/css/layout.css" rel="stylesheet" />
		<link href="resources/css/custom.css" rel="stylesheet" />
		<link href="resources/css/bootstrap-datepicker.min.css" rel="stylesheet" />
		 <link href="resources/css/jquery-ui.min.css" rel="stylesheet" />
		<script src="resources/js/jquery.min.js"></script>
		<script src="resources/js/bootstrap.min.js"></script>
		<script src="resources/js/bootstrap-datepicker.min.js" type="text/javascript"></script>
		<script src="resources/js/angular.js"></script>
		<script src="resources/js/angular-route.js"></script>
		<script src="resources/js/app.js"></script>
		<script src="resources/js/appService.js"></script>
		<script src="resources/js/appController.js"></script> 
		
                <link href="resources/css/progress-circle.css" rel="stylesheet" />
               
        </head>
        <body ng-controller="sprintPageController">
		<div class="wrapper">
			<div class="wrap">
				<header class="container-fluid header">
					<div class="row">
						<div class="header-col col-xs-12 col-sm-4 branding">
							<img src="resources/images/logo_accenture_old.png" alt="Accenture Technology" class="img-responsive" />
						</div>
					</div>
				</header>
				<!-- /header -->
				<nav class="nav-bar navbar-default">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-menu" aria-expanded="false">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div id="navbar-menu" class="collapse navbar-collapse">
						<div class="navbar-right col-xs-12 col-sm-6">
							<div class="scope-selector">
							<div class="scope-selector-toggle"
															title="Client Name | Engagement Name | Project Name">
							
								<div>
									<%@ page import="com.accenture.automation.authentication.UserDetails"%>
									<%
										UserDetails userDetails = (UserDetails)session.getAttribute("userDetails");
									
										String projectName = userDetails.getProjectName();
										String clientName = userDetails.getClientName();
										String engagementName = userDetails.getEngagementName();
										
										String projectId = (String) session.getAttribute("receivedProjectId");
										String enterpriseId = (String) session.getAttribute("receivedEnterpriseId");

									%>
								
									<span><%=clientName %></span><span><%=engagementName %></span><span><%=projectName %></span>
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
								<a class="back-link" href="" onclick="confirmToMoveToDashbaord('/releaseplanner/dashboard?enterpriseId=<%=enterpriseId%>&endToEndUId=<%=projectId%>')" style="color:rgb(99,184,255)"><span class="glyphicon glyphicon-menu-left" style="color:rgb(99,184,255)"></span>Back</a>
								<span style="color:rgb(0,0,0)">Release Planning</span>
							</h1>
						</div>
						</div>
					<div class="row tile-wrap">
                                           <!-- <div class="col-md-12">
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="20" src="resources/images/stand-up.png" alt=""></span> Stand-Up Analyst</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="23" src="resources/images/retrospective.png" alt=""></span> Retrospective assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="22" src="resources/images/report.png" alt=""></span> Report Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="24" src="resources/images/sprint.png" alt=""></span> Sprint Planning</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="18" src="resources/images/backlog-assistant.png" alt=""></span> Backlog Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="stand_active"><span class="glyphicon"><img width="18" src="resources/images/release.png" alt=""></span> Release Planning</span></div>
                                            </div>  --> 
					<div class="col-md-12 content-bg paddint0">
                                            <div class="content-header row">
                                                <div class="col-md-2 bdr_r_1_w">
                                                    <label class="margint5">Release <sup class="text-danger">*</sup> :</label>
                                   
                                                    <input class="form-control input-sm header-input width100" ng-model="releasePlannerProject.releasePlannerReleases[0].releaseName" id="releaseNameId" ng-blur="releaseNameChanged()"> 
                                                     </input>
                                                </div>
                                              
                                                <div class="col-md-3 bdr_r_1_w">
                                                    <div class="row">
                                                   <div class="col-md-6">
                                                   <label class="margint5">Start Date<sup class="text-danger">*</sup> :</label>
                                                   <div class="input-group date width100">
                                                        <input type="text" releaseplannerdatepicker class="form-control input-sm header-input" style="width:85%" name ="startDate" id="datepicker01" ng-model="releasePlannerProject.releasePlannerReleases[0].startDate" ng-change="releaseStartDateChanged()"  onkeydown="return false"/>
                                                        <span class="input-group-addon custom_icon" style="width:0%; float:left" ng-click="showDateCalendar('datepicker01')">
                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="margint5">End Date<sup class="text-danger">*</sup> :</label>
                                                    <div class="input-group date width100">
                                                        <input type="text" releaseplannerdatepicker class="form-control input-sm header-input" style="width:85%" name ="endDate" id="datepicker02" ng-model="releasePlannerProject.releasePlannerReleases[0].endDate" ng-change="releaseEndDateChanged()" onkeydown="return false"/>
                                                        <span class="input-group-addon custom_icon" style="width:0%; float:left" ng-click="showDateCalendar('datepicker02')">
                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                 </div>
                                                </div>
                                                <div class="col-md-2 bdr_r_1_w">
                                                    <label class="margint5">Sprint Duration :</label>
                                                    <select id="releasePlannerSprintDurationId" class="form-control input-sm width100 header-input" ng-model="releasePlannerProject.releasePlannerReleases[0].sprintDuration" ng-change="releaseSprintDurationChanged()">
                                                      <option value="1" style="color : rgb(0,0,0)">1 week</option>
                                                      <option value="2" style="color : rgb(0,0,0)">2 weeks</option>
                                                      <option value="3" style="color : rgb(0,0,0)">3 weeks</option>
                                                      <option value="4" style="color : rgb(0,0,0)">4 weeks</option>
                                                    </select>
                                                </div>
                                               <div class="col-md-3 bdr_r_1_w">
                                               
                                                    <label class="margint5">Sprint Type :</label><br>
                                                    <div class="margint5">
                                                     <label id="checkbox1" class="checkbox-inline sprint-radio1"><input type="checkbox" value="" ng-model="releasePlannerProject.releasePlannerReleases[0].sprint0" ng-change="releaseSprintTypeChanged()">Sprint 0</label>
                                                     <label id="checkbox4" class="checkbox-inline sprint-radio1"><input type="checkbox"  value="Sprints 1 to N" checked ng-disabled="true" > Sprints 1 - N </label>
                                                     <label id="checkbox2" class="checkbox-inline sprint-radio1"><input type="checkbox" value="" ng-model="releasePlannerProject.releasePlannerReleases[0].sprintHardening" ng-change="releaseSprintTypeChanged()">Hardening</label>
                                                     <label id="checkbox3" class="checkbox-inline sprint-radio1"><input type="checkbox" value="" ng-model="releasePlannerProject.releasePlannerReleases[0].sprintDeploy" ng-change="releaseSprintTypeChanged()">Deploy</label>
                                                     
                                                </div></div>
                                                
                                                
                                                <div class="col-md-2">
                                                    <div class="row">
                                                    <div class="col-md-8">
                                                    <label class="margint5">Team<sup class="text-danger">*</sup> :</label>
                                                    <input class="form-control input-sm width100 header-input" ng-model="releasePlannerProject.releasePlannerReleases[0].team" ng-blur="releaseTeamNameChanged()">
                                                      </input>
                                                </div>
                                                <div class="col-md-4" ng-click ="updateSprintData()">
                                                    <a href="#"> <img class="margint10" src="resources/images/go_button.png" width="50" alt="#"></a>
                                                </div>
                                                </div></div>
                                            </div>
                                            <div class="row">
                                              <div ng-repeat= "releasePlannerSprint in releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints">
                                                <div class="col-md-3">
                                            <div class="panel panel-default box1">
                                                <div class="panel-heading">
                                                   <input type="text" class="input_sprint input-sm" ng-model="releasePlannerSprint.sprintName">
                                                </div>
                                                <div class="panel-body">
                                                <div class="row">
                                                   <div class="col-md-6">
                                                   <div class="input-group date width100">
                                                        <input style="color:rgb(0,0,0)" type="text" releaseplannerdatepicker style="width:84%" name ="sprintStartDate" class="form-control input-sm header-input grey_1" id="datepickerSprint{{$index}}StartDate" ng-model="releasePlannerSprint.startDate" ng-change="sprintDateChanged({{$index}}, 'start')" onkeydown="return false"/>
                                                     <span class="input-group-addon" ng-click="showDateCalendar1($index, 'StartDate')">
                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                     </span>
                                                    </div>
                                                 </div>
                                                 <div class="col-md-6">
                                                    <div class="input-group date width100">
                                                        <input style="color:rgb(0,0,0)" type="text" releaseplannerdatepicker style="width:84%" name ="sprintEndDate" class="form-control input-sm header-input grey_1" id="datepickerSprint{{$index}}EndDate" ng-model="releasePlannerSprint.endDate" ng-change="sprintDateChanged({{$index}}, 'end')" onkeydown="return false"/>
                                                         <span class="input-group-addon" ng-click="showDateCalendar1($index, 'EndDate')">
                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                    </div>
                                                 </div>
                                                 </div>
                                                    <div class="row margint10" ng-if="releasePlannerSprint.sprintType=='Development Sprint'">
                                                        <div class="col-md-12 marginb10 margint10">
                                                            <span class="val-text pull-left">0</span><input type="text" ng-model="releasePlannerSprint.plannedVelocity" style="width:15%;float:right;margin-right:2px" ng-change="onSprintPlannedVelocityChange()"></input>
                                                        </div>
                                                        <div class="col-md-12">
                                                        <div class="slidecontainer">
                                                           <input type="text" min="1" max="100" class="slider" id="myRange" onkeydown="return false" disabled="disabled">
                                                      </div>
                                                            <p class="grey margint5 text-center">Planned Velocity</p>
                                                        </div>
                                                    </div>   
                                                </div>
                                            </div>
                                            </div>
                                                </div>
                                                
                                                
                                        <div class="col-md-12 pull-right marginb15 margint10 text-right">
                                        	<div class="col-md-6 text-right"></div>
                                        	<div class="col-md-6 text-right" >
												<b style="color : rgb(251,181,0); text-align : right"  ng-if="changesSavedMessage">Saved Successfully&nbsp&nbsp&nbsp&nbsp</b>
												<button class="btn btn-default btn-blue sa-su" ng-click=saveUpdatedSprintData()>Save</button>
                                            	<button ng-class="navigateToNextScreen == false ? 'btn disabled btn-default sa-su' : 'btn map-btn'" ng-click="navigateToBacklogScreen()">Next &Gt;</button> 
											</div>
                                        </div>
                                            </div>        
                                        </div>
					</div>
					<!-- /tile-wrap -->
				</div>
				<!-- /content-wrap -->
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
                          
                        <div class="col-md-4 margint25">
                            <div id="myModal1" class="modal fade" role="dialog">
                            
                                <div class="modal-dialog1">
                                <div class="vertical-alignment-helper">
        							<div class="modal-dialog vertical-align-center">
                                    <!-- Modal content-->
                                    <div class="modal-content">
                                        <div class="modal-header head1">
                                            <a class="close1" data-dismiss="modal">&times;</a>
                                            <h4 class="modal-title">Suggestion</h4>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row">
                                                <div class="col-md-4 ">
                                                    <div class="col-md-12"><img src="resources/images/question.png" alt="" class="img-responsive"></div>
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="popup_text_height" id="p2"></p>
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
                                                    <div class="col-md-12"><img src="resources/images/mark.png" alt="" class="img-responsive"></div>
                                                </div>
                                                <div class="col-md-8">
                                                    <p>UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?
                                                        </p>
                                                    <div class="col-md-12"><div class="row">
                                                        <button type="button" class="btn pull-right btn-primary moreBtn ok pull-right" data-dismiss="modal">Cancel</button>
                                                        <button type="button" class="btn pull-right btn-primary moreBtn ok marginr10 pull-right" data-dismiss="modal" onclick="window.location.href='/releaseplanner/dashboard?enterpriseId=<%=enterpriseId%>&endToEndUId=<%=projectId%>'" >OK</button>
                                                    </div></div>
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
                   
			<!-- /wrap -->
			<footer class="footer text-center">
				&copy; 2001-2016 Accenture. All Rights Reserved. Accenture Confidential. For Internal Use Only.
			</footer>
		</div>
		<!-- /wrapper -->
	</body>
</html>