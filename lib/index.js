/**
 * @param {{k:v}} bag key:string, v: any primitive value
 */
function AdmvarsSlave(bag, remoteEndpoint){
    this.bag = bag;
    this.remoteEndpoint = remoteEndpoint;
}

AdmvarsSlave.prototype.list = function(req,res){
    return Promise.resolve().then(_=>{
        var json = {};
        var c = 0;
        json.items = Object.keys(this.bag).map(k=>{
            c++;
            return {
                k:k,
                v:this.bag[k]
            }
        });
        json.count = c;
        json.links = {};
        return res.send(json);
    })
}

AdmvarsSlave.prototype.set = function(req, res){
    return Promise.resolve().then(_=>{
        if(!req.params.key || !req.body.hasOwnProperty('value')){
            //there should not be failures since not opened to anybody
            //I just don't trust myself
            return res.status(400).send('expect value in body');
        }
        var k = req.params.key;
        var v = req.body.value;
        var o = this.bag[k];
        this.bag[k] = v;
        var json = {
            'old': o,
            'new': v
        }
        return res.send(json);
    })
}

/**
 * forall vars in bag
 *     if var is already present in remote, next
 *     if var is not present in remote, create it with local value
 * endfor
 * updates local vars from remote vars
 * @param  {Object} opts for request options
 * @return {[type]}      [description]
 */
AdmvarsSlave.prototype.sync = function(opts = {}){
    var request = require('request-promise');
    var items = Object.keys(this.bag).reduce((acc,k)=>{
        if(!['string', 'number','boolean'].includes(typeof(this.bag[k]))){
            throw k+' is not a primitive type';
        }
        return acc.concat({
            k:k,
            v:this.bag[k]
        })
    },[]);
    return request(Object.assign({
        method:'POST',
        url: this.remoteEndpoint+'/hotvarsSets',
        json:true,
        body:{items:items},
        headers:Object.assign({},opts.headers||{})
    }, opts)).then(res=>{
        res.ignored.forEach(item=>{
            this.bag[item.k] = item.v;
        })
    })
}

module.exports = AdmvarsSlave;
