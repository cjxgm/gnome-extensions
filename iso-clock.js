
///////////////////////////////////////////////////////////////////////////
//
// imports
//

const MAIN = imports.ui.main;			// to access/modify panel
const MAINLOOP = imports.mainloop;		// for adding timers

// for alignment constants
const ACTOR_ALIGN = (function() {
	let $ = {};
	let _ = imports.gi.Clutter.ActorAlign;
	$.center = _.CENTER;
	return $;
})();

// for creating stages
const ST = (function() {
	let $ = {};
	let _ = imports.gi.St;
	$.label = _.Label;
	$.box   = _.BoxLayout;
	return $;
})();


///////////////////////////////////////////////////////////////////////////
//
// iso clock
//

function make()
{
	const clock_container = MAIN.panel._centerBox.get_child_at_index(0).get_child_at_index(0).get_child_at_index(0);
	const clock_index = 1;		// TODO: find a better way instead of hard-coding this
	const orig_clock = clock_container.get_child_at_index(clock_index);
	const  iso_clock = new ST.box({ style_class: 'iso-clock' });
	const label_day  = new ST.label({ style_class: 'iso-clock-day' , y_align: ACTOR_ALIGN.center });
	const label_date = new ST.label({ style_class: 'iso-clock-date', y_align: ACTOR_ALIGN.center });
	const label_time = new ST.label({ style_class: 'iso-clock-time', y_align: ACTOR_ALIGN.center });
	iso_clock.add_child(label_day );
	iso_clock.add_child(label_date);
	iso_clock.add_child(label_time);

	let $ = {};
	let timer;

	let now = function() {
		let _ = new Date();
		return {
			day : "⊗①②③④⑤⊙"[_.getDay()],
			date: _.toLocaleFormat("%Y-%m-%d"),
			time: _.toLocaleFormat("%H:%M:%S"),
		}
	}

	let update_clock = function() {
		let _ = now();
		label_day .text = _.day ;
		label_date.text = _.date;
		label_time.text = _.time;
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

