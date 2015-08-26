
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const make_iso_clock = EXT.imports['iso-clock'].make;

function init() { return make_iso_clock() }

