
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


function make()
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

	let ripple = function() {
		make_ripple(MAIN.ui, 'capslip-on', 0.5, 1, function() {});
	}

	return ripple;
}

