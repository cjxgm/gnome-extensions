// fence: a crossable barrier that stops mouse from moving over it,
//        but let it go when it pushes so hard.

const MAIN = imports.ui.main;

function make(gate_opening, gate_closing, resistance, make_barrier, make_singleton)
{
	////////
	//////// debugging utils
	////////

	let log_name = 'top-fence:fence';
	let log = function(msg) {
		global.log('[' + log_name + '] ' + msg);
	}
	let error = function(msg) {
		MAIN.notify('[' + log_name + '] !! ' + msg);
		throw '[!' + log_name + '] ' + msg;
	}

	return function(dx, dy, pos, on_cross, on_leave) {
		if (!on_cross) on_cross = function() {};
		if (!on_leave) on_leave = function() {};

		////////
		//////// fence core functionality
		////////

		let behind = false;
		let front_barrier;
		let  back_barrier;

		front_barrier = make_singleton(function() {
			let pressure = 0;
			let gate_open = false;
			return make_barrier(dx, dy, pos, function(d) {
				if (d > gate_opening) gate_open = true;
				if (d < gate_closing) gate_open = false;
				if (!gate_open) return;
				pressure += d;
				if (pressure > resistance) {
					 back_barrier.init();
					front_barrier.fini();
					on_cross();
				}
			}, function(d) {
				pressure = 0;
				gate_open = false;
			});
		}, function(old) { old() });

		back_barrier = make_singleton(function() {
			return make_barrier(-dx, -dy, pos, function(d) {
				front_barrier.init();
				 back_barrier.fini();
				on_leave();
			});
		}, function(old) { old() });

		let barrier = make_singleton(function() {
			front_barrier.init();
			return true;
		}, function() {
			front_barrier.fini();
			 back_barrier.fini();
		});

		////////
		//////// public interface
		////////

		barrier.init();
		return barrier.fini;
	}
}

