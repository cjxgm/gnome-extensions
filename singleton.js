
function make(make_, free_)
{
    let obj;

    let fini = function() {
        if (obj === undefined) return;
        free_(obj);
        obj = undefined;
    }

    let init = function() {
        fini();
        obj = make_();
    }

    let get = function() { return obj }

    let $ = {};
    $.fini = fini;
    $.init = init;
    $.get  = get ;

    return $;
}

