<!DOCTYPE html>
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Agile Release Planner</title>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" />
<link href="resources/css/layout.css" rel="stylesheet" />
<!-- <link href="resources/css/custom.css" rel="stylesheet" /> -->
<link href="resources/css/customWsjf.css" rel="stylesheet" />
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
        <body ng-controller="ReleasePlannerWSJFScreenController">
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
								<a class="back-link" href=""
								onclick="confirmToMoveToDashbaord('/releaseplanner/dashboard?action=back')"
								style="color: rgb(99, 184, 255)"><span
								class="glyphicon glyphicon-menu-left"
								style="color: rgb(99, 184, 255)"></span>Back</a> <span
								style="color: rgb(0, 0, 0)">Release Planning</span>
							</h1>
						</div>
						</div>
					<div class="row tile-wrap">
                                        
					<div class="col-md-12 content-bg paddint0">
                                            <div class="content-header row">
                                                <div class="col-md-6 margint5">
                                                  <a href="backlogScreen" class="white"></a>
                                                    <p class="pull-left">&nbsp;  {{projectResponse.releasePlannerReleases[0].releaseName}} - &nbsp;WSJF View &nbsp;:&nbsp;Product Backlog </p></div>
                                                  <div class="col-md-6 pull-right">
<!--                                                    <p class="pull-right">Product Backlog</p> -->
                                                    <a href="javascript:;" title="Close" class="pull-right glyphicon glyphicon-remove a_close"  onclick="window.location.href='/releaseplanner/backlogScreen'"></a>
                                                </div>
                                            </div>
                                            <div class="table_sprint">
                                            <table class="table table-fixed table-custom table-custom1 margint15 table_data table_body" id="wsjfTable" cellspacing="0">
		<thead>
			<tr>
                            <th class="id_story"><small title="Unique id of the story"># ID  &nbsp; 
                            <span id="sort_storyID"> <img src="resources/images/blue_Arrow.png" width="12"/></span>
                            <a href="#" class="th_search storyId_search">
   							<span><img src="resources/images/search_icon.png" ng-click="searchID=!searchID" width="15"/></span></a>
          					 </small>
   							<div class="id_class search1_class margint15" ng-model="model.storyId">
      						<input type="search" ng-model="model.storyId" ng-show="searchID">
   							</div>
                            </th>

							<th class="epic_story"><small title="Title of Epic/Feature/User Story">EPIC/FEATURE/USER STORY&nbsp;
							<span id="sort_title"><img src="resources/images/blue_Arrow.png" width="12" /></span>
							<a href="#" class="th_search storyTitle_search">
							<span><img src="resources/images/search_icon.png" ng-click="searchTitle=!searchTitle" width="15"></span>
							</a> </small>
							<div class="feature_class search2_class margint15" ng-model="model.storyTitle">
							<input type="search" ng-model="model.storyTitle" ng-show="searchTitle">
							</div></th>


							<th class="text-center blue_bg highlight_th business_val" style=""><small title="Depends on the impact to the business, revenue, negative impact if there is a delay. Relative value to the customer or business.">Business Value&nbsp;
							<span> <img src="resources/images/blue_Arrow.png" id="sort_businessValue" width="12" ></span>
							<a href="#" class="th_search storyValue_search">
							<span><img src="resources/images/search_icon.png" ng-click="searchBusinessValue=!searchBusinessValue" width="15" ng-model="model.businessValue" ></span>
							</a></small>
							<div class="feature_class search4_class margint15" >
							<input type="search" style="border:1px solid white" ng-model="model.businessValue" ng-show="searchBusinessValue">
							</div></th>


							<th  class="text-center blue_bg highlight_th time_column" style="" ><small title="How the user value decays over time">Time Criticality &nbsp;
				  			<span> <img src="resources/images/blue_Arrow.png" width="12" id="sort_time"/></span>
				  			<a href="#" class="th_search storyTime_search right-time">
          					<span><img src="resources/images/search_icon.png" ng-click="searchPriority=!searchPriority" width="15" ng-model="model.storyPriority"></span>
        					</a></small>
                  			<div class="feature_class search5_class margint15">
                   		 	<input type="search"  ng-model="model.storyPriority" ng-show="searchPriority">
      						</div></th>
      						
      						
							<th  class="text-center blue_bg highlight_th risk_column" style=""><small title="Does it reduce any risk or enable new business. What else does this do for our business?">Risk Reduction / Opportunity Enablement&nbsp;
				 			<span> <img src="resources/images/blue_Arrow.png"  id="sort_risk" width="12"/></span>
				 			<a href="#" class="th_search storyRisk_search">
          					<span><img src="resources/images/search_icon.png" ng-click="searchRisk=!searchRisk" width="15" ng-model="model.riskReductionOpportunityEnablement"></span>
        					</a></small>
							<div class="feature_class search6_class margint15" >
                    		<input type="search" style="border:1px solid white" ng-model="model.riskReductionOpportunityEnablement" ng-show="searchRisk">
                    		</div></th>
            
          					<th class="text-center blue_bg highlight_th level_column" style=""><small title="It depends on the time taken for completing the task. Depends on who will be working on it.">High level sizing &nbsp;
         					<span> <img src="resources/images/blue_Arrow.png"  id="sort_sizing" width="12" ng-model="model.storyPoints"/></span>
         					<a href="#" class="th_search storySize_search right-time">
          					<span><img src="resources/images/search_icon.png" ng-click="searchLevel=!searchLevel" width="15"></span>
        					</a></small>
							<div class="feature_class search7_class margint15" >
                            <input type="search" style="border:1px solid white" ng-model="model.storyPoints" ng-show="searchLevel" >
        					</div></th>
   
   							<th class="text-center wsjf_col" ><small title="Weighted Shortest Job First (WSJF) =Cost of Delay/Job Size &#013 Cost of Delay=Business Value+ Time Criticality + Risk Reduction/Opportunity Enablement">WSJF &nbsp;
   			  				<span> <img src="resources/images/blue_Arrow.png"  id="sort_wsjf" width="12" ng-model="model.wsjf"/></span>
   			  				<a href="#" class="th_search storywsjf_search right-time">
          					<span><img src="resources/images/search_icon.png" ng-click="searchwsjf=!searchwsjf"width="15"></span>
        					</a></small>
                            <div class="wsjf_class search8_class margint15">
                            <input type="search" ng-model="model.wsjf" ng-show=searchwsjf>
                            </div></th>
         
			</tr>
		</thead>
		<tbody>
			<tr ng-repeat="story in filtered=(stories | filter:model)">
                                <td class="text-nowrap blue white_bg table_left"><span style="padding-left: 10px;display: inline-block;">{{story.storyId}}</span>
                                <img src="resources/images/after-check.png" width="22" ng-if="story.isSelected" class="pull-left"/></td>
                                
				<td class="white_bg" title="{{story.storyTitle}}" width="24%">{{story.storyTitle | limitTo:35}}</td>
