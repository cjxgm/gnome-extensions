
const St = imports.gi.St;				// create stages
const Main = imports.ui.main;			// to access/modify panel
const Mainloop = imports.mainloop;		// for adding timers
const ActorAlign = imports.gi.Clutter.ActorAlign;	// for alignment constants

let clock_container, clock_index, orig_clock, iso_clock, timer;

function init()
{
	clock_container = Main.panel._centerBox.get_child_at_index(0).get_child_at_index(0).get_child_at_index(0);
	clock_index = 1;		// TODO: find a better way instead of hard-coding this
	orig_clock = clock_container.get_child_at_index(clock_index);
	iso_clock = new St.Label();
	iso_clock.add_style_class_name('iso-clock');
	iso_clock.set_y_align(ActorAlign.CENTER);
}

function enable()
{
	update_clock();
	clock_container.remove_child(orig_clock);
	clock_container.insert_child_at_index(iso_clock, clock_index);
	timer = Mainloop.timeout_add(1000, update_clock);
}

function disable()
{
	Mainloop.source_remove(timer);
	clock_container.remove_child(iso_clock);
	clock_container.insert_child_at_index(orig_clock, clock_index);
}

function update_clock()
{
	var now = new Date();
	var weekday = "⊗①②③④⑤⊙".charAt(now.getDay());
	iso_clock.set_text(now.toLocaleFormat(weekday + " %Y-%m-%d  %H:%M:%S"));
	return true;
}

