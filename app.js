window.a = {
    target: document.body,
    _views: {},
    _view_queue: [],
    _load_count: 0,
    _ready_methods: [],
    ready: (method = null) => {
        if (method) {
            a._ready_methods.push(method)
        }
        if (a._load_count === 0) {
            while (a._ready_methods.length > 0) {
                a._ready_methods[0]()
                a._ready_methods.shift()
            }
        }
    },
    load: (module, name = null) => {
        name = name ?? module.substring(module.lastIndexOf('/')+1);
        a._load_count++
        import(`${module}`).then(
            imported => {
                a._load_count--
                a._views[name] = imported.default
                a.ready()
            })
    },
    uid_val: 0,
    uid: () => {
        a.uid_val++
        return 'au-' + a.uid_val
    },
    v: (name, values = {}) => {
        return a.view(name, values)
    },
    view: (name, values = {}) => {
        values = {...a._views[name].values(values), ...values}
        values._uid = a.uid()
        values.selector = '.' + values._uid
        const elementType = a._views[name].element(values) ?? 'div'
        let element = `<${elementType} class="${values._uid}">${a._views[name].view(values) + `<style>` + a._views[name].style(values) + `</style>`}</${elementType}>`
        a._view_queue.push({view: a._views[name], name: name, values: values})
        return element
    },
    render: (target, output = null) => {
        if (output === null) {
            output = target
            target = a.target
        }
        target.innerHTML = output
        while (a._view_queue.length > 0) {
            const template = a._view_queue[0]
            a._view_queue.shift()
            template.values.self = a.find(template.values.selector)
            template.view.script(template.values)
        }
    },
    find: query => {
        return document.querySelector(query)
    },
    findAll: query => {
        return document.querySelectorAll(query)
    }
}

const event = new Event('a_init');
document.dispatchEvent(event);
