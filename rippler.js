
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

	let make_ripple = function(parent, style, scale_init, scale_fini, next) {
		let ripple = new ST.bin({
			style_class: 'capslip-ripple ' + style,
			pivot_point: new CLUTTER.point({ x: 0.0, y: 0.5 }),
			x: 0,
			y: 0, 	// will be calculated later
			opacity: 128,
			scale_x: scale_init,
			scale_y: scale_init,
		});
		parent.add_actor(ripple);

		ripple._alpha = ripple.opacity;
		ripple.y = (MAIN.monitor.height - get_css_height(ripple)) / 2;

		let next_invoked;
		tween(ripple, {
			_alpha: 0,
			scale_x: scale_fini,
			scale_y: scale_fini,
			time: 0.4,
			transition: 'linear',
			onUpdate: function() {
				ripple.opacity = ripple._alpha;
				if (ripple._alpha > 100) return;
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
		if (ripple_request) {
			rippling = {
				style: ripple_request,
				i: 0,
			};
			ripple_request = undefined;
		}
		if (rippling.i++ == max_ripples) {
			rippling = undefined;
			return;
		}

		let scale_init = lerp(rippling.i, 1, max_ripples, 0.30, 0.05);
		let scale_fini = lerp(rippling.i, 1, max_ripples, 1.00, 0.50);

		make_ripple(MAIN.ui, rippling.style, scale_init, scale_fini, do_ripple);
	}

	let request_ripple = function(style) {
		ripple_request = style;
		if (!rippling) do_ripple();
	}

	return request_ripple;
}

