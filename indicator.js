
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

	let make_indicator = function(parent, next) {
		let indicator = new ST.bin({
			style_class: 'capslip-indicator',
			x: 0,
			y: 0, 	// will be calculated later
		});
		parent.add_actor(indicator);

		indicator._alpha = indicator.opacity;
		indicator.y = (MAIN.monitor.height - get_css_height(indicator)) / 2;

		tween(indicator, {
			_alpha: 10,
			delay: 0.4,
			time: 0.4,
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
		if (indicate_request !== undefined) {
			indicating = indicate_request;
			indicate_request = undefined;
		}
		if (!indicating) {
			indicating = undefined;
			return;
		}

		make_indicator(MAIN.ui, do_indicate);
	}

	let request_indicate = function(enable) {
		indicate_request = enable;
		if (indicating === undefined) do_indicate();
	}

	return request_indicate;
}

