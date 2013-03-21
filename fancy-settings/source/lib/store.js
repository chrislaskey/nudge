//
// Copyright (c) 2011 Frank Kohlhepp
// https://github.com/frankkohlhepp/store-js
// License: MIT-license
//
// Modified by Chris Laskey to use chrome.storage.local instead of localStorage.
// Since chrome.storage.local's interface is asynchronous, had to change
// functions accordingly. The only public interface change is get() and
// toObject() now require a callback function to return the value.
// http://chrislaskey.com
//
(function () {

	var Store = this.Store = function (name, defaults, storage_type) {
		var key;
		this.name = name;
		
		if (storage_type === 'sync') {
			this.storage = chrome.storage.sync;
		} else {
			this.storage = chrome.storage.local;
		}

		if (defaults !== undefined) {
			for (key in defaults) {
				if (defaults.hasOwnProperty(key)) {
					this.get(key, function(value){
						if (! value) {
							this.set(key, defaults[key]);
						}
					});
				}
			}
		}
	};

	Store.prototype.returnStorageKey = function () {
		return "fancy-settings-" + this.name;
	}

	Store.prototype.get = function (name, callback) {
		if (typeof callback !== "function") {
			console.log('Store.get method is now asynchronous. A callback function is required to return a value.');
			return false;
		}
		var storage_key = this.returnStorageKey(name),
			that = this,
			all_setting_values,
			return_value;
		this.storage.get(null, function(all_values){
			setting_values = that.returnObjectProperty(all_values, storage_key);
			if (name) {
				return_value = that.returnObjectProperty(setting_values, name);
			}else{
				if( ! setting_values ){
					setting_values = {};
				}
				return_value = setting_values;
			}
			callback(return_value);
		});
	};

	Store.prototype.returnObjectProperty = function (obj, property) {
		if( this.objectHasProperty(obj, property) ){
			return obj[property];
		}else{
			return null;
		}
	};

	Store.prototype.objectHasProperty = function (obj, property) {
		var each_property,
			object_as_string = Object.prototype.toString.call(obj),
			is_object = (object_as_string === "[object Object]");
		if (is_object) {
			for (each_property in obj) {
				if (each_property === property) {
					return true;
				}
			}
		}
		return false;
	};

	Store.prototype.set = function (name, value) {
		var storage_key = this.returnStorageKey(),
			that = this;
		if (value === undefined) {
			this.remove(name);
		} else {
			this.get(null, function(setting_values){
				setting_values[name] = value;
				that.setAll(setting_values);
			});
		}
		return this;
	};

	Store.prototype.setAll = function (value) {
		var storage_key = this.returnStorageKey(),
			objectToStore = {};
		objectToStore[storage_key] = value;
		this.storage.set(objectToStore, function(){});
	};

	Store.prototype.remove = function (name) {
		this.get(null, function(setting_values){
			if( this.hasOwnProperty(setting_values, name) ){
				delete setting_values[name];
				this.setAll(setting_values);
			}
		});
		return this;
	};

	Store.prototype.removeAll = function (name) {
		var storage_key = this.returnStorageKey(),
			keyArray = [storage_key];
		this.storage.remove(keyArray, function(){});
		return this;
	};

	Store.prototype.toObject = function (callback) {
		return values;
	};

	Store.prototype.fromObject = function (values, merge) {
		if (merge !== true) {
			this.removeAll();
		}
		this.setAll(values);

		return this;
	};

}());
