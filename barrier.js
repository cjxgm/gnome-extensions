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
	$.monitor_manager = global.screen || _.MonitorManager.get()
	return $;
})();
const SCREEN = global.screen || global.display;

function make(make_singleton)
{
	////////
	//////// debugging utils
	////////

	let log_name = 'top-fence:barrier';
	let log = function(msg) {
		global.log('[' + log_name + '] ' + msg);
	}
	let error = function(msg) {
		MAIN.notify('[' + log_name + '] !! ' + msg);
		throw '[!' + log_name + '] ' + msg;
	}

	////////
	//////// utils
	////////

	// XXX: dirty hack
	let get_current_monitor_geometry = function() {
		let nmon = SCREEN.get_n_monitors();
		let w = 0, h = 0;
		for (let i=0; i<nmon; i++) {
			let geo = SCREEN.get_monitor_geometry(i);
			w += geo.width;
			h += geo.height;
		}
		return { w: w, h: h };
	}

	// (dx > 0, dy = 0): a barrier of x=pos blocking mouse coming from east.
	// (dx < 0, dy = 0): a barrier of x=pos blocking mouse coming from west.
	// (dx = 0, dy > 0): a barrier of y=pos blocking mouse coming from south.
	// (dx = 0, dy < 0): a barrier of y=pos blocking mouse coming from north.
	// any other (dx, dy) combination is error.
	return function(dx, dy, pos, on_hit, on_leave) {
		if (dx == 0 && dy == 0) error("dx and dy cannot be both zero.");
		if (dx != 0 && dy != 0) error("dx and dy cannot be both non-zero.");
		if (!on_hit  ) on_hit   = function() {};
		if (!on_leave) on_leave = function() {};

		let dir = (
				dx > 0 ? META.barrier_direction.xpos :
				dx < 0 ? META.barrier_direction.xneg :
				dy > 0 ? META.barrier_direction.ypos :
				dy < 0 ? META.barrier_direction.yneg :
				error("unknown error in deducing dir: dx=" + dx + " dy=" + dy));

		let x = (dx ? pos : 0);
		let y = (dy ? pos : 0);

		let get_distance = (dx
				? function(e) { return Math.abs(e.dx) }
				: function(e) { return Math.abs(e.dy) });

		let make_barrier = function() {
			let geo = get_current_monitor_geometry();
			let w = (dx ? 0 : geo.w);
			let h = (dy ? 0 : geo.h);
			let b = new META.barrier({
				display: global.display,
				directions: dir,
				x1: x  , y1: y  ,
				x2: x+w, y2: y+h,
			});
			b.connect( 'hit', function(_, ev) { on_hit  (get_distance(ev)) });
			b.connect('left', function(_, ev) { on_leave(get_distance(ev)) });
			return b;
		}

		////////
		//////// signal handling
		////////

		let barrier = make_singleton(make_barrier, function(old) { old.destroy() });

		let monitors_changed = make_singleton(function() {
			return META.monitor_manager.connect('monitors-changed', function() {
				barrier.init();
			});
		}, function(old) { META.monitor_manager.disconnect(old) });

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

