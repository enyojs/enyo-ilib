/*
 * testzoneinfo.js - test the zoneinfo object
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

function testZoneInfoFileConstructor() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Etc/UTC");
    
    assertNotNull(zif);
}

function testZoneInfoFileConstructor2() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Los_Angeles");
    
    assertNotNull(zif);
}

function testZoneInfoFileGetOffsetNone() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Etc/UTC");
    
    assertNotNull(zif);
    
    assertEquals(0, zif.getRawOffset(2014));
}

function testZoneInfoFileGetOffsetWest() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Los_Angeles");
    
    assertNotNull(zif);
    
    assertEquals(-8, zif.getRawOffset(2014));
}

function testZoneInfoFileGetOffsetEast() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Australia/Perth");
    
    assertNotNull(zif);
    
    assertEquals(8, zif.getRawOffset(2014));
}

function testZoneInfoFileUsesDSTFalse() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Los_Angeles");
    
    assertNotNull(zif);
}

function testZoneInfoFileUsesDSTTrue() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Europe/Berlin");
    
    assertNotNull(zif);
    
    assertTrue(zif.usesDST(2014));
}

function testZoneInfoFileUsesDSTFalse() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Asia/Shanghai");
    
    assertNotNull(zif);
    
    assertFalse(zif.usesDST(2014));
}

function testZoneInfoFileGetDSTSavings() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/New_York");
    
    assertNotNull(zif);
    
    assertEquals(60, zif.getDSTSavings(2014));
}

function testZoneInfoFileGetDSTSavingsOdd() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/Australia/Lord_Howe");
    
    assertNotNull(zif);
    
    assertEquals(30, zif.getDSTSavings(2014));
}

function testZoneInfoFileGetDSTSavingsNone() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Phoenix");
    
    assertNotNull(zif);
    
    assertEquals(0, zif.getDSTSavings(2014));
}

function testZoneInfoFileGetDSTStartDate() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Los_Angeles");
    
    assertNotNull(zif);
    
    // unix time of March 9, 2014 2:00am PST -> 3:00 am PDT
    assertEquals(1394359200000, zif.getDSTStartDate(2014));
}

function testZoneInfoFileGetDSTEndDate() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Los_Angeles");
    
    assertNotNull(zif);
    
    // unix time of Nov 2, 2014 2:00am PDT -> 1:00 am PST
    assertEquals(1414922400000, zif.getDSTEndDate(2014));
}

function testZoneInfoFileGetDSTStartDateNone() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Phoenix");
    
    assertNotNull(zif);
    
    // no DST in Arizona
    assertEquals(-1, zif.getDSTStartDate(2014));
}

function testZoneInfoFileGetDSTEndDateNone() {
    var zif = new ZoneInfoFile("/usr/share/zoneinfo/America/Phoenix");
    
    assertNotNull(zif);
    
    // no DST in Arizona
    assertEquals(-1, zif.getDSTEndDate(2014));
}
