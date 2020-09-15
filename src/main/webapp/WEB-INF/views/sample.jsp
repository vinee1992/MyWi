<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en" ng-app="releasePlannerApp">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Sample Page</title>
</head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" /> 
<link href="resources/css/layout.css" rel="stylesheet" />
<link href="resources/css/custom.css" rel="stylesheet" /> 
<script src="resources/js/jquery.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>
<script src="resources/js/angular.js"></script>
<script src="resources/js/angular-route.js"></script>
<script src="resources/js/app.js"></script>
<script src="resources/js/appService.js"></script>
<script src="resources/js/appController.js"></script> 

<body >
  <div class="container">
    <h1>Greetings of day</h1>
    <div ng-controller="SampleController" >
      <p> sample {{sample}} </p>
    </div>
  </div>
 
</body>
</body>
</html>