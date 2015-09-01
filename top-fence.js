
const MAIN = imports.ui.main;

function make(y, make_fence, make_singleton)
{
	////////
	//////// debugging utils
	////////

	let log = function(msg) {
		//return;		// disable debugging
		MAIN.notify('[top-fence] ' + msg);
	}

	let error = function(msg) {
		MAIN.notify('[top-fence] !! ' + msg);
		throw msg;
	}

	////////
	//////// top fence core functionality
	////////

	let fence = make_singleton(function() {
		return make_fence(0, 1, y);
	}, function(old) { old() });

	////////
	//////// public interface
	////////

	let $ = {};

	$.enable = function() {
		fence.init();
	}

	$.disable = function() {
		fence.fini();
	}

	return $;
}

