module.exports = class Users {
  constructor() {
    if(!Users.instance){
      this._cache = [];
      Users.instance = this;
    }
    return Users.instance;
  }

  pushData(data){
    this._cache.push(data);
    return true;
  }

  getAllData(){
    return this._cache;
  }

  getOneData(_uid){
    console.log('all: ', this._cache);
    const target = this._cache.find(element => {
      if(element.uid === _uid)
        return true;
      else
        return false;
    });
    return target;
  }

  deleteOne(_uid){
    const targetIndex = this._cache.findIndex(element => {
      if(element.uid === _uid)
        return true;
      else
        return false;
    });
    this._cache.splice(targetIndex, 1);
    return true;
  }
}