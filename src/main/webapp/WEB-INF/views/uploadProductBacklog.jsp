
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
<title>Accenture myWizard</title>
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
<body ng-controller="uploadFileController">
	<div class="wrapper">
		<div class="wrap">
			<header class="container-fluid header">
				<div class="row">
					<div class="header-col col-xs-12 col-sm-4 branding">
						<img src="resources/images/logo_accenture_old.png"
							alt="Accenture Technology" class="img-responsive" />
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

				<div class="col-md-4 col-md-offset-1 margint25">
					<img class="margint25 img-responsive" alt=""
						src="resources/images/setting_main.png">

				</div>
				<div class="col-md-5 col-md-offset-1 marginb25">
					<div class="row">
					<div class="col-md-8">
						<h3 class="want_txt">Upload</h3>
						<h1 class="release_txt">Release Data</h1>
					</div>
					<div class="col-md-4 want_txt text-right">
						<img src="resources/images/excel_upload.png" alt="" width="90">
					</div>
										</div>
					
					<div class="dwn_templete col-md-12">
					    <div class="row row2">
						<div class="text-right">
							<a class="dwn_tem"
								href='/releaseplanner/resources/UploadTemplate.xlsx'><img
								width="25" src="resources/images/download_icon.png" alt="">Download
								Template</a>
						</div>
						</div>
					</div>
					<div class="file-uplaod col-md-12">
						<input type="file" id="productBacklogFile" size="50" name="file">

					</div>
					<div class="pull-right">
						<button class="btn-cancel"
							onclick="window.location.href='/releaseplanner/dashboard?enterpriseId=<%=enterpriseId%>&endToEndUId=<%=projectId%>'">Cancel</button>
						<button class="btn-upload" ng-click="uploadFile()">Upload</button>
					</div>
				</div>
				<!-- /tile-wrap -->
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
			<!-- /content-wrap -->
		</div>
		<!-- /wrap -->
		
		<footer class="footer text-center"> &copy; 2001-2016
			Accenture. All Rights Reserved. Accenture Confidential. For Internal
			Use Only. </footer>
	</div>
	<!-- /wrapper -->

</body>
</html>