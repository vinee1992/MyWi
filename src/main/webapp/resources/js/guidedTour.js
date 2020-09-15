(function(){
	$(function(){
		var tour = new Tour({
			backdrop: true,
			template: '<div class="popover tour" style="max-width:300px; min-width:300px;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div>' + 
						'<div class="popover-navigation"><div class="btn-group"><button class="btn btn-default" data-role="prev">&laquo; Prev</button>' + 
						'<button class="btn btn-default" data-role="next">Next &raquo;</button></div>' +
						'<button class="btn btn-default" data-role="end">End tour</button></div>' +
						'<div style="clear:both; padding:0 14px 9px;"><label style="font-weight:400;"><input type="checkbox" checked />&nbsp;Do not show this tour again</label></div></div>',
			debug: false,
			steps: [
				{
					element: ".username",
					placement: "bottom",
					content: "<p>Hi " + $('.username').text() +", Welcome to  myWizard homepage tour!</p><p>Click Next to take a quick tour of Accenture myWizard.</p>",
					backdropPadding: 5,
					animation: false
				},
				{
					element: "#navbar-menu .navbar-nav",
					placement: "bottom",
					content: "<p>myWizard services are spread across three different tabs that gets displayed based on your role.</p>",
					animation: false
				},
				{
					element: ".scope-selector",
					placement: "left",
					content: "<p>The <strong>Scope Selector</strong> is common across all myWizard screens, although different selections may appear depending on your security access and the screen you are viewing.</p> <p>Apply the filters to select the Accenture account you wish to work on or to set the default account you want to see when you login.</p>",
					animation: false,
					onShown: function(tour){
						$('.scope-selector').toggleClass('open');
						$('.popover').css({'top':($('.scope-selector').offset().top + 40) + 'px', 'left':'auto','right':'390px'});
						$(document).unbind('click', documentClick);
						$('.scope-selector-dropdown').css('display','block');
					},
					onHide: function(tour){
						$('.scope-selector').toggleClass('open');
						$(document).bind('click', documentClick);
						$('.scope-selector-dropdown').removeAttr('style');
					}
				},
				{
					element: $('.tile:eq(0) h2'),
					placement: "bottom",
					content: "<p>Each tile in myWizard acts as a gateway to myWizard service offering. Click on the tile heading to access its content.</p><p>A set of related services appear  in a \"stacked\" tile.  Clicking on a stacked tile opens a full screen that shows the subset of services.</p>",
					animation: false
				},
				{
					element: ".va-alerts-wrap",
					placement: "bottom",
					content: "<p>Here is the virtual team of experts, deeply skilled in all aspects of Technology delivery, constantly updating their knowledge and experience; a team available to show you areas needing your attention and help you in resolving issues.</p><p>Displayed are Project Manager, Data Scientist and Scrum Master in that order from left to right. Click on individual icons to see role specific alerts.</p>",
					animation: false
				},
				{
					element: $('.tile .tile-chart').eq(0),
					placement: "bottom",
					content: "<p>Click on tile graphs or charts to see a full screen view.</p>",
					animation: false
				},
				{
					element: ".settings-config",
					placement: "left",
					content: "<p>Click on the gear icon to open the preferences.</p><p>Global settings appear on the myWizard homepage. Page specific settings may also appear when in individual screens or tiles.</p>",
					animation: false,
					onShown: function(tour){
						$('.settings-config').toggleClass('open');
						$('.popover').css({'top':($('.settings-config').offset().top + 31) + 'px', 'left':($('.settings-config').offset().left - 570) + 'px'});
					},
					onHide: function(tour){
						$('.settings-config').toggleClass('open');
					}
				},
				{
					element: ".reporting-week-wrap",
					placement: "left",
					content: "<p>The <strong>Reporting Period</strong> defaults to the current reporting period.</p><p>To switch to a different reporting period, click on the icon next to the date, choose a date on list, or click on the &lt; &gt; icons.</p><p>Changing the reporting period also changes the data displayed on the tiles.</p>",
					animation: false,
					onShown: function(tour){
						var leftPos = $('.reporting-week-wrap').offset().left + $('.reporting-week-wrap').outerWidth() - 580;
						$('.status-period').toggleClass('active');
						$('.popover').css({'top':($('.reporting-week-wrap').offset().top + 30) + 'px', 'left':leftPos + 'px'});
						$('.popover .arrow').css({'top':'10%'});
					},
					onHide: function(tour){
						$('.status-period').toggleClass('active');
					}
				},
				{
					element: ".user-help",
					placement: "left",
					content: "<p>Access Help Options here. Click on myWizard Support or myWizard Training for training materials.</p>",
					animation: false,
					onShown: function(tour){
						$('.user-help').toggleClass('open');
						$('.popover').css({'top':($('.user-help').offset().top + 31) + 'px', 'left':($('.user-help').offset().left - 430) + 'px'});
						$('.user-help > span').removeAttr('data-toggle');
					},
					onHide: function(tour){
						$('.user-help').toggleClass('open');
						$('.user-help > span').attr('data-toggle','dropdown');
					}
				}
			]
		}).init();
		$(document).on("click", "#guidedTour", function(e) {
			e.preventDefault();
			tour.restart();
			//tour.goTo(10);
			return false;
		});
	});
}).call(this);
 