
const EXT = imports.misc.extensionUtils.getCurrentExtension();
const make_top_fence = EXT.imports['top-fence'].make;
const make_singleton = EXT.imports.singleton.make;
const make_barrier = EXT.imports.barrier.make(make_singleton);
const make_fence = EXT.imports.fence.make(20, 18, 40, make_barrier, make_singleton);

function init() { return make_top_fence(44, make_fence, make_singleton) }

