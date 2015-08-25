
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const ISO_CLOCK = EXT.imports['iso-clock'];

function init() { return ISO_CLOCK.make_iso_clock() }

