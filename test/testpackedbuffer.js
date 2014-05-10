/*
 * testpackedbuffer.js - test the packed buffer object
 * 
 * Copyright © 2014, JEDLSoft
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

function testPackedBufferConstructor() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
}

function testPackedBufferConstructorUndefined() {
    var pb = new PackedBuffer();
    
    assertNotNull(pb);
}

function testPackedBufferConstructorEmpty() {
    var pb = new PackedBuffer([]);
    
    assertNotNull(pb);
}

function testPackedBufferGetBytes1() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1], pb.getBytes(1));
}

function testPackedBufferGetBytes2() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2], pb.getBytes(2));
}

function testPackedBufferGetBytesUpdatePointer() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1], pb.getBytes(1));
    assertArrayEquals([2], pb.getBytes(1));
    assertArrayEquals([3], pb.getBytes(1));
}

function testPackedBufferGetBytesAtEnd() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2, 3], pb.getBytes(3));
    assertUndefined(pb.getBytes(3));
}

function testPackedBufferGetBytesPastEnd() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2], pb.getBytes(2));
    assertArrayEquals([3], pb.getBytes(3));
}

function testPackedBufferGetBytesNegative() {
    var pb = new PackedBuffer([255, 254, 253]);
    
    assertNotNull(pb);
    
    assertArrayEquals([-1, -2], pb.getBytes(2));
}

function testPackedBufferGetBytesEmpty() {
    var pb = new PackedBuffer([]);
    
    assertNotNull(pb);
    
    assertUndefined(pb.getBytes(2));
}

function testPackedBufferGetBytesUndefined() {
    var pb = new PackedBuffer();
    
    assertNotNull(pb);
    
    assertUndefined(pb.getBytes(2));
}

function testPackedBufferGetUnsignedBytes1() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1], pb.getUnsignedBytes(1));
}

function testPackedBufferGetUnsignedBytes2() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2], pb.getUnsignedBytes(2));
}

function testPackedBufferGetUnsignedBytesUpdatePointer() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1], pb.getUnsignedBytes(1));
    assertArrayEquals([2], pb.getUnsignedBytes(1));
    assertArrayEquals([3], pb.getUnsignedBytes(1));
}

function testPackedBufferGetUnsignedBytesAtEnd() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2, 3], pb.getUnsignedBytes(3));
    assertUndefined(pb.getUnsignedBytes(3));
}

function testPackedBufferGetUnsignedBytesPastEnd() {
    var pb = new PackedBuffer([1, 2, 3]);
    
    assertNotNull(pb);
    
    assertArrayEquals([1, 2], pb.getUnsignedBytes(2));
    assertArrayEquals([3], pb.getUnsignedBytes(3));
}

function testPackedBufferGetUnsignedBytesNegative() {
    var pb = new PackedBuffer([255, 254, 253]);
    
    assertNotNull(pb);
    
    assertArrayEquals([255, 254], pb.getUnsignedBytes(2));
}

function testPackedBufferGetUnsignedBytesEmpty() {
    var pb = new PackedBuffer([]);
    
    assertNotNull(pb);
    
    assertUndefined(pb.getUnsignedBytes(2));
}

function testPackedBufferGetUnsignedBytesUndefined() {
    var pb = new PackedBuffer();
    
    assertNotNull(pb);
    
    assertUndefined(pb.getUnsignedBytes(2));
}

function testPackedBufferGetLongs1() {
    var pb = new PackedBuffer([1, 2, 3, 4]);
    
    assertNotNull(pb);
    
    assertArrayEquals([16909060], pb.getLongs(1));
}

function testPackedBufferGetLongs2() {
    var pb = new PackedBuffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    
    assertNotNull(pb);
    
    assertArrayEquals([16909060, 84281096], pb.getLongs(2));
}

function testPackedBufferGetLongsUpdatePointer() {
    var pb = new PackedBuffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    
    assertNotNull(pb);
    
    assertArrayEquals([16909060], pb.getLongs(1));
    assertArrayEquals([84281096], pb.getLongs(1));
    assertArrayEquals([151653132], pb.getLongs(1));
}

function testPackedBufferGetLongsAtEnd() {
    var pb = new PackedBuffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    
    assertNotNull(pb);
    
    assertArrayEquals([16909060, 84281096, 151653132], pb.getLongs(3));
    assertUndefined(pb.getLongs(3));
}

function testPackedBufferGetLongsPastEnd() {
    var pb = new PackedBuffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    
    assertNotNull(pb);
    
    assertArrayEquals([16909060, 84281096], pb.getLongs(2));
    assertArrayEquals([151653132], pb.getLongs(3));
}

function testPackedBufferGetLongsNegative() {
    var pb = new PackedBuffer([255, 255, 255, 255, 255, 255, 255, 254]);
    
    assertNotNull(pb);
    
    assertArrayEquals([-1, -2], pb.getLongs(2));
}

function testPackedBufferGetLongsEmpty() {
    var pb = new PackedBuffer([]);
    
    assertNotNull(pb);
    
    assertUndefined(pb.getLongs(2));
}

function testPackedBufferGetLongsUndefined() {
    var pb = new PackedBuffer();
    
    assertNotNull(pb);
    
    assertUndefined(pb.getLongs(2));
}
