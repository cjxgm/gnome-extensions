
///////////////////////////////////////////////////////////////////////////
//
// imports
//

const MAIN = imports.ui.main;			// to access/modify panel
const MAINLOOP = imports.mainloop;		// for adding timers

// for alignment constants
function _import_actor_align()
{
	let $ = {};
	let _ = imports.gi.Clutter.ActorAlign;
	$.center = _.CENTER;
	return $;
}
const ACTOR_ALIGN = _import_actor_align();

// for creating stages
function _import_st()
{
	let $ = {};
	let _ = imports.gi.St;
	$.label = _.Label;
	return $;
}
const ST = _import_st();


///////////////////////////////////////////////////////////////////////////
//
// iso clock
//

function make_iso_clock()
{
	const clock_container = MAIN.panel._centerBox.get_child_at_index(0).get_child_at_index(0).get_child_at_index(0);
	const clock_index = 1;		// TODO: find a better way instead of hard-coding this
	const orig_clock = clock_container.get_child_at_index(clock_index);
	const iso_clock = new ST.label();
	iso_clock.add_style_class_name('iso-clock');
	iso_clock.set_y_align(ACTOR_ALIGN.center);

	let $ = {};
	let timer;

	let update_clock = function() {
		// FIXME: remove camelcase
		let now = new Date();
		let weekday = "⊗①②③④⑤⊙".charAt(now.getDay());
		iso_clock.set_text(now.toLocaleFormat(weekday + " %Y-%m-%d  %H:%M:%S"));
		return true;
	}

	$.enable = function() {
		update_clock();
		clock_container.remove_child(orig_clock);
		clock_container.insert_child_at_index(iso_clock, clock_index);
		timer = MAINLOOP.timeout_add(1000, update_clock);
	}

	$.disable = function() {
		MAINLOOP.source_remove(timer);
		clock_container.remove_child(iso_clock);
		clock_container.insert_child_at_index(orig_clock, clock_index);
	}

	return $;
}

