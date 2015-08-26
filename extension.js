
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const make_capslip = EXT.imports.capslip.make;
const make_rippler = EXT.imports.rippler.make;
const make_indicator = EXT.imports.indicator.make;

function init() { return make_capslip(make_rippler(3), make_indicator()) }

