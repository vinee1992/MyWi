<!DOCTYPE html>
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Agile Release Planner</title>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
<link href="resources/css/layout.css" rel="stylesheet" />
<link href="resources/css/custom_1.css" rel="stylesheet" />
<link href="resources/css/jquery-ui.min.css" rel="stylesheet" />
<link rel="stylesheet" href="resources/css/spinner-loading.css" />
<link href="resources/css/bootstrap-datepicker.min.css" rel="stylesheet" />

<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/bootstrap-datepicker.min.js"
	type="text/javascript"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js"></script>
<script src="resources/js/appService.js"></script>
<script src="resources/js/appController.js"></script>
<script type="text/javascript">
	//                     $(function() {
	//                         $( "#datepicker01 , #datepicker02 , #datepicker03 , #datepicker04" ).datepicker({ 
	//                             yearRange: '2017:c+1' ,
	//                             changeYear: true,
	//                             minDate: new Date(1999, 10 - 1, 25),
	//                             maxDate: '+30Y',
	//                         });
	//                     });

	//                     $( document ).ready(function() {
	//                         $('input:empty, textarea:empty').addClass('empty');

	// 					$('input').keyup(function () {
	// 					  if ($(this).val().trim() !== '') {
	// 					    $(this).removeClass('empty');
	// 					  } else {
	// 					    $(this).addClass('empty');
	// 					  }
	// 					});
	//                     });

	$(document).ready(function() {

		$('#buttonLogin').on('click', function(e) {

			$("#login_Box_Div").toggle();
			$(this).toggleClass();
		});
	});
