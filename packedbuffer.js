/*
 * packedbuffer.js - represent a packed buffer of bytes
 * 
 * Copyright © 2014 LG Electronics, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @constructor
 * Represents a binary buffer of unsigned bytes that will be parsed in various ways. The buffer 
 * can be decoded by reading various lengths of bytes and interpretting them as longs
 * or unsigned bytes, etc. The bytes are interpretted in big-endian (network) format.
 * @param {string} buffer the binary buffer represented as a string
 */
var PackedBuffer = function (buffer) {
	this.buffer = buffer;
	this.index = 0;
};

/**
 * Return the specified number of signed long integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many longs as are available in the rest of the
 * buffer.
 * 
 * @param {number} num The number of longs to return
 * @returns {Array.<number>} the array of signed long integers
 */
PackedBuffer.prototype.getLongs = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index+3 < this.buffer.length; i++) {
			var long = this.buffer[this.index] << 24 | 
				this.buffer[this.index+1] << 16 | 
				this.buffer[this.index+2] << 8 | 
				this.buffer[this.index+3];
			result.push(long);
			this.index += 4;
		}
	}
	return result;
};

/**
 * Return the specified number of signed byte integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many bytes as are available in the rest of the
 * buffer.
 * 
 * @param {number} num The number of bytes to return
 * @returns {Array.<number>} the array of signed byte integers
 */
PackedBuffer.prototype.getBytes = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index < this.buffer.length; i++) {
			var byte = this.buffer[this.index++];
			if (byte & 0x80) {
				byte -= 0x100;
			}
			result.push(byte);
		}
	}
	return result;
};

/**
 * Return the specified number of unsigned byte integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many bytes as are available in the rest of the
 * buffer.
 * 
 * @param {number} num The number of bytes to return
 * @returns {Array.<number>} the array of unsigned byte integers
 */
PackedBuffer.prototype.getUnsignedBytes = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index < this.buffer.length; i++) {
			result.push(this.buffer[this.index++]);
		}
	}
	return result;
	
};

/**
 * Advance the current pointer in the buffer by the specified number of
 * bytes in the string.
 * 
 * @param {number} num The number of bytes to skip
 */
PackedBuffer.prototype.skip = function(num) {
	this.index += num;
};
