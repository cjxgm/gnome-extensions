
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const make_aircrash = EXT.imports.aircrash.make;
const make_singleton = EXT.imports.singleton.make;

function init() { return make_aircrash(make_singleton) }

