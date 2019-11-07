(function() {
    const watchers = {}
    const values = {}

    function on(name, func) {
        if (!watchers[name]) {
            watchers[name] = []
        }
        const id = Symbol()
        watchers[name].push({
            id,
            method = func
        })

        return id
    }

    function set(name, value) {
        if (watchers[name]) {
            watchers[name].forEach((watcher) => { 
                watcher.method({old: values[name], new: value})
            })
        }

        values[name] = value
    }

    function stopWatching({name, id}) {
        if (name) {
            watchers[name] = watchers[name]
                .filter((watcher) => watcher.id !== id)
        } else {
            for (let name in watchers) {
                if(!watchers.hasOwnProperty(name)) continue;

                watchers[name] = watchers[name]
                    .filter((watcher) => watcher.id !== id)
            }
        }
    }

    window.watcher = {
        on, set, stopWatching
    }
})()