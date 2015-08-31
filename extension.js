
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const make_top_fence = EXT.imports['top-fence'].make;
const make_singleton = EXT.imports.singleton.make;
const make_barrier = EXT.imports.barrier.make(make_singleton);

function init() { return make_top_fence(140, 400, make_barrier, make_singleton) }

