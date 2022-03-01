class BaseService {
  constructor(model) {
    this.model = model;
  }
  list(where) {
    return this.model.find(where || {});
  }
  create(data) {
    return new this.model(data).save();
  }
  findOne(where) {
    return this.model.findOne(where);
  }
  update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }
  updateWhere(where, data) {
    return this.model.findOneAndUpdate(where, data, { new: true });
  }
  delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseService;
