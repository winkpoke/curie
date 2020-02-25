function vec3(x, y, z) {
	if (y == undefined && z == undefined) {
		if (x != undefined && x.length >= 3) {
			this.x = x[0] || 0;
			this.y = x[1] || 0;
			this.z = x[2] || 0;
		} else {
			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
		}
	} else {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	this[0] = this.x;
	this[1] = this.y;
	this[2] = this.z;

	return this;
}

vec3.prototype.copy = function(v) {
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;
	return this;
}

vec3.prototype.floor = function() {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	this.z = Math.floor(this.z);
	return this;
}

vec3.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
	return this;
}

vec3.prototype.clone = function() {
	return new this.constructor(this.x, this.y, this.z);
}

Object.assign(vec3.prototype, {

	isVec3: true,
	set: function(x, y, z) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

		this[0] = this.x;
		this[1] = this.y;
		this[2] = this.z;

		return this;
		/*	
		//not need this
				this.data=[x,y,z];
				return new Proxy(this, {
				    get: (obj, key) => {
				        if (typeof(key) === 'string' && (Number.isInteger(Number(key)))) // key is an index
				            return obj.data[key]
				        else 
				            return obj[key]
				    },
				    set: (obj, key, value) => {
				        if (typeof(key) === 'string' && (Number.isInteger(Number(key)))) // key is an index
				            return obj.data[key] = value
				        else 
				            return obj[key] = value
				    }
				})*/
	},

	toArray: function(array, offset) {

		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;
	},
});

