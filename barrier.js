// barrier: an uncrossable barrier that stops mouse from moving over it

const MAIN = imports.ui.main;
const META = (function() {
	let $ = {};
	let _ = imports.gi.Meta;
	$.barrier = _.Barrier;
	$.barrier_direction = {
		xpos: _.BarrierDirection.POSITIVE_X,
		xneg: _.BarrierDirection.NEGATIVE_X,
		ypos: _.BarrierDirection.POSITIVE_Y,
		yneg: _.BarrierDirection.NEGATIVE_Y,
	};
	return $;
})();

function make(make_singleton)
{
	////////
	//////// debugging utils
	////////

	const log = function(msg) {
		//return;		// disable debugging
		MAIN.notify('[barrier] ' + msg);
	}

	const error = function(msg) {
		MAIN.notify('[barrier] !! ' + msg);
		throw msg;
	}

	////////
	//////// utils
	////////

	const get_current_monitor_geometry = function() {
		let mon = global.screen.get_current_monitor();
		let geo = global.screen.get_monitor_geometry(mon);
		return { w: geo.width, h: geo.height };
	}

	// (dx > 0, dy = 0): a barrier of x=pos blocking mouse coming from east.
	// (dx < 0, dy = 0): a barrier of x=pos blocking mouse coming from west.
	// (dx = 0, dy > 0): a barrier of y=pos blocking mouse coming from south.
	// (dx = 0, dy < 0): a barrier of y=pos blocking mouse coming from north.
	// any other (dx, dy) combination is error.
	return function(dx, dy, pos)
	{
		if (dx == 0 && dy == 0) error("dx and dy cannot be both zero.");
		if (dx != 0 && dy != 0) error("dx and dy cannot be both non-zero.");

		let dir = (
				dx > 0 ? META.barrier_direction.xpos :
				dx < 0 ? META.barrier_direction.xneg :
				dy > 0 ? META.barrier_direction.ypos :
				dy < 0 ? META.barrier_direction.yneg :
				error("unknown error in deducing dir: dx=" + dx + " dy=" + dy));

		let x = (dx ? pos : 0);
		let y = (dy ? pos : 0);

		let make_barrier = function() {
			let geo = get_current_monitor_geometry();
			let w = (dx ? 0 : geo.w);
			let h = (dy ? 0 : geo.h);
			return new META.barrier({
				display: global.display,
				directions: dir,
				x1: x  , y1: y  ,
				x2: x+w, y2: y+h,
			});
		}

		////////
		//////// signal handling
		////////

		let barrier = make_singleton(make_barrier, function(old) { old.destroy() });

		// FIXME: what is the signal of mouse moving to another monitor???
		let monitors_changed = make_singleton(function() {
			return global.screen.connect('monitors-changed', function() {
				barrier.init();
				error("FIXME: what is the signal of mouse moving to another monitor???");
			});
		}, function(old) { global.screen.disconnect(old) });


		////////
		//////// public interface
		////////

		barrier.init();
		monitors_changed.init();

		let free = function() {
			monitors_changed.fini();
			barrier.fini();
		}

		return free;
	}
}

