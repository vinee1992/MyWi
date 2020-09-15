(function() {
	'use strict';
	var releasePlannerApp = angular.module('releasePlannerApp');

	releasePlannerApp.factory('ReleasePlannerFilterService', function() {
		return {
			filterByDependentOn : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return ((story.storyDependentOn != undefined) && (story.storyDependentOn.length != 0));
				});
				
				return result;
			},
			
			filterByViable : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return ((story.viable==true) && (story.confidence != 50));
				});
				
				return result;
			},
			
			filterByNotViable:  function(storiesList) {
				var result = [];
			
				result = storiesList.filter(function(story) {
					return ((story.viable==false) && (story.confidence != 50));
				});
				
				return result;
			},
			
			filterByAll : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return ((story.viable!=undefined));
				});
				
				return result;
			},
			
			filterByNeutral : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return (story.confidence == 50);
				});
				
				return result;
			},
				
			filterByDependentBy : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return ((story.storyDependedntBy != undefined) && (story.storyDependedntBy != ""));
				});
				
				return result;
			},

			
			filterByPriority : function(storiesList, priority) {
				var result = [];
				
				result = storiesList.filter(function(story) {
					return (priority.has(story.storyPriority));
				});
				
				return result;
			},
				
			filterByStoryPoints : function(storiesList, storyPointRange) {
				var result = [];
				
				result = storiesList.filter(function(story){
					return ((story.storyPoints >= storyPointRange[0]) && (story.storyPoints <= storyPointRange[1]))
				});
				
				return result;
			},
			
			filterByStoryRank : function(storiesList, storyRankRange) {
				var result = [];
				
				result = storiesList.filter(function(story){
					return ((story.stackRank >= storyRankRange[0]) && (story.stackRank <= storyRankRange[1]))
				});
				
				return result;
			},
			
			filterByIsPinned : function(storiesList) {
				var result = [];
				
				result = storiesList.filter(function(story){
					return story.isPinned;
				});
				
				return result;
			},

			filterBySearchText : function(storiesList, searchString) {
				var result = [];
				var _searchString = searchString.toLowerCase();
				
				if (!String.prototype.includes) {
				    String.prototype.includes = function(search, start) {
				      if (typeof start !== 'number') {
				        start = 0;
				      }

				      if (start + search.length > this.length) {
				        return false;
				      } else {
				        return this.indexOf(search, start) !== -1;
				      }
				    };
				  }
				
				result = storiesList.filter(function(story){
					if ((story.assignedTo == undefined) || (story.assignedTo == null)) {
						return false;
					}
					
					return ((story.storyId.toLowerCase() == _searchString) || 
							(story.storyId.toLowerCase().includes(_searchString)) ||
							(story.assignedTo.toLowerCase() == _searchString)||
							(story.assignedTo.toLowerCase().includes(_searchString))||
							(story.storyTitle.toLowerCase() == _searchString)||
							(story.storyTitle.toLowerCase().includes(_searchString)));
				});
				
				return result;
			},
					
			filterConfidenceScore : function(storiesList, confidenceRankRange) {
				var result = [];
				
				result = storiesList.filter(function(story){
					if (story.confidence == undefined) {
						return true;
					}
					
					if(story.viable){
					return ((story.confidence >= confidenceRankRange[0]) && (story.confidence <= confidenceRankRange[1]))
					}
					if(!story.viable){
						return (((100-story.confidence) >= confidenceRankRange[0]) && ((100-story.confidence) <= confidenceRankRange[1]))
					}
				});
				
				return result;
			}
		};
	});
})();