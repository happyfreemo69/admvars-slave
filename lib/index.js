/**
 * @param {{k:v}} bag key:string, v: any primitive value
 */
function AdmvarsSlave(bag){
    this.bag = bag;
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
module.exports = AdmvarsSlave;