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
		<!-- <link href="resources/css/jquery-ui.min.css" rel="stylesheet" />  -->
		<link href="resources/css/bootstrap-datepicker.min.css" rel="stylesheet" />
		
		
		<script src="resources/js/jquery.min.js"></script>
		<script src="resources/js/bootstrap.min.js"></script>
		<script src="resources/js/jquery.min.js"></script>
		<script src="resources/js/bootstrap.min.js"></script>
        <script src="resources/js/bootstrap-datepicker.min.js" type="text/javascript"></script>
		<script src="resources/js/angular.js"></script>        
		<script src="resources/js/angular-route.js"></script>
		<script src="resources/js/app.js"></script>
		<script src="resources/js/appService.js"></script>
		<script src="resources/js/appController.js"></script> 
		
		
                
      <script type='text/javascript'>
      </script>          
	</head>
	<body>
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
								<div class="scope-selector-toggle" title="Client Name | Engagement Name | Project Name">
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
                                           <!--  <div class="col-md-12">
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="20" src="resources/images/stand-up.png" alt=""></span> Stand-Up Analyst</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="23" src="resources/images/retrospective.png" alt=""></span> Retrospective assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="22" src="resources/images/report.png" alt=""></span> Report Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="24" src="resources/images/sprint.png" alt=""></span> Sprint Planning</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="18" src="resources/images/backlog-assistant.png" alt=""></span> Backlog Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="stand_active"><span class="glyphicon"><img width="18" src="resources/images/release.png" alt=""></span> Release Planning</span></div>
                                            </div>  -->
					<div class="col-md-12 content-bg">
                                           <form name="processForm" ng-submit="saveReleaseData()" class="form-inline grey"  ng-controller="newlyReleaseController" >
                                            <div class=" col-md-8 marginb15 margint10">
                                                <div class="col-md-2 text-right">
                                                   <label class="margint5" >Release<sup class="text-danger">*</sup></label>
                                             
                                                </div>
                                                 <div class="col-md-8">
                                                     <input type="text" class="form-control width100" ng-model="release.releaseName" name="releaseName"  required >
                                                     
                                                 </div>
                                            </div>
                                         <div class=" col-md-8 margint15 marginb15">
                                                <div class="col-md-2 text-right">
                                                   <label class="margint5">Start Date<sup class="text-danger">*</sup></label>
                                                </div>
                                                 <div class="col-md-4">
                                                     <!--<input type="text" class="form-control input-sm width100">-->
                                                     <div class="input-group date width100" >
                                                     
                                                        <input type="text" class="form-control" releaseplannerdatepicker id="datepicker" placeholder="start date"  ng-model="release.startDate" name ="startDate"
                                                         required required onkeydown="return false"/>
                                                        <span  class="input-group-addon" ng-click="showDateCalendar('datepicker')">
                                                            <span  class="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                    </div>
                                                 </div>
                                                <div class="col-md-2 text-right">
                                                    <label class="margint5">End Date<sup class="text-danger">*</sup></label>
                                                </div>
                                                 <div class="col-md-4">
                                                     <!--<input type="text" class="form-control input-sm width100">-->
                                                     <div class="input-group date width100" >
                                                        <input type="text" class="form-control" releaseplannerdatepicker id="datepicker1" placeholder="end date" ng-model="release.endDate" name ="endDate" required onkeydown="return false"/>
                                                        <span class="input-group-addon" ng-click="showDateCalendar('datepicker1')">
                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                    </div>
                                                 </div>
                                            </div>
                                             
                                            <div class=" col-md-8 margint15 marginb20">
                                                <div class="col-md-2 text-right">
                                                   <label class="margint5">Sprint Duration</label>
                                                </div>
                                                 <div class="col-md-4">
                                                    <select class="form-control width100"  ng-model="release.sprintDuration" ng-options="template.value as template.name for template in release.sprintDurations" name ="sprintDuration" >
                                                    </select>
                                                    
                                                 </div>
                                                
                                                <div class="col-md-2 text-right">
                                                   <label class="margint5" >Team<sup class="text-danger">*</sup></label>
                                                </div>
                                                 <div class="col-md-4">
                                                     <input type="text" class="form-control width100" ng-model="release.team" name ="team" placeholder="enter team"  required>
                                                 </div>
                                            </div>
                                               
                                                 <div class=" col-md-8 margint15 marginb20">
                                                <div class="col-md-2 text-right">
                                                   <label class="margint5"  >Sprint Type</label>
                                                </div>
                                                 <div class="col-md-8">
                                                <!--    <a class="sprint" href="#"> Sprint 0 </a>
                                                      <a class="sprint" href="#"> Deploy </a> 
                                                      <a class="sprint" href="#"> Post Deploy </a> -->   
                                                     <label><input type="checkbox" id="checkbox1" value="Sprint 0" ng-model="release.sprint0"  > Sprint 0 </label>
                                                     <label><input type="checkbox" id="checkbox4" value="Sprints 1 to N" checked ng-disabled="true"> Sprints 1 - N </label>
                                                     <label><input type="checkbox" id="checkbox3" value="Sprint Hardening" ng-model="release.sprintHardening" > Hardening </label> 
                                                     <label><input type="checkbox" id="checkbox2" value="Deploy" ng-model="release.sprintDeploy" > Deploy </label>
                                                      
  
                                                 </div>
                                            </div>   
                                             
                                            <div class=" col-md-5 margint25 marginb10">
                                                <button ng-disabled="processForm.$invalid" ng-class="processForm.$invalid ? 'col-md-offset-2 btn btn-primary moreBtn disabled' : 'col-md-offset-2 btn btn-primary moreBtn'" type="submit" value="Submit">Submit</button>
                                            </div>  
                                             
                                          </form> 
                                          </div>
										   </div> 
										  
                                        </div>
										
					</div>
					<!-- /tile-wrap -->
				
				<!-- /content-wrap -->
			
			<!-- /wrap -->
			 <div class="col-md-4 margint25">
                            <div id="myModal" class="modal fade" role="dialog">
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
                        <div class="col-md-4 margint25">
                            <div id="myModal1" class="modal fade" role="dialog">
                            
                                <div class="modal-dialog1">
                                <div class="vertical-alignment-helper">
        							<div class="modal-dialog vertical-align-center">
                                    <!-- Modal content-->
                                    <div class="modal-content">
                                        <div class="modal-header head1">
                                            <a class="close1">&times;</a>
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
			<footer class="footer text-center">
				&copy; 2001-2016 Accenture. All Rights Reserved. Accenture Confidential. For Internal Use Only.
			</footer>
		</div>
		<!-- /wrapper -->
                <script type="text/javascript">
               
                   
                    
                   
                </script>
	</body>
</html>