'use strict';

// Configuring the Articles module
angular.module('archives').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Archives', 'archives', 'dropdown', '/archives(/create)?');
		Menus.addSubMenuItem('topbar', 'archives', 'List Archives', 'archives');
		Menus.addSubMenuItem('topbar', 'archives', 'New Archive', 'archives/create');
	}
]);