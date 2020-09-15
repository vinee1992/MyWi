<!DOCTYPE html>
<html lang="en">
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
                
        <script>
    		sessionStorage.setItem("fileName","");
    		sessionStorage.removeItem("selectedStories");
        </script>
	</head>
	<body>
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
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div id="navbar-menu" class="collapse navbar-collapse">
<!-- 					<div class="navbar-left agilerelease_title col-sm-6">Agile Release Planner</div> -->
						<div class="navbar-right col-xs-12 col-sm-6">
							<div class="scope-selector">
								<div class="scope-selector-toggle" title="Client Name | Engagement Name | Project Name">
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
                                    
                                    <div class="col-md-6 margint25">
                                       <div class=" svgdiv">
											<img src="resources/images/release_plannerimg.png" /></div>
                                    </div>
                                    <div class="col-md-5 marginb25 pull-right">
                                        <h3 class="want_txt">Agile</h3>
                                        <h1 class="release_txt">Release Planner</h1>
                                        <p class="main_txt">Agile Release Planner helps transform Product backlog to viable Release Plan, by analyzing the story attributes and dependencies.Based on AI, the Agile Release planner provides support to create the Release Plan, with sprint timelines and sprint backlog. 
Wait no longer! Let us get started.</p>
                                        <div class="col-md-4 text-left">
                                            <div><img src="resources/images/part_analysis.png" alt="" class="img-responsive paddingl15"></div>
                                            <a onclick="window.location.href='/releaseplanner/viewPastAnalysis'"><button class="btn btn-part" >View Past Analysis</button></a>
                                        </div>
                                        <div class="col-md-4 col-md-offset-1">
                                            <div><img src="resources/images/view_analysis.png" alt="" class="img-responsive paddingl10"></div>
											<a onclick="window.location.href='/releaseplanner/releaseTimeline'"> <button class="btn btn-part">Plan My Release</button></a>
                                        </div>
                                    </div>
					<!-- /tile-wrap -->
				</div>
				<!-- /content-wrap -->
			</div>
			<!-- /wrap -->
			<footer class="footer text-center left_align">
				&copy; 2001-2018 Accenture. All Rights Reserved. Accenture Confidential. For Internal Use Only.
			</footer>
		</div>
		<!-- /wrapper -->
	</body>
</html>