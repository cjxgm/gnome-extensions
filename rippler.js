
const ST = (function() {
	let _ = imports.gi.St;
	let $ = {};
	$.bin = _.Bin;
	return $;
})();

const CLUTTER = (function() {
	let _ = imports.gi.Clutter;
	let $ = {};
	$.point = _.Point;
	return $;
})();

const MAIN = (function() {
	let _ = imports.ui.main;
	let $ = {};
	$.ui      = _.uiGroup;
	$.monitor = _.layoutManager.primaryMonitor;
	return $;
})();

const tween = imports.ui.tweener.addTween;


function make(max_ripples)
{
	let get_css_height = function(actor) {
		return actor.peek_theme_node().get_height();
	}

	let make_ripple = function(parent, scale_init, scale_fini, backward, next) {
		let alpha_init = 255;
		let alpha_fini = 0;
		if (backward) {
			[alpha_init, alpha_fini] = [alpha_fini, alpha_init];
			[scale_init, scale_fini] = [scale_fini, scale_init];
		}

		let ripple = new ST.bin({
			style_class: 'capslip-ripple',
			pivot_point: new CLUTTER.point({ x: 0.0, y: 0.5 }),
			x: 0,
			y: 0, 	// will be calculated later
			scale_x: scale_init,
			scale_y: scale_init,
			opacity: alpha_init,
		});
		parent.add_actor(ripple);

		ripple._alpha = ripple.opacity;
		ripple._time = 0;
		ripple.y = (MAIN.monitor.height - get_css_height(ripple)) / 2;

		let next_invoked;
		tween(ripple, {
			_alpha: alpha_fini,
			_time: 1,
			scale_x: scale_fini,
			scale_y: scale_fini,
			time: 0.4,
			transition: 'linear',
			onUpdate: function() {
				ripple.opacity = ripple._alpha;
				if (ripple._time < 0.2) return;
				if (next_invoked) return;
				next_invoked = true;
				next();
			},
			onComplete: function() {
				parent.remove_actor(ripple);
			},
		});
	}

	let lerp = function(x, xf, xt, df, dt) {
		return (x-xf) / (xt-xf) * (dt-df) + df;
	}

	let rippling;
	let ripple_request;

	let do_ripple = function() {
		if (ripple_request !== undefined) {
			if (!rippling) rippling = { i: (ripple_request ? 3 : 0) };
			rippling.backward = ripple_request;
			ripple_request = undefined;
		}
		if (rippling.backward) {
			if (--rippling.i == 0) {
				rippling = undefined;
				return;
			}
		}
		else {
			if (rippling.i++ == max_ripples) {
				rippling = undefined;
				return;
			}
		}

		let scale_init = lerp(rippling.i, 1, max_ripples, 0.30, 0.05);
		if (rippling.backward) scale_init = 0.05;
		let scale_fini = lerp(rippling.i, 1, max_ripples, 1.00, 0.50);

		make_ripple(MAIN.ui, scale_init, scale_fini, rippling.backward, do_ripple);
	}

	let request_ripple = function(backward) {
		ripple_request = backward;
		if (!rippling) do_ripple();
	}

	return request_ripple;
}