</script>
</head>
<body ng-controller="releasePageController">
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
								<div class="user-toggle">
									<strong><%=userid%></strong>
								</div>
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
						<div class="scope-selector scope_margin">
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
				<div class="row tile-wrap tile_release">
					<div class="col-md-12 content-bg paddint0">
						<div class="content-header row margin_align">
							<form name="release-planning-form">
								<div class="row full_row">

									<div class="col-md-6 grey_bg padding_0">

										<div class="col-md-6 bdr_r_1_w field active field1">
											<input type="text" autocomplete="off"
												class="form-control input-sm header-input release1 empty"
												name="Release" id="Release" ng-model="release.releaseName"
												ng-blur="releaseNameChanged()"> <label for="Release"
												class="label-text">Release<sup class="text-danger">*</sup>:
											</label>
										</div>
										<div class="col-md-6 bdr_r_1_w field field_team field1">
											<input type="text" autocomplete="off" name="Team" id="Team"
												class="form-control input-sm header-input release1 empty"
												ng-model="release.team" ng-blur="releaseTeamNameChanged()">
											<label for="Team" class="label-text">Team <sup class="text-danger">*</sup>:</label>
										</div>

									</div>

									<div class="col-md-6 grey_bg padding_0">
										<div
											class="col-md-3 bdr_r_1_w field padding_left field1 sprint_duration">
											
				
				<div class="slidecontainer" style="width: 90%">
 				<input type="range" min="1" max="4" value="1" 
 				class="slider duration" name="sprintDuration" id="myRange" 
 				ng-change="releaseSprintDurationChanged()"
 				ng-model="release.sprintDuration" style="min-height:5px;height:12px;">
 					</div><span style="margin-left:95%;">{{release.sprintDuration}}</span>

         
            
											
											
											
											
											<label for="Sprint Duration">Sprint Duration(in weeks):</label>
											<!-- <select class="form-control input-sm header-input"
												ng-model="release.sprintDuration"
												ng-options="template.value as template.name for template in release.sprintDurations"
												name="sprintDuration"
												ng-change="releaseSprintDurationChanged()">
												<option value="1" style="color: rgb(0, 0, 0)">1</option>
												<option value="2" style="color: rgb(0, 0, 0)">2</option>
												<option value="3" style="color: rgb(0, 0, 0)">3</option>
												<option value="4" style="color: rgb(0, 0, 0)">4</option>
											</select> 
									 -->	</div>
										<div class="col-md-7 bdr_r_1_w padding_0 sprint_type_style">
											<label class="margint5 sprint_type">Sprint Type :</label>
											<div class="sprint_options">
											
												<button id="sprint0" class="button" 
												value="Sprint 0" ng-model="release.sprint0" ng-class="release.sprint0?'button4':'button3'"
													 ng-click="releaseSprintTypeChanged($event)">Sprint 0</button>
	
												<button class="button button4 button_l4" id="dev_sprint"
													value="Dev Sprint">Sprints 1 - N</button>

												<button class="button  button_l4" id="hardening" ng-class="release.sprintHardening?'button4':'button3'"
													value="Hardening" ng-model="release.sprintHardening"
													ng-click="releaseSprintTypeChanged($event)">Hardening</button>

												<button class="button button_l4" id="deploy" ng-class="release.sprintDeploy?'button4':'button3'"
													value="Deploy" ng-model="release.sprintDeploy"
													ng-click="releaseSprintTypeChanged($event)">Deploy</button>

												
											</div>


											<!-- <div class="sprint_options">
												<label class="checkbox-inline sprint-radio1"><input
													type="checkbox" id="checkbox1" value="Sprint 0"
													class="checkbox_style" ng-model="release.sprint0"
													ng-change="releaseSprintTypeChanged()">Sprint 0</label> <label
													style="padding-left: 0px;"
													class="checkbox-inline sprint-radio1"><input
													type="checkbox" id="checkbox2" value="Sprint 1-N"
													class="checkbox_style" checked ng-disabled="true">Sprints
													1 - N</label> <label style="padding-left: 0px;"
													class="checkbox-inline sprint-radio1"><input
													type="checkbox" id="checkbox3" value="Sprint Hardening"
													class="checkbox_style" ng-model="release.sprintHardening"
													ng-change="releaseSprintTypeChanged()">Hardening</label> <label
													style="padding-left: 0px;"
													class="checkbox-inline sprint-radio1"><input
													type="checkbox" id="checkbox4" value="Sprint Deploy"
													class="checkbox_style" ng-model="release.sprintDeploy"
													ng-change="releaseSprintTypeChanged()">Deploy</label>

											</div>
 -->										</div>
									</div>

								</div>
							</form>

							<div class="border-horizontal"></div>

							<form name="release-planning-form release_b">

								<div class="row full_row1">
									<div class="col-md-6 grey_bg padding_0">

										<div class="col-md-3 bdr_r_1_w field calendar_position field1">
											<input autocomplete="off" "text" releaseplannerdatepicker
												name="startDate" class="form-control input-sm header-input"
												id="datepicker01" ng-model="release.startDate"
												ng-change="releaseStartDateChanged()"
												onkeydown="return false" /> <label for="Start Date"
												style="margin-bottom: 20px;">Start Date<sup
												class="text-danger">*</sup>:
											</label> <span class="custom_icon"
												ng-click="showDateCalendar('datepicker01')"> <span
												class="glyphicon glyphicon-calendar"></span>
											</span>
										</div>
										<div class="col-md-3 bdr_r_1_w field calendar_position field1">
											<input autocomplete="off" type="text"
												releaseplannerdatepicker name="endDate"
												class="form-control input-sm header-input" id="datepicker02"
												ng-model="release.endDate"
												ng-change="releaseEndDateChanged()" /> <label
												for="End Date" style="margin-bottom: 20px;">End
												Date:</label> <span class="custom_icon"
												ng-click="showDateCalendar('datepicker02')"> <span
												class="glyphicon glyphicon-calendar"></span>
											</span>
										</div>

										<div class="col-md-3 bdr_r_1_w field field1">
											<input type="text" name="Planned Velocity" autocomplete="off"
												id="PlannedVelocity" style="width: 100%; font-size: 15px;"
												class="form-control input-sm header-input release1 empty"
												ng-model="release.plannedVelocity"
												ng-blur="releasePlannedVelocityChanged()"> <label
												for="PlannedVelocity" class="label-text">Planned
												Velocity<sup class="text-danger">*</sup>:</label>
										</div>
										<div class="col-md-3 bdr_r_1_w field field1">
