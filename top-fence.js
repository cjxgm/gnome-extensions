
const MAIN = imports.ui.main;

function make(y, make_fence, make_singleton)
{
	////////
	//////// debugging utils
	////////

	let log_name = 'top-fence';
	let log = function(msg) {
		global.log('[' + log_name + '] ' + msg);
	}
	let error = function(msg) {
		MAIN.notify('[' + log_name + '] !! ' + msg);
		throw '[!' + log_name + '] ' + msg;
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