<!--                              <td class="text-center" width="11%"> -->
<!--                                 <div class="bg-div id_class"> -->
<!--                                     <select  ng-model="story.decomposedUserStory" value="{{story.decomposedUserStory}}" >  -->
                                      
<!--                                     </select> -->
<!--                                 </div> -->
<!--                              </td> -->
                                <td class="text-center highlight_td">
                                <div class="bg-div">
								 <div class="business_class"  ng-class="BusinessValueClass(story)"><input type="text" value="{{story.businessValue}}" ng-model="story.businessValue" id="businessValue" 
								 ng-change="changed()"></div></div></td>
	
				
			<td class="text-center highlight_td">
        		<form>
				<div class="slidecontainer" style="width: 90%">
 				<input type="range" ng-change="sliderChanged(story.storyId)" min="1" max="5" value="{{story.storyPriority}}" class="slider slider_ie" name="myRange" id="myRange{{story.storyId}}" ng-model="story.storyPriority" >
 					</div><div style="float: right; margin-top:-12px" id="demo{{story.storyId}}">
 					{{story.storyPriority}}</div>

         
            </form>
            </div>           
			
			</div>
			</td>
						
<!--     			<div class="time-slider" data-time-slide="3"> -->
<!--                 <div class="time-slider-progress"><div class="time-slider-progress-bar"></div></div> -->
<!--                 <div class="time-slider-tick-container"> -->
<!--                                 <div class="time-slider-tick" style="left:0;"></div> -->
<!--                                 <div class="time-slider-tick" style="left:25%;"></div> -->
<!--                                 <div class="time-slider-tick" style="left:50%;"></div> -->
<!--                                 <div class="time-slider-tick" style="left:75%;"></div> -->
<!--                                 <div class="time-slider-tick" style="left:100%;"></div> -->
<!--                 </div> -->
<!--                 <div class="time-slider-handle"></div> -->
<!-- 				</div> -->
			
              
				   <td class="text-center highlight_td" ><div class="bg-div risk_width">
                   <div ng-class="RiskValueClass(story)" class="risk_class">  <input type="text" value="{{story.riskReductionOpportunityEnablement}}" ng-model="story.riskReductionOpportunityEnablement" ng-change="changed()"></div>
                    </div></td>
                    
                  <td class="text-center highlight_td"> <div class="bg-div">
                   <div ng-class="StoryPointsClass(story)" class="level_class">    <input type="text" value="{{story.storyPoints}}" ng-model="story.storyPoints" ng-change="changed()"></div>
                  </div></td>
             
             <td class="text-center text-success success_color highlight_td green_bg"><strong>{{story.wsjf}}</strong></td>
             
            </tr>
			</tbody>
	</table>
  </div> 
 											
  </div>
					</div>
					<!-- /tile-wrap -->
				</div>
				<!-- /content-wrap -->
                 <div class="text-right margin_button">
                 <b style="color : rgb(251,181,0); text-align : right"  ng-if="changesSavedMessage">Saved Successfully&nbsp&nbsp&nbsp&nbsp</b>
  <button class="btn map-btn cancel_margin" ng-click="cancelChanges()">Cancel</button>
  <button class="btn blue_btn pull-right" ng-click="saveWSJFData()">Save</button>
   </div>
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
			<footer class="footer text-center">
				&copy; 2001-2018 Accenture. All Rights Reserved. Accenture Confidential. For Internal Use Only.
			</footer>
		</div>
		<!-- /wrapper -->
               
	</body>
</html>