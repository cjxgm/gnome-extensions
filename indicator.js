
const ST = (function() {
	let _ = imports.gi.St;
	let $ = {};
	$.bin = _.Bin;
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

	let make_indicator = function(parent, backward, next) {
		let alpha_init = 255;
		let alpha_fini = 10;
		let delay = (backward ? 0.2 : 0.4);
		let duration = (backward ? 0.2 : 0.4);
		if (backward) [alpha_init, alpha_fini] = [alpha_fini, alpha_init];

		let indicator = new ST.bin({
			style_class: 'capslip-indicator',
			x: 0,
			y: 0, 	// will be calculated later
			opacity: alpha_init,
		});
		parent.add_actor(indicator);

		indicator._alpha = indicator.opacity;
		indicator.y = (MAIN.monitor.height - get_css_height(indicator)) / 2;

		tween(indicator, {
			_alpha: alpha_fini,
			delay: delay,
			time: duration,
			transition: 'easeOutQuad',
			onUpdate: function() { indicator.opacity = indicator._alpha; },
			onComplete: function() {
				parent.remove_actor(indicator);
				next();
			},
		});
	}

	let indicating;
	let indicate_request;

	let do_indicate = function() {
		let backward;
		if (indicate_request !== undefined) {
			backward = indicate_request;
			indicating = indicate_request;
			indicate_request = undefined;
		}
		if (!indicating) {
			indicating = undefined;
			return;
		}

		make_indicator(MAIN.ui, backward, do_indicate);
	}

	let request_indicate = function(enable) {
		indicate_request = enable;
		if (indicating === undefined) do_indicate();
	}

	return request_indicate;
}

