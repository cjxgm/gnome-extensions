
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const ISO_CLOCK = EXT.imports['iso-clock'];
const iso_clock = ISO_CLOCK.make_iso_clock();

function enable() { iso_clock.enable() }
function disable() { iso_clock.disable() }