<!-- 											<input type="text" name="Velocity Trend" id="VelocityTrend" -->
<!-- 												style="width: 100%; font-size: 15px;" autocomplete="off" -->
<!-- 												class="form-control input-sm header-input release1 empty" -->
<!-- 												ng-model="release.velocityTrend" -->
<!-- 												ng-blur="releaseVelocityTrendChanged()">  -->
										<div class="slidecontainer" style="width: 90%">
 										<input type="range" min="0" max="100" value="1" 
 										class="slider duration" name="sprintDuration" id="myRange" 
 										ng-change="releaseVelocityTrendChanged()"
 										ng-model="release.velocityTrend" style="min-height:5px;height:12px;">
 										</div><span style="margin-left:95%;">{{release.velocityTrend}}</span>

												<label
												for="VelocityTrend " class="label-text">Velocity Increment(%):</label>
										</div>

									</div>

									<div class="col-md-6 release_upload padding_0">
										<label for="Release Data Upload" class="label-text">Release
											Data Upload :</label> <input type="file" id="productBacklogFile"
											size="50" name="file"> <a
											href="/releaseplanner/resources/UploadTemplate.xlsx"
											class="pull-right"> <img
											src="resources/images/download_white.png" width="15" />Download
											Template
										</a>
										<button class="button upload_file" ng-click="uploadFile()">Upload</button>
										<div class="filename filenameDisp" title="{{filename}}">
                                            <span> File Uploaded: <br/> {{filename}} </span>
                                    	</div>
									</div>
									
								</div>
							</form>

						</div>
						<a class="pull-right go_link" ng-click="saveRelease()"
							style="margin-bottom: -80px;"> <img class=""
							src="resources/images/go_button.png" width="55" alt="#"></a>

					</div>
				</div>

				<div class="row">
					<div
						ng-repeat="releasePlannerSprint in releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints">
						<div class="col-md-3">
							<div class="panel panel-default box1">
								<div class="panel-heading">
									<input type="text" class="input_sprint input-sm"
										ng-model="releasePlannerSprint.sprintName">
								</div>
								<div class="panel-body">
									<div class="row">
										<div class="col-md-6">
											<div class="input-group date width100">
												<input autocomplete="off" style="color: rgb(0, 0, 0)"
													type="text" releaseplannerdatepicker style="width:84%"
													name="sprintStartDate"
													class="form-control input-sm header-input grey_1"
													id="datepickerSprint{{$index}}StartDate"
													ng-model="releasePlannerSprint.startDate"
													ng-change="sprintDateChanged({{$index}}, 'start')"
													onkeydown="return false" /> <span
													class="input-group-addon"
													ng-click="showDateCalendar1($index, 'StartDate')"> <span
													class="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
										</div>
										<div class="col-md-6">
											<div class="input-group date width100">
												<input autocomplete="off" style="color: rgb(0, 0, 0)"
													type="text" releaseplannerdatepicker style="width:84%"
													name="sprintEndDate"
													class="form-control input-sm header-input grey_1"
													id="datepickerSprint{{$index}}EndDate"
													ng-model="releasePlannerSprint.endDate"
													ng-change="sprintDateChanged({{$index}}, 'end')"
													onkeydown="return false" /> <span
													class="input-group-addon"
													ng-click="showDateCalendar1($index, 'EndDate')"> <span
													class="glyphicon glyphicon-calendar"></span>
												</span>
											</div>
										</div>
									</div>
									<div class="row margint10"
										ng-if="releasePlannerSprint.sprintType=='Development Sprint'">
										<div class="col-md-12 marginb10 margint5">
											<span class="val-text pull-left">0</span><input type="text"
												ng-model="releasePlannerSprint.plannedVelocity"
												style="width: 15%; float: right; margin-right: 2px"
												ng-change="onSprintPlannedVelocityChange()"></input>
										</div>
										<div class="col-md-12">
											<div class="slidecontainer">
												<input type="text" min="1" max="100" class="slider"
													id="myRange" onkeydown="return false" disabled="disabled">
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
						<div class="col-md-6 text-right">
							<b style="color: rgb(251, 181, 0); text-align: right"
								ng-if="changesSavedMessage">Saved
								Successfully&nbsp&nbsp&nbsp&nbsp</b>
							<button ng-show="releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length>0" class="btn btn-default btn-blue sa-su"
								ng-click=saveUpdatedSprintData()>Save</button>
							<button ng-show="releasePlannerProject.releasePlannerReleases[0].releasePlannerSprints.length>0"
								ng-class="navigateToNextScreen == false ? 'btn disabled btn-default sa-su' : 'btn map-btn'"
								ng-click="navigateToBacklogScreen()">Next &Gt;</button>
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
											<div class="col-md-12">
												<img src="resources/images/question.png" alt=""
													class="img-responsive">
											</div>
										</div>
										<div class="col-md-8">
											<p class="popup_text_height" id="p2"></p>
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
											<p>UNSAVED DATA WILL BE LOST. DO YOU WISH TO CONTINUE?</p>
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
	</div>
	<!-- /wrap -->
	<footer class="footer text-center"> 
	&copy; 2001-2018
		Accenture. All Rights Reserved. Accenture Confidential. For Internal
		Use Only. </footer>
	</div>
	<!-- /wrapper -->



</body>
</html>