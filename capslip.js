
const keymap = imports.gi.Gdk.Keymap.get_default();

function make(ripple)
{
	////////
	//////// capslip core
	////////

	let caps_lock_state = keymap.get_caps_lock_state();

	let ripple_by_caps_lock = function() {
		let on = keymap.get_caps_lock_state();
		if (on == caps_lock_state) return;
		caps_lock_state = on;
		ripple((on ? 'capslip-on' : 'capslip-off'));
	}

	////////
	//////// signal handling
	////////

	let state_changed_id;

	let unlisten_state_changed = function() {
		if (!state_changed_id) return;
		keymap.disconnect(state_changed_id);
		state_changed_id = undefined;
	}

	let listen_state_changed = function() {
		unlisten_state_changed();
		state_changed_id = keymap.connect('state-changed', ripple_by_caps_lock);
	}

	////////
	//////// public interface
	////////

	let $ = {};

	$.enable = function() {
		listen_state_changed();
	}

	$.disable = function() {
		unlisten_state_changed();
	}

	return $;
}

