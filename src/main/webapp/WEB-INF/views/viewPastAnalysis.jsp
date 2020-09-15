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
<link href="resources/css/progress-circle.css" rel="stylesheet" />
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js" type="text/javascript"></script>
<script src="resources/js/appService.js" type="text/javascript"></script>
<script src="resources/js/appFilterService.js" type="text/javascript"></script>
<script src="resources/js/appController.js" type="text/javascript"></script>

</head>
<body ng-controller="ReleasePlannerViewPastAnalysisController">
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
						<img src="resources/images/logo_accenture_old.png" alt="Accenture Technology"
							class="img-responsive" />
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
				<div class="row page-title">
					<div class="col-xs-9">
						<h1 class="text-left">
							<a class="back-link" href="/releaseplanner/dashboard?action=back" style="color:rgb(99,184,255)"><span
								class="glyphicon glyphicon-menu-left" style="color:rgb(99,184,255)"></span>Back</a> <span style="color:rgb(0,0,0)">Past Analysis</span>
						</h1>
					</div>
				</div>
				<div class="row tile-wrap">
					<div class="col-md-12">

						<div class="tile">
							<table class="table table-striped table-custom margint15"
								cellspacing="0">
								<thead>
									<tr>
										<th width="20%">Release Name &nbsp;</th>
										<th width="16%">Start Date &nbsp; </th>
										<th width="16%">End Date &nbsp; </th>
										<th width="12%">Team &nbsp;</th>
									</tr>
								</thead>
								<tbody ng-if="(releasePlannerReleases!=null) && (releasePlannerReleases.length!=0)">
									<tr ng-repeat="release in releasePlannerReleases">
										<td class="text-nowrap blue"><a href='viewPastAnalysisDetailed?releaseId={{release.releaseId}}'>{{release.releaseName}}</a></td>
										<td>{{release.startDate}}</td>
										<td>{{release.endDate}}</td>
										<td>{{release.team}}</td>
									</tr>
								</tbody>
								<tbody ng-if="(releasePlannerReleases==null) || (releasePlannerReleases.length==0)">
									<tr>
										<td class="text-nowrap blue" colspan="4" style="text-align: center;">No Releases Available</td>
									</tr>
								</tbody>
								
							</table>
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
                     </div>
		<!-- /wrap -->
		<footer class="footer text-center"> &copy; 2001-2018
			Accenture. All Rights Reserved. Accenture Confidential. For Internal
			Use Only. </footer>
	</div>
	<!-- /wrapper -->
</body>
</html>