Sync from admvars-server

User of this package must implement

    //bag is an object: k->value where k is a string, and value a primitive type
    as = new (require('admvars-slave'))(bag)
    app.get('/admin/hotvars', as.list.bind(as))
    app.put('/admin/hotvars/key', as.put.bind(as))

Up to you to add some checks before taking any action 
    
    app.get('/admin/hotvars', isAdmin, as.list.bind(as))