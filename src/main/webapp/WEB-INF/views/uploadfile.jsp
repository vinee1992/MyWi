
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

	<div ng-controller="uploadFileController">
		<form enctype="multipart/form-data">
			<label class="btn margint10 btn-info btn-home"> <input
				type="file"
				onchange="angular.element(this).scope().uploadFile(this.files)"
				name="uploadfile" id="uploadfile" /> Upload New File


			</label>
		</form>
	</div>
</body>
</html>