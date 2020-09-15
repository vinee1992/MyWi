
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Upload a new file</title>
</head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" />

<link href="resources/css/custom.css" rel="stylesheet" />
<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js"></script>
<script src="resources/js/appService.js"></script>
<script src="resources/js/appController.js"></script>
<script src="resources/js/settings.js"></script>


<body>
<body>
		<div class="wrapper">
			<div class="wrap">
				<header class="container-fluid header">
					<div class="row">
						<div class="header-col col-xs-12 col-sm-4 branding">
							<img src="resources/images/logo_accenture.png" alt="Accenture Technology" class="img-responsive" />
						</div>
						<div class="header-col col-xs-12 col-sm-8 text-right">
							<div class="clearfix settings-panel">
								<div class="pull-right user-wrap">
									<div class="user-toggle" data-toggle="dropdown">
										<strong>merry.jane</strong> 
									</div>
									<ul>
										<li><a href="javascript:;">Logout <span class="glyphicon glyphicon-off"></span></a></li>
									</ul>
								</div>
								<div class="pull-right settings-config disabled">
									<span class="glyphicon glyphicon-cog"></span>
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
									<div><span>Client Name</span><span>Engagement Name</span><span>Project Name</span></div> 
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
								<a class="back-link" href="manage.html"><span class="glyphicon glyphicon-menu-left"></span>Back</a>
								Release Planning
							</h1>
						</div>
						</div>
					<div class="row tile-wrap">
                                            <div class="col-md-12">
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="20" src="resources/images/stand-up.png" alt=""></span> Stand-Up Analyst</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="23" src="resources/images/retrospective.png" alt=""></span> Retrospective assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="22" src="resources/images/report.png" alt=""></span> Report Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="24" src="resources/images/sprint.png" alt=""></span> Sprint Planning</div>
                                                <div class="col-md-2 stand-text"><span class="glyphicon"><img width="18" src="resources/images/backlog-assistant.png" alt=""></span> Backlog Assistant</div>
                                                <div class="col-md-2 stand-text"><span class="stand_active"><span class="glyphicon"><img width="18" src="resources/images/release.png" alt=""></span> Release Planning</span></div>
                                            </div>
                                            <div class="col-md-12 content-bg">
	<div ng-controller="uploadFileController">
		<form enctype="multipart/form-data">
			<label class="btn margint10 btn-info btn-home"> <input
				type="file"
				onchange="angular.element(this).scope().uploadFile(this.files)"
				name="uploadfile" id="uploadfile" /> Upload New File


			</label>
		</form>
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
</body>
</html>