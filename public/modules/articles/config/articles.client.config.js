'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?', true);
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles', false, ['user', 'editor', 'admin']);
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create', false, ['user', 'editor', 'admin']);
	}
]);
