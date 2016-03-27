
///////////////////////////////////////////////////////////////////////////
//
// imports
//

const RFKILL = imports.ui.status.rfkill;


///////////////////////////////////////////////////////////////////////////
//
// aircrash
//

function make(make_singleton)
{
    let manager = RFKILL.getRfkillManager();

	////////
	//////// core
	////////

    let disable_airplane_mode = function() {
        manager.airplaneMode = false;
    }

	////////
	//////// signal handling
	////////

    let airplane_mode_changed_lsnr = make_singleton(function() {
        manager.connect('airplane-mode-changed', disable_airplane_mode);
    }, function(old) { manager.disconnect(old) });

	////////
	//////// public interface
	////////

	let $ = {};

	$.enable = function() {
        airplane_mode_changed_lsnr.init();
	}

	$.disable = function() {
        airplane_mode_changed_lsnr.fini();
	}

	return $;
}

