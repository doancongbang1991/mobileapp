var Fido = Fido || {};

Fido.LocalStorage = function(bundleId)
{
    this.id = bundleId;
}

Fido.LocalStorage.prototype.store = function(key, value) 
{
    localStorage.setItem(this.id + '.' + key, value);
}

Fido.LocalStorage.prototype.get = function(key) 
{
    return localStorage.getItem(this.id + '.' + key) || 0;
}

Fido.LocalStorage.prototype.remove = function(key)
{
    localStorage.removeItem(this.id + '.' + key);
}

Fido.LocalStorage.prototype.reset = function() 
{
    for(var i in localStorage) 
    {
        if(i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
    }
}