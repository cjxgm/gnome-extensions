
const MAIN = imports.ui.main;

function make(y, threshold, make_barrier, make_singleton)
{
	////////
	//////// debugging utils
	////////

	let log = function(msg) {
		return;		// disable debugging
		MAIN.notify('[top-fence] ' + msg);
	}

	let error = function(msg) {
		MAIN.notify('[top-fence] !! ' + msg);
		throw msg;
	}

	////////
	//////// top fence core functionality
	////////

	////////
	//////// signal handling
	////////

	let barrier = make_singleton(function() {
		return make_barrier(0, 1, y);
	}, function(old) { old() });


	////////
	//////// public interface
	////////

	let $ = {};

	$.enable = function() {
		barrier.init();
	}

	$.disable = function() {
		barrier.fini();
	}

	return $;
}

